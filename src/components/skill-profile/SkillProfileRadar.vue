<template>
  <svg
    class="radar"
    :class="{ revealed }"
    :viewBox="`0 0 ${W} ${H}`"
    role="group"
    aria-label="T-shaped skill profile, radar chart"
  >
    <defs>
      <radialGradient id="sp-radar-fill" cx="50%" cy="42%" r="65%">
        <stop offset="0" style="stop-color: var(--chart-engineering); stop-opacity: 0.42" />
        <stop offset="0.6" style="stop-color: var(--chart-product); stop-opacity: 0.28" />
        <stop offset="1" style="stop-color: var(--chart-product); stop-opacity: 0.05" />
      </radialGradient>
    </defs>

    <g aria-hidden="true">
      <polygon
        v-for="ring in rings"
        :key="ring.f"
        :points="ring.points"
        class="ring"
      />
      <line
        v-for="(spoke, i) in spokes"
        :key="i"
        :x1="CX"
        :y1="CY"
        :x2="spoke[0]"
        :y2="spoke[1]"
        class="ring"
      />
    </g>

    <polygon class="poly" :points="dataPoints" fill="url(#sp-radar-fill)" aria-hidden="true" />
    <polygon
      class="stroke"
      :points="dataPoints"
      :style="{ '--perim': perimeter }"
      aria-hidden="true"
    />

    <g
      v-for="(v, i) in vertices"
      :key="v.item.key"
      class="hit"
      tabindex="0"
      :aria-label="describe(v.item)"
      @mouseenter="emit('show', v.item, $event)"
      @mousemove="emit('move', $event)"
      @mouseleave="emit('hide')"
      @focus="emit('show', v.item, $event)"
      @blur="emit('hide')"
    >
      <circle :cx="v.x" :cy="v.y" r="16" fill="transparent" />
      <circle
        class="vtx"
        :cx="v.x"
        :cy="v.y"
        :r="v.item.isPeak ? 5.5 : 3.6"
        :style="{
          fill: v.item.isPeak ? v.item.color : 'var(--color-text-faint)',
          transitionDelay: `${i * 60 + 500}ms`,
          filter: v.item.isPeak ? `drop-shadow(0 0 8px ${v.item.color})` : null,
        }"
      />
    </g>

    <text
      v-for="l in labels"
      :key="l.item.key"
      class="axis-label"
      :class="{ peak: l.item.isPeak }"
      :x="l.x"
      :y="l.y"
      :text-anchor="l.anchor"
      aria-hidden="true"
    >{{ l.item.label }}<tspan v-if="l.item.isPeak" class="axis-years" :x="l.x" dy="15">{{ l.item.years }} yrs</tspan></text>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  revealed: { type: Boolean, default: false },
})

const emit = defineEmits(['show', 'move', 'hide'])

const W = 480
const H = 440
const CX = 240
const CY = 214
const R = 140

const n = computed(() => props.items.length)
const angle = (i) => ((-90 + (i * 360) / n.value) * Math.PI) / 180
const point = (i, r) => [CX + Math.cos(angle(i)) * r, CY + Math.sin(angle(i)) * r]
const fmt = (p) => p.map((v) => v.toFixed(1)).join(',')

const rings = computed(() =>
  [0.25, 0.5, 0.75, 1].map((f) => ({
    f,
    points: props.items.map((_, i) => fmt(point(i, R * f))).join(' '),
  }))
)

const spokes = computed(() => props.items.map((_, i) => point(i, R).map((v) => v.toFixed(1))))

const vertices = computed(() =>
  props.items.map((item, i) => {
    const [x, y] = point(i, R * item.height)
    return { item, x: x.toFixed(1), y: y.toFixed(1), raw: [x, y] }
  })
)

const dataPoints = computed(() => vertices.value.map((v) => fmt(v.raw)).join(' '))

const perimeter = computed(() => {
  const pts = vertices.value.map((v) => v.raw)
  let total = 0
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i]
    const b = pts[(i + 1) % pts.length]
    total += Math.hypot(a[0] - b[0], a[1] - b[1])
  }
  return Math.ceil(total)
})

const labels = computed(() =>
  props.items.map((item, i) => {
    const [x, y] = point(i, R + 24)
    const a = angle(i)
    const cos = Math.cos(a)
    const sin = Math.sin(a)
    const anchor = Math.abs(cos) < 0.34 ? 'middle' : cos > 0 ? 'start' : 'end'
    const dy = sin > 0.5 ? 12 : sin < -0.5 ? (item.isPeak ? -14 : -4) : 4
    return { item, x: x.toFixed(1), y: (y + dy).toFixed(1), anchor }
  })
)

function describe(item) {
  return item.isPeak
    ? `${item.label}: ${item.durationLabel} of ${item.depthLabel}`
    : `${item.label}: ${item.tech.join(', ')}`
}
</script>

<style scoped>
.radar {
  display: block;
  width: auto;
  height: var(--chart-height, 400px);
  aspect-ratio: 480 / 440;
  max-width: 100%;
  margin: 0 auto;
  overflow: visible;
}

.ring {
  fill: none;
  stroke: var(--color-border-strong);
  stroke-width: 1;
}

.poly {
  opacity: 0;
}

.stroke {
  fill: none;
  stroke: var(--chart-engineering);
  stroke-width: 2;
  stroke-linejoin: round;
  stroke-dasharray: var(--perim);
  stroke-dashoffset: var(--perim);
}

.vtx {
  stroke: var(--color-bg-elevated);
  stroke-width: 1.5;
  opacity: 0;
  transform: scale(0.4);
  transform-origin: center;
  transform-box: fill-box;
}

.hit {
  cursor: pointer;
  outline: none;
}

.hit:focus-visible .vtx {
  stroke: var(--color-accent);
  stroke-width: 2.5;
}

.hit:hover .vtx {
  stroke: var(--color-text-faint);
}

.revealed .poly {
  opacity: 1;
  transition: opacity 0.9s ease 0.15s;
}

.revealed .stroke {
  stroke-dashoffset: 0;
  transition: stroke-dashoffset 1.15s cubic-bezier(0.35, 0.8, 0.25, 1) 0.1s;
}

.revealed .vtx {
  opacity: 1;
  transform: scale(1);
  transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.2, 0.9, 0.3, 1);
}

.axis-label {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  fill: var(--color-text-faint);
}

.axis-label.peak {
  font-weight: 700;
  fill: var(--color-text);
}

.axis-years {
  font-size: 11px;
  font-weight: 500;
  fill: var(--color-text-faint);
}

@media (prefers-reduced-motion: reduce) {
  .poly,
  .vtx {
    opacity: 1;
    transform: none;
  }

  .stroke {
    stroke-dashoffset: 0;
  }

  .revealed .poly,
  .revealed .stroke,
  .revealed .vtx {
    transition: none;
  }
}
</style>
