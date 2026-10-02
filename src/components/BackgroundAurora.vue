<template>
  <div ref="root" class="aurora" aria-hidden="true">
    <div class="aurora-blob aurora-blob-a" />
    <div class="aurora-blob aurora-blob-b" />
    <div class="aurora-spot">
      <div class="aurora-dim" />
      <div class="aurora-lit" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

// Scroll progress (0..1) drives the horizon glows' slide and hue via --sp.
// A pointer-following spotlight (--mx/--my) reveals a brighter grid; it drifts
// slowly when the pointer is idle, on touch, and is static with reduced motion.
const root = ref(null)
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const coarse = window.matchMedia('(hover: none)').matches

let ticking = false
let raf = 0
let lastMove = 0
let px = window.innerWidth * 0.5
let py = window.innerHeight * 0.4

function updateScroll() {
  ticking = false
  if (!root.value) return
  const max = document.documentElement.scrollHeight - window.innerHeight
  const sp = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
  root.value.style.setProperty('--sp', sp.toFixed(4))
}

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(updateScroll)
}

function frame(t) {
  raf = 0
  if (!root.value) return
  if (!reduceMotion && (coarse || t - lastMove > 1500)) {
    px = window.innerWidth * (0.5 + 0.32 * Math.sin(t / 3200))
    py = window.innerHeight * (0.4 + 0.22 * Math.cos(t / 2300))
  }
  root.value.style.setProperty('--mx', `${px}px`)
  root.value.style.setProperty('--my', `${py}px`)
  if (!reduceMotion) raf = requestAnimationFrame(frame)
}

function kick() {
  if (!raf) raf = requestAnimationFrame(frame)
}

function onPointerMove(e) {
  if (e.pointerType === 'touch') return
  px = e.clientX
  py = e.clientY
  lastMove = performance.now()
  kick()
}

onMounted(() => {
  updateScroll()
  kick()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  window.addEventListener('pointermove', onPointerMove, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  window.removeEventListener('pointermove', onPointerMove)
  if (raf) cancelAnimationFrame(raf)
})
</script>

<style scoped>
.aurora {
  --sp: 0;
  --mx: 50vw;
  --my: 40vh;
  --spot-strength: 0.4;
  --blob-opacity: 0.24;
  --lit-opacity: calc(0.9 * var(--spot-strength));
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
}

/* Light: same horizons at lower opacity, no square structure at all
   (a grid reads as ruled paper on a light page). */
[data-theme="light"] .aurora {
  --blob-opacity: 0.18;
}

[data-theme="light"] .aurora-spot {
  display: none;
}

/* Deep ocean horizons: wide flat glows along the top and bottom edges that
   slide in opposite directions, keeping the middle (the text) darkest. */
.aurora-blob {
  position: absolute;
  width: 85vw;
  height: 36vh;
  border-radius: 50%;
  filter: blur(90px);
  opacity: var(--blob-opacity);
  will-change: transform;
}

.aurora-blob-a {
  left: -15vw;
  top: -20vh;
  background: hsl(calc(178 + var(--sp) * 50) 80% 50%);
  transform: translate3d(calc(var(--sp) * 35vw), 0, 0);
}

.aurora-blob-b {
  left: 30vw;
  top: 84vh;
  background: hsl(calc(250 - var(--sp) * 35) 75% 60%);
  transform: translate3d(calc(var(--sp) * -40vw), 0, 0);
}

/* Spotlight: a faint 64px grid everywhere, brighter dots + lines under the pointer. */
.aurora-spot {
  position: absolute;
  inset: 0;
  -webkit-mask-image: radial-gradient(ellipse 90% 80% at 50% 40%, #000 30%, transparent 85%);
  mask-image: radial-gradient(ellipse 90% 80% at 50% 40%, #000 30%, transparent 85%);
}

.aurora-dim,
.aurora-lit {
  position: absolute;
  inset: 0;
  background-size: 64px 64px;
}

.aurora-dim {
  opacity: calc(0.06 * var(--spot-strength));
  background-image:
    linear-gradient(rgba(148, 163, 184, 1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 1) 1px, transparent 1px);
}

.aurora-lit {
  opacity: var(--lit-opacity);
  background-image:
    radial-gradient(circle at 0 0, rgba(94, 234, 212, 1) 1.8px, transparent 2.4px),
    linear-gradient(rgba(34, 211, 238, 0.25) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34, 211, 238, 0.25) 1px, transparent 1px);
  -webkit-mask-image: radial-gradient(280px circle at var(--mx) var(--my), #000, transparent 70%);
  mask-image: radial-gradient(280px circle at var(--mx) var(--my), #000, transparent 70%);
}

@media (prefers-reduced-motion: reduce) {
  .aurora-blob {
    transform: none;
  }
}
</style>
