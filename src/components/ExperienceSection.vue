<template>
  <section class="experience">
    <div class="section-head">
      <h2 class="section-title">Experience</h2>
      <p v-if="entries.length" class="hint">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0V11m0-1a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1-6 6h-1.2a6 6 0 0 1-4.7-2.3L4 14.6a1.6 1.6 0 0 1 2.4-2.1L9 15" />
        </svg>
        Hover a role to see what I did there.
      </p>
    </div>

    <div
      v-if="entries.length"
      ref="careerRef"
      class="career"
      role="group"
      aria-label="Career timeline. Hover a role, or use the left and right arrow keys, to see its details."
      @keydown="onKeydown"
      @mouseenter="cancelClose"
      @mouseleave="scheduleClose"
      @focusout="onFocusOut"
    >
      <CareerSwimlane
        :active-index="open ? activeIndex : -1"
        :entries="entries"
        :lanes="timeline.lanes"
        @update:active-index="select"
        @anchor="placePopover"
      />
      <div
        class="panel"
        :class="{ 'panel--open': open }"
        :style="popoverStyle"
        :aria-hidden="open ? 'false' : 'true'"
      >
        <RoleDetail :entry="entries[activeIndex]" />
      </div>
    </div>

    <div v-if="viewMoreUrl" class="view-more-wrap">
      <a :href="viewMoreUrl" target="_blank" rel="noopener" class="view-more">More on LinkedIn <span aria-hidden="true">→</span></a>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { buildCareerTimeline } from '../utils/careerTimeline.js'
import CareerSwimlane from './experience/CareerSwimlane.vue'
import RoleDetail from './experience/RoleDetail.vue'

const props = defineProps({
  experiences: {
    type: Array,
    required: true,
  },
  viewMoreUrl: {
    type: String,
    default: '',
  },
})

const timeline = computed(() => buildCareerTimeline(props.experiences))
const entries = computed(() => timeline.value.entries)

// The details panel is closed until a role is hovered, focused or tapped; it
// starts on the most recent role.
const latestIndex = () => Math.max(entries.value.length - 1, 0)
const activeIndex = ref(latestIndex())
const open = ref(false)
const careerRef = ref(null)
let closeTimer = null

watch(
  () => entries.value.length,
  () => {
    activeIndex.value = latestIndex()
  }
)

// Popover always sits just under the last lane (not under the hovered point),
// horizontally centred on the hovered bar and kept inside the section.
const popover = ref({ left: 0, top: 0, width: 560 })
const popoverStyle = computed(() => ({
  left: popover.value.left + 'px',
  top: popover.value.top + 'px',
  width: popover.value.width + 'px',
}))

function placePopover(barEl) {
  const container = careerRef.value
  if (!container || !barEl) return
  const c = container.getBoundingClientRect()
  const b = barEl.getBoundingClientRect()
  const plot = container.querySelector('.plot')?.getBoundingClientRect() ?? b
  const width = Math.min(560, c.width)
  const center = b.left - c.left + b.width / 2
  popover.value = {
    width,
    left: Math.max(0, Math.min(center - width / 2, c.width - width)),
    top: plot.bottom - c.top + 14,
  }
}

function select(index) {
  activeIndex.value = index
  cancelClose()
  open.value = true
}

function cancelClose() {
  clearTimeout(closeTimer)
}

// Short delay so the pointer can cross from the chart to the panel.
function scheduleClose() {
  clearTimeout(closeTimer)
  closeTimer = setTimeout(() => (open.value = false), 220)
}

function onFocusOut(event) {
  if (!careerRef.value?.contains(event.relatedTarget)) scheduleClose()
}

function onKeydown(event) {
  if (event.key === 'Escape') {
    open.value = false
    return
  }
  const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
  if (!delta) return
  const next = activeIndex.value + delta
  if (next < 0 || next >= entries.value.length) return
  event.preventDefault()
  placePopover(careerRef.value?.querySelector(`.bar[data-index="${next}"]`))
  select(next)
}

// Touch has no hover-out, so a tap anywhere else closes the panel.
function onOutsidePointer(event) {
  if (!careerRef.value?.contains(event.target)) open.value = false
}

onMounted(() => document.addEventListener('pointerdown', onOutsidePointer))
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onOutsidePointer)
  clearTimeout(closeTimer)
})
</script>

<style scoped>
.experience {
  padding: 80px 0;
  border-top: 1px solid var(--color-border);
}

/* Title on the left, the hover hint on the right (wraps under the title on phones). */
.section-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 24px;
  margin-bottom: 28px;
}

.section-title {
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: -0.01em;
  font-size: var(--text-h2);
  color: var(--color-text);
}

.career {
  position: relative;
}

/* Styled as an instruction (pill, accent colour, icon) so it can't be mistaken
   for a fourth lane label. */
.hint {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 1px dashed var(--color-border-strong);
  border-radius: 999px;
  font-size: var(--text-sm);
  color: var(--color-accent-strong);
}

/* Popover anchored under the hovered bar (left/top/width are set inline); it
   floats over the chart and what follows instead of pushing anything down. */
.panel {
  position: absolute;
  z-index: 20;
  border-radius: 16px;
  box-shadow: 0 24px 60px -24px rgba(0, 0, 0, 0.45);
  opacity: 0;
  visibility: hidden;
  transform: translateY(6px);
  pointer-events: none;
  transition: opacity 0.15s ease, transform 0.15s ease, visibility 0.15s;
}

/* Hover bridge across the gap between the bar and the popover. */
.panel::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: -14px;
  height: 14px;
}

.panel--open {
  opacity: 1;
  visibility: visible;
  transform: none;
  pointer-events: auto;
}

@media (prefers-reduced-motion: reduce) {
  .panel {
    transition: none;
  }
}

.view-more-wrap {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

/* Same outline button as "View all projects". */
.view-more {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-accent-strong);
  background: transparent;
  border: 1px solid var(--color-accent);
  text-decoration: none;
  border-radius: 12px;
  padding: 10px 20px;
  transition: background 0.15s ease, color 0.15s ease;
}

.view-more:hover {
  background: color-mix(in srgb, var(--color-accent) 12%, transparent);
}

@media (min-width: 1024px) {
  .experience {
    padding: 120px 0;
  }

  .section-title {
    font-size: var(--text-h2);
  }
}
</style>
