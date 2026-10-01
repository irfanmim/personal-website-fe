<template>
  <div class="bento" :class="{ revealed }" role="group" aria-label="T-shaped skill profile, bento grid">
    <div
      v-for="(peak, p) in peaks"
      :key="peak.key"
      class="card anchor"
      :class="p === 0 ? 'anchor--primary' : 'anchor--secondary'"
      :style="anchorStyle(peak, p)"
      tabindex="0"
      :aria-label="`${peak.label}: ${peak.durationLabel} of ${peak.depthLabel}`"
      @mouseenter="emit('show', peak, $event)"
      @mousemove="emit('move', $event)"
      @mouseleave="emit('hide')"
      @focus="emit('show', peak, $event)"
      @blur="emit('hide')"
    >
      <div class="anchor-body">
        <span class="badge" :style="badgeStyle(peak)">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M12 3v18M5 8l7-5 7 5" /></svg>
          Core depth
        </span>
        <p class="anchor-label">{{ peak.label }}</p>
        <p class="anchor-tech">{{ peak.tech.join(', ') }}</p>
      </div>
      <div class="anchor-figure">
        <div class="figure-row">
          <span class="figure" :style="{ backgroundImage: `linear-gradient(120deg, ${peak.softColor}, ${peak.color})` }">{{ peak.years }}</span>
          <span class="figure-unit">yrs in {{ peak.depthLabel.replace(' depth', '') }}</span>
        </div>
        <div class="heatbar">
          <span
            class="heatfill"
            :style="{
              '--w': `${(peak.months / maxMonths) * 100}%`,
              background: `linear-gradient(90deg, ${peak.color}, ${peak.softColor})`,
            }"
          />
        </div>
      </div>
    </div>

    <div
      v-for="(item, i) in breadth"
      :key="item.key"
      class="card small"
      :style="{ transitionDelay: `${(i + 2) * 60}ms` }"
      tabindex="0"
      :aria-label="`${item.label}: ${item.tech.join(', ')}`"
      @mouseenter="emit('show', item, $event)"
      @mousemove="emit('move', $event)"
      @mouseleave="emit('hide')"
      @focus="emit('show', item, $event)"
      @blur="emit('hide')"
    >
      <div class="small-head">
        <span class="small-label">{{ item.label }}</span>
        <span class="dot" aria-hidden="true" />
      </div>
      <p class="small-tech">{{ item.tech.join(', ') }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  revealed: { type: Boolean, default: false },
})

const emit = defineEmits(['show', 'move', 'hide'])

const peaks = computed(() => props.items.filter((i) => i.isPeak).sort((a, b) => b.months - a.months))
const breadth = computed(() => props.items.filter((i) => !i.isPeak))
const maxMonths = computed(() => Math.max(...peaks.value.map((p) => p.months), 1))

const mix = (color, pct) => `color-mix(in srgb, ${color} ${pct}%, transparent)`

function anchorStyle(peak, p) {
  const other = peaks.value[1 - p] || peak
  return {
    transitionDelay: `${p * 60}ms`,
    background: [
      `radial-gradient(120% 120% at ${p === 0 ? '15% 10%' : '90% 10%'}, ${mix(peak.color, 24)}, transparent 55%)`,
      `radial-gradient(120% 120% at ${p === 0 ? '90% 95%' : '5% 90%'}, ${mix(other.color, 18)}, transparent 55%)`,
      'var(--color-panel-2)',
    ].join(', '),
    borderColor: mix(peak.color, 38),
    boxShadow: `0 0 0 1px ${mix(peak.color, 10)}, 0 20px 60px -24px ${mix(peak.color, 55)}`,
  }
}

function badgeStyle(peak) {
  return {
    color: peak.softColor,
    background: mix(peak.color, 14),
    borderColor: mix(peak.color, 30),
  }
}
</script>

<style scoped>
.bento {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: minmax(104px, auto);
  grid-auto-flow: row dense;
  gap: 12px;
}

.card {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  cursor: pointer;
  opacity: 0;
  transform: translateY(14px) scale(0.98);
}

.revealed .card {
  opacity: 1;
  transform: none;
  transition: opacity 0.55s ease, transform 0.6s cubic-bezier(0.2, 0.85, 0.25, 1),
    border-color 0.2s ease;
}

.card.small:hover,
.card.small:focus-visible {
  border-color: var(--color-border-strong);
}

/* ── Anchor (peak) cards ── */
.anchor {
  grid-column: span 2;
  padding: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.anchor--primary {
  grid-row: span 2;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.68rem;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid;
}

.anchor-label {
  margin-top: 10px;
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-text);
}

.anchor-tech {
  margin-top: 2px;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.figure-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.figure {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 3.6rem;
  line-height: 0.9;
  font-variant-numeric: tabular-nums;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.figure-unit {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--color-text-muted);
  margin-bottom: 4px;
}

.heatbar {
  margin-top: 12px;
  height: 6px;
  border-radius: 999px;
  background: var(--color-border-strong);
  overflow: hidden;
}

.heatfill {
  display: block;
  height: 100%;
  width: 0;
  border-radius: 999px;
}

.revealed .heatfill {
  width: var(--w);
  transition: width 0.9s cubic-bezier(0.2, 0.85, 0.25, 1) 0.25s;
}

/* Secondary anchor is one row tall: lay it out horizontally. */
.anchor--secondary {
  flex-direction: row;
  align-items: center;
  gap: 16px;
}

.anchor--secondary .anchor-body {
  min-width: 0;
}

.anchor--secondary .anchor-label {
  margin-top: 6px;
  font-size: 1.05rem;
}

.anchor--secondary .anchor-figure {
  flex-shrink: 0;
}

.anchor--secondary .figure {
  font-size: 2.8rem;
}

.anchor--secondary .heatbar {
  margin-top: 8px;
}

/* ── Breadth cards ── */
.small {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.small-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.small-label {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--color-text);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  margin-top: 4px;
  flex-shrink: 0;
  background: var(--color-text-faint);
}

.small-tech {
  font-size: 0.7rem;
  line-height: 1.4;
  color: var(--color-text-faint);
}

/* Sized off the chart panel, not the viewport: the same component sits in a
   half-width hero column on desktop and full width on tablets. */
@container (min-width: 600px) {
  .bento {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .card,
  .revealed .card {
    opacity: 1;
    transform: none;
    transition: border-color 0.2s ease;
  }

  .heatfill,
  .revealed .heatfill {
    width: var(--w);
    transition: none;
  }
}
</style>
