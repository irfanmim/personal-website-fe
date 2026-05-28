<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="modelValue"
        class="lightbox-backdrop"
        @click.self="handleBackdropClick"
        @wheel.prevent="onWheel"
      >
        <button class="lightbox-close" @click="close" aria-label="Close">&#x2715;</button>

        <div class="lightbox-zoom-controls">
          <button class="zoom-btn" @click="zoomOut" aria-label="Zoom out" :disabled="zoom <= MIN_ZOOM">&#x2212;</button>
          <span class="zoom-label">{{ Math.round(zoom * 100) }}%</span>
          <button class="zoom-btn" @click="zoomIn" aria-label="Zoom in" :disabled="zoom >= MAX_ZOOM">&#x2b;</button>
          <button class="zoom-btn zoom-reset" @click="resetZoom" aria-label="Reset zoom" v-if="zoom !== 1">&#x21ba;</button>
        </div>

        <div
          class="lightbox-img-wrapper"
          :class="{ dragging: isDragging, zoomed: zoom > 1 }"
          @click.self="handleBackdropClick"
          @mousedown="onDragStart"
          @mousemove="onDragMove"
          @mouseup="onDragEnd"
          @mouseleave="onDragEnd"
          @touchstart.passive="onTouchStart"
          @touchmove.prevent="onTouchMove"
          @touchend="onTouchEnd"
          @dblclick.self="toggleZoom"
        >
          <img
            class="lightbox-img"
            :src="src"
            :alt="alt"
            :style="imgStyle"
            @click.stop
            @dragstart.prevent
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  src: { type: String, required: true },
  alt: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

const MIN_ZOOM = 0.5
const MAX_ZOOM = 5
const ZOOM_STEP = 0.15

const zoom = ref(1)
const translateX = ref(0)
const translateY = ref(0)

const isDragging = ref(false)
const dragMoved = ref(false)
const dragStart = ref({ x: 0, y: 0 })

// Touch pinch state
const lastTouchDist = ref(null)

const imgStyle = computed(() => ({
  transform: `translate(${translateX.value}px, ${translateY.value}px) scale(${zoom.value})`,
}))

function close() {
  emit('update:modelValue', false)
}

function handleBackdropClick() {
  if (dragMoved.value) {
    dragMoved.value = false
    return
  }
  close()
}

function zoomIn() {
  zoom.value = Math.min(MAX_ZOOM, +(zoom.value + ZOOM_STEP).toFixed(2))
}

function zoomOut() {
  zoom.value = Math.max(MIN_ZOOM, +(zoom.value - ZOOM_STEP).toFixed(2))
  clampTranslate()
}

function resetZoom() {
  zoom.value = 1
  translateX.value = 0
  translateY.value = 0
}

function toggleZoom() {
  if (zoom.value !== 1) {
    resetZoom()
  } else {
    zoom.value = 2
  }
}

function onWheel(e) {
  const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP
  const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +(zoom.value + delta).toFixed(2)))
  zoom.value = next
  if (next <= 1) {
    translateX.value = 0
    translateY.value = 0
  }
  clampTranslate()
}

function clampTranslate() {
  if (zoom.value <= 1) {
    translateX.value = 0
    translateY.value = 0
  }
}

// Mouse drag
function onDragStart(e) {
  if (zoom.value <= 1) return
  isDragging.value = true
  dragMoved.value = false
  dragStart.value = { x: e.clientX - translateX.value, y: e.clientY - translateY.value }
}

function onDragMove(e) {
  if (!isDragging.value) return
  dragMoved.value = true
  translateX.value = e.clientX - dragStart.value.x
  translateY.value = e.clientY - dragStart.value.y
}

function onDragEnd() {
  isDragging.value = false
  // dragMoved is intentionally left true here so the subsequent click event can read it
}

// Touch pinch-to-zoom
function getTouchDist(touches) {
  const dx = touches[0].clientX - touches[1].clientX
  const dy = touches[0].clientY - touches[1].clientY
  return Math.sqrt(dx * dx + dy * dy)
}

function onTouchStart(e) {
  if (e.touches.length === 2) {
    lastTouchDist.value = getTouchDist(e.touches)
  } else if (e.touches.length === 1 && zoom.value > 1) {
    isDragging.value = true
    dragStart.value = {
      x: e.touches[0].clientX - translateX.value,
      y: e.touches[0].clientY - translateY.value,
    }
  }
}

function onTouchMove(e) {
  if (e.touches.length === 2 && lastTouchDist.value !== null) {
    const dist = getTouchDist(e.touches)
    const scale = dist / lastTouchDist.value
    zoom.value = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +(zoom.value * scale).toFixed(2)))
    lastTouchDist.value = dist
    clampTranslate()
  } else if (e.touches.length === 1 && isDragging.value) {
    translateX.value = e.touches[0].clientX - dragStart.value.x
    translateY.value = e.touches[0].clientY - dragStart.value.y
  }
}

function onTouchEnd(e) {
  if (e.touches.length < 2) lastTouchDist.value = null
  if (e.touches.length === 0) isDragging.value = false
}

function onKey(e) {
  if (e.key === 'Escape') close()
  if (e.key === '+' || e.key === '=') zoomIn()
  if (e.key === '-') zoomOut()
  if (e.key === '0') resetZoom()
}

watch(() => props.modelValue, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
  if (!open) resetZoom()
})

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.lightbox-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow: hidden;
}

.lightbox-img-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  cursor: default;
  user-select: none;
}

.lightbox-img-wrapper.zoomed {
  cursor: grab;
}

.lightbox-img-wrapper.dragging {
  cursor: grabbing;
}

.lightbox-img {
  max-width: 70%;
  max-height: 63vh;
  border-radius: 8px;
  object-fit: contain;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
  transition: transform 0.12s ease;
  pointer-events: none;
}

.lightbox-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.4rem;
  cursor: pointer;
  line-height: 1;
  opacity: 0.7;
  transition: opacity 0.15s;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.lightbox-close:hover {
  opacity: 1;
}

.lightbox-zoom-controls {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(0, 0, 0, 0.55);
  border-radius: 24px;
  padding: 6px 12px;
  z-index: 10;
}

.zoom-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.1rem;
  cursor: pointer;
  min-width: 32px;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  opacity: 0.8;
  transition: opacity 0.15s, background 0.15s;
}

.zoom-btn:hover:not(:disabled) {
  opacity: 1;
  background: rgba(255, 255, 255, 0.15);
}

.zoom-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

.zoom-reset {
  font-size: 1.2rem;
}

.zoom-label {
  color: #fff;
  font-size: 0.8rem;
  min-width: 44px;
  text-align: center;
  opacity: 0.9;
}

@media (max-width: 640px) {
  .lightbox-img {
    max-width: 92%;
    max-height: 80vh;
  }
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.2s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
