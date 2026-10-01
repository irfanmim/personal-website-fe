<template>
  <div class="bar-chart" :class="{ revealed }" role="group" aria-label="T-shaped skill profile, bar chart">
    <div class="plot">
      <div
        v-for="(item, i) in items"
        :key="item.key"
        class="col"
        tabindex="0"
        :aria-label="describe(item)"
        @mouseenter="emit('show', item, $event)"
        @mousemove="emit('move', $event)"
        @mouseleave="emit('hide')"
        @focus="emit('show', item, $event)"
        @blur="emit('hide')"
      >
        <span
          v-if="item.isPeak"
          class="value"
          :style="{ bottom: `calc(${item.height * 100}% + 8px)`, transitionDelay: `${i * 70 + 250}ms` }"
          aria-hidden="true"
        >{{ item.years }} yrs</span>
        <span class="bar" :class="{ peak: item.isPeak }" :style="barStyle(item, i)" aria-hidden="true" />
      </div>
    </div>

    <div class="labels" aria-hidden="true">
      <span
        v-for="(item, i) in items"
        :key="item.key"
        class="label"
        :class="{ peak: item.isPeak }"
        :style="{ transitionDelay: `${i * 70 + 120}ms` }"
      >{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true },
  revealed: { type: Boolean, default: false },
})

const emit = defineEmits(['show', 'move', 'hide'])

function describe(item) {
  return item.isPeak
    ? `${item.label}: ${item.durationLabel} of ${item.depthLabel}`
    : `${item.label}: ${item.tech.join(', ')}`
}

function barStyle(item, i) {
  const base = { height: `${item.height * 100}%`, transitionDelay: `${i * 70}ms` }
  if (item.isPeak) {
    return {
      ...base,
      background: `linear-gradient(to top, ${item.color}, ${item.softColor})`,
      filter: `drop-shadow(0 0 10px color-mix(in srgb, ${item.color} 45%, transparent))`,
    }
  }
  // Non-peak bars are the quiet crossbar — one neutral fill, so color is left
  // doing exactly one job: marking the two real peaks.
  return {
    ...base,
    background: 'color-mix(in srgb, var(--color-text-faint) 30%, transparent)',
    border: '1px solid color-mix(in srgb, var(--color-text-faint) 60%, transparent)',
  }
}
</script>

<style scoped>
.plot {
  position: relative;
  height: 230px;
  display: flex;
  border-bottom: 1px solid var(--color-border-strong);
}

.col {
  position: relative;
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  cursor: pointer;
  border-radius: 6px;
}

.bar {
  display: block;
  width: min(44px, 56%);
  border-radius: 6px 6px 0 0;
  transform: scaleY(0);
  transform-origin: bottom;
  transition: box-shadow 0.15s ease;
}

.revealed .bar {
  transform: scaleY(1);
  transition: transform 0.85s cubic-bezier(0.2, 0.85, 0.25, 1), box-shadow 0.15s ease;
}

.col:hover .bar:not(.peak),
.col:focus-visible .bar:not(.peak) {
  box-shadow: 0 0 0 1px var(--color-text-faint);
}

.value {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-text);
  white-space: nowrap;
  opacity: 0;
}

.labels {
  display: flex;
  margin-top: 10px;
}

/* Narrow screens: labels run vertically under each bar so long names like
   "Engineering" never break mid-word in ~35px columns. */
.label {
  flex: 1;
  display: flex;
  /* In vertical-rl the main axis is vertical; flex-end + the 180° turn puts
     the end of each label right under its bar. */
  justify-content: flex-end;
  align-items: center;
  font-size: 0.68rem;
  line-height: 1;
  color: var(--color-text-faint);
  opacity: 0;
  white-space: nowrap;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  min-height: 64px;
}

.label.peak {
  color: var(--color-text);
  font-weight: 600;
}

.revealed .value,
.revealed .label {
  opacity: 1;
  transition: opacity 0.5s ease;
}

@media (min-width: 640px) {
  .plot {
    height: 270px;
  }
}

/* Horizontal labels once each column is ~55px+ (panel is the container). */
@container (min-width: 440px) {
  .label {
    font-size: 0.72rem;
    justify-content: center;
    writing-mode: horizontal-tb;
    transform: none;
    min-height: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bar,
  .revealed .bar {
    transform: none;
    transition: none;
  }

  .value,
  .label {
    opacity: 1;
  }
}
</style>
