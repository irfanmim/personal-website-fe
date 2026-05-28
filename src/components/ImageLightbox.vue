<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div v-if="modelValue" class="lightbox-backdrop" @click.self="close">
        <button class="lightbox-close" @click="close" aria-label="Close">&#x2715;</button>
        <img class="lightbox-img" :src="src" :alt="alt" @click.stop />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  src: { type: String, required: true },
  alt: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', false)
}

function onKey(e) {
  if (e.key === 'Escape') close()
}

watch(() => props.modelValue, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
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
}

.lightbox-img {
  max-width: 70%;
  max-height: 63vh;
  border-radius: 8px;
  object-fit: contain;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
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
}

.lightbox-close:hover {
  opacity: 1;
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
