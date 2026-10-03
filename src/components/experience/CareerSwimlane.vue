<template>
  <div class="swimlane">
    <div
      ref="plotRef"
      class="plot"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @pointerleave="hoverPct = null"
    >
      <!-- The year axis starts after the category column so it lines up with the bars. -->
      <div class="row">
        <span class="axis-spacer" aria-hidden="true" />
        <div ref="axisRef" class="axis" aria-hidden="true">
          <span
            v-for="tick in ticks"
            :key="tick.year"
            class="tick"
            :style="{ left: tick.pct + '%' }"
          >{{ tick.year }}</span>
        </div>
      </div>

      <div v-for="lane in laneRows" :key="lane.key" class="row lane" :class="`lane--${lane.key}`">
        <p class="lane-name">{{ lane.label }}</p>
        <div class="track" :class="lane.key === 'engineering' ? 'track--main' : 'track--thin'">
          <button
            v-for="bar in lane.bars"
            :key="bar.index"
            type="button"
            class="bar"
            :class="{
              active: bar.index === activeIndex,
              rest: activeIndex < 0 && lane.key === 'engineering',
            }"
            :data-index="bar.index"
            :style="{ left: bar.left + '%', width: bar.width + '%' }"
            :aria-label="`${bar.entry.summary}, ${bar.entry.company}, ${bar.entry.period}`"
            :aria-pressed="bar.index === activeIndex ? 'true' : 'false'"
            @click="pick(bar.index, $event.currentTarget)"
            @focus="pick(bar.index, $event.currentTarget)"
          >
            <span v-if="lane.key === 'engineering' && bar.width >= 18" class="bar-label">{{ bar.entry.summary }}</span>
          </button>
        </div>
      </div>

      <div class="cursor-layer" aria-hidden="true">
        <span v-if="hoverPct !== null" class="cursor" :style="{ left: hoverPct + '%' }" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  entries: { type: Array, required: true },
  lanes: { type: Array, required: true },
  activeIndex: { type: Number, default: 0 },
})

// `anchor` carries the bar element the selection came from, so the parent can
// place a popover under it.
const emit = defineEmits(['update:activeIndex', 'anchor'])

const plotRef = ref(null)
const axisRef = ref(null)
const hoverPct = ref(null)
let dragging = false

// Axis runs from January of the first start year to January after the last end.
const range = computed(() => {
  const starts = props.entries.map((e) => e.start)
  const ends = props.entries.map((e) => e.end)
  const min = Math.floor(Math.min(...starts) / 12) * 12
  const max = Math.ceil((Math.max(...ends) + 1) / 12) * 12
  return { min, max, span: Math.max(max - min, 1) }
})

const pct = (month) => ((month - range.value.min) / range.value.span) * 100

const ticks = computed(() => {
  const { min, max } = range.value
  const out = []
  for (let m = min; m < max; m += 12) out.push({ year: m / 12, pct: pct(m) })
  return out
})

// A role appears in every lane it belongs to (e.g. the PM role is both
// engineering and product), so the engineering line never breaks.
const laneRows = computed(() =>
  props.lanes.map((lane) => ({
    key: lane.key,
    label: lane.label,
    bars: lane.indices.map((index) => {
      const entry = props.entries[index]
      return {
        entry,
        index,
        left: pct(entry.start),
        width: Math.max(pct(entry.end) - pct(entry.start), 1.5),
      }
    }),
  }))
)

// Measured against the timeline column (the axis), not the whole plot, because
// the category labels take the left part of each row.
function monthAt(event) {
  const rect = axisRef.value.getBoundingClientRect()
  const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width)
  hoverPct.value = (x / rect.width) * 100
  return range.value.min + (x / rect.width) * range.value.span
}

// The role active at that month; in a gap, the nearest one.
function indexAt(month) {
  let best = 0
  let bestDist = Infinity
  props.entries.forEach((e, i) => {
    const dist = month < e.start ? e.start - month : month >= e.end ? month - e.end : 0
    if (dist < bestDist) {
      bestDist = dist
      best = i
    }
  })
  return best
}

function pick(index, barEl) {
  emit('anchor', barEl)
  emit('update:activeIndex', index)
}

