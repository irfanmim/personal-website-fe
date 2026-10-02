<template>
  <div ref="root" class="radar-wrap" :class="{ revealed }">
    <svg
      class="radar"
      :viewBox="`0 0 ${g.W} ${g.H}`"
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
        <path
          v-for="w in wedges"
          :key="w.pillar"
          class="wedge"
          :class="{ dim: isDim(w.pillar) }"
          :d="w.d"
          :style="{
            fill: `color-mix(in srgb, ${w.color} 9%, transparent)`,
            stroke: `color-mix(in srgb, ${w.color} 30%, transparent)`,
          }"
        />
        <polygon
          v-for="ring in rings"
          :key="ring.f"
          :points="ring.points"
          class="ring"
        />
        <line
          v-for="(spoke, i) in spokes"
          :key="i"
          :x1="g.CX"
          :y1="g.CY"
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
        :class="{ dim: isDim(v.item.pillar) }"
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
          r="4.6"
          :style="{
            fill: v.item.color,
            transitionDelay: `${i * 60 + 500}ms`,
            filter: `drop-shadow(0 0 6px ${v.item.color})`,
          }"
        />
      </g>

      <text
        v-for="l in labels"
        :key="l.item.key"
        class="axis-label"
        :class="{ dim: isDim(l.item.pillar) }"
        :x="l.x"
        :y="l.y"
        :text-anchor="l.anchor"
        :style="{ fontSize: g.fs + 'px', fill: l.item.softColor }"
        aria-hidden="true"
      ><tspan
        v-for="(line, k) in l.lines"
        :key="k"
        :x="l.x"
        :dy="k === 0 ? 0 : g.lh"
      >{{ line }}</tspan></text>
    </svg>

  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  spotlight: { type: String, default: null },
  revealed: { type: Boolean, default: false },
})

const emit = defineEmits(['show', 'move', 'hide'])

const GEOMETRY = {
  wide: { W: 600, H: 410, CX: 300, CY: 205, R: 130, off: 22, fs: 13, lh: 15 },
  compact: { W: 360, H: 372, CX: 180, CY: 184, R: 96, off: 14, fs: 11.5, lh: 12 },
}

const root = ref(null)
const compact = ref(false)
let observer = null

onMounted(() => {
  if (typeof ResizeObserver === 'undefined' || !root.value) return
  observer = new ResizeObserver(([entry]) => {
    compact.value = entry.contentRect.width < 430
  })
  observer.observe(root.value)
})

onBeforeUnmount(() => observer?.disconnect())

const g = computed(() => (compact.value ? GEOMETRY.compact : GEOMETRY.wide))

const n = computed(() => props.items.length)
const angleDeg = (i) => -90 + (i * 360) / n.value
const angle = (i) => (angleDeg(i) * Math.PI) / 180
const point = (i, r) => [g.value.CX + Math.cos(angle(i)) * r, g.value.CY + Math.sin(angle(i)) * r]
const fmt = (p) => p.map((v) => v.toFixed(1)).join(',')

const rings = computed(() =>
  [0.25, 0.5, 0.75, 1].map((f) => ({
    f,
    points: props.items.map((_, i) => fmt(point(i, g.value.R * f))).join(' '),
  }))
)

const spokes = computed(() => props.items.map((_, i) => point(i, g.value.R).map((v) => v.toFixed(1))))

const isDim = (pillar) => !!props.spotlight && props.spotlight !== pillar

// One tinted wedge per pillar, spanning its contiguous run of axes.
const wedges = computed(() => {
  const runs = []
  props.items.forEach((item, i) => {
    const last = runs[runs.length - 1]
    if (last && last.pillar === item.pillar) last.end = i
    else runs.push({ pillar: item.pillar, color: item.color, start: i, end: i })
  })
  const { CX, CY, R } = g.value
  const step = 360 / n.value
  // The grid rings are polygons, so wedges follow the polygon edge (through each
  // axis vertex, with the midpoint of the edge between pillars) rather than a circle.
  const edgeR = R * Math.cos((step / 2) * (Math.PI / 180))
  const at = (deg, r) => [
    CX + Math.cos((deg * Math.PI) / 180) * r,
    CY + Math.sin((deg * Math.PI) / 180) * r,
  ]
  return runs.map((run) => {
    const pts = [at(-90 + (run.start - 0.5) * step, edgeR)]
    for (let i = run.start; i <= run.end; i++) pts.push(at(-90 + i * step, R))
    pts.push(at(-90 + (run.end + 0.5) * step, edgeR))
    return {
      pillar: run.pillar,
      color: run.color,
      d: `M${CX},${CY} ${pts.map((p) => `L${fmt(p)}`).join(' ')} Z`,
    }
  })
})

const vertices = computed(() =>
  props.items.map((item, i) => {
    const [x, y] = point(i, g.value.R * item.height)
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
    const [x, y] = point(i, g.value.R + g.value.off)
    const a = angle(i)
    const cos = Math.cos(a)
    const sin = Math.sin(a)
    const anchor = Math.abs(cos) < 0.34 ? 'middle' : cos > 0 ? 'start' : 'end'
    const lines = compact.value ? [item.short] : item.lines
    const extra = (lines.length - 1) * g.value.lh
    const dy = sin > 0.5 ? 12 : sin < -0.5 ? -4 - extra : 4 - extra / 2
    return { item, lines, x: x.toFixed(1), y: (y + dy).toFixed(1), anchor }
  })
)

function describe(item) {
  return `${item.label}: ${item.tech.join(', ')}. ${item.note}`
}
</script>

<style scoped>
.radar-wrap {
  display: flex;
  flex-direction: column;
  height: var(--chart-height, 400px);
}

.radar {
  display: block;
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow: visible;
}

.ring {
  fill: none;
  stroke: var(--color-border-strong);
  stroke-width: 1;
}

.wedge {
  stroke-width: 1;
  opacity: 0;
}

.wedge,
.hit,
.axis-label {
  transition: opacity 0.15s ease;
}

.revealed .wedge {
  opacity: 1;
  transition: opacity 0.6s ease 0.2s;
}

.revealed .wedge.dim,
.hit.dim,
.axis-label.dim {
  opacity: 0.18;
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
  font-weight: 500;
}

@media (prefers-reduced-motion: reduce) {
  .poly,
  .wedge,
  .vtx {
    opacity: 1;
    transform: none;
  }

  .stroke {
    stroke-dashoffset: 0;
  }

  .revealed .poly,
  .revealed .wedge,
  .revealed .stroke,
  .revealed .vtx {
    transition: none;
  }
}
</style>