// Prefer the bar in the lane under the pointer; fall back to the role's first bar.
function barFor(index, event) {
  const lane = event.target?.closest?.('.lane')
  const selector = `.bar[data-index="${index}"]`
  return lane?.querySelector(selector) || plotRef.value.querySelector(selector)
}

function scrub(event) {
  const index = indexAt(monthAt(event))
  if (index === props.activeIndex) return
  const bar = barFor(index, event)
  if (bar) pick(index, bar)
}

function onPointerDown(event) {
  dragging = true
  plotRef.value.setPointerCapture?.(event.pointerId)
  scrub(event)
}

function onPointerMove(event) {
  // Mouse selects while hovering a lane (not the year axis, so passing over the
  // top of the chart doesn't open anything); touch/pen only while dragging, so a
  // tap-and-scroll on a phone doesn't reshuffle the selection.
  if (dragging) scrub(event)
  else if (event.pointerType === 'mouse') {
    if (event.target.closest?.('.lane')) scrub(event)
    else hoverPct.value = null
  }
}

function onPointerUp(event) {
  dragging = false
  plotRef.value.releasePointerCapture?.(event.pointerId)
  if (event.pointerType !== 'mouse') hoverPct.value = null
}
</script>

<style scoped>
.plot {
  --label-w: 0px;
  --label-gap: 0px;
  position: relative;
  /* Solid, so the fixed page background (grid + spotlight) doesn't show behind the chart. */
  background: var(--color-bg);
  /* Vertical swipes still scroll the page; horizontal drags scrub. */
  touch-action: pan-y;
  user-select: none;
  cursor: ew-resize;
}

/* Phones: the category sits above its line. */
.axis-spacer {
  display: none;
}

.axis {
  position: relative;
  height: 18px;
}

.tick {
  position: absolute;
  bottom: 2px;
  transform: translateX(-50%);
  font-size: var(--text-xs);
  font-variant-numeric: tabular-nums;
  color: var(--color-text-faint);
}

.tick:first-child {
  transform: none;
}

/* Phones: a year is only ~40px wide. Centred labels would collide with the
   left-aligned first one, so every label starts at its year line instead: even
   rhythm, all years up to the current one. */
@media (max-width: 679px) {
  .tick {
    transform: none;
  }
}

.lane {
  --lane-color: var(--chart-engineering);
  margin-top: 18px;
}

.lane--leadership {
  --lane-color: var(--chart-tools);
}

.lane--product {
  --lane-color: var(--chart-product);
}

.lane-name {
  margin-bottom: 8px;
  font-size: var(--text-sm);
  font-weight: 600;
  letter-spacing: 0.01em;
  color: var(--lane-color);
}

.track {
  position: relative;
}

.track--main {
  height: 22px;
}

.track--thin {
  height: 14px;
}

.bar {
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  padding: 0 8px;
  overflow: hidden;
  border: none;
  border-radius: 4px;
  background: var(--lane-color);
  opacity: 0.3;
  cursor: pointer;
  transition: opacity 0.18s ease;
}

.bar:hover {
  opacity: 0.6;
}

.bar.active {
  opacity: 1;
}

/* Nothing hovered yet: the first line (engineering) reads as active. As soon as
   a role is hovered, only that role is active and the rest dim. */
.bar.rest {
  opacity: 1;
}

.bar.rest:hover {
  opacity: 1;
}

.bar-label {
  display: none;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-accent-ink);
  white-space: nowrap;
}

/* Sits over the timeline column only, so `left: %` lines up with the axis. */
.cursor-layer {
  position: absolute;
  top: 18px;
  bottom: 0;
  left: calc(var(--label-w) + var(--label-gap));
  right: 0;
  pointer-events: none;
}

.cursor {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--color-text-faint);
}

/* Tablet and up: category on the same row as its line, axis after the category. */
@media (min-width: 680px) {
  .plot {
    --label-w: 168px;
    --label-gap: 16px;
  }

  .row {
    display: grid;
    grid-template-columns: var(--label-w) 1fr;
    column-gap: var(--label-gap);
    align-items: center;
  }

  .axis-spacer {
    display: block;
  }

  .lane-name {
    margin-bottom: 0;
  }
}

@media (min-width: 900px) {
  .bar-label {
    display: block;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bar {
    transition: none;
  }
}
</style>
