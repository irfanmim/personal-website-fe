<template>
  <div class="bar-chart" :class="{ revealed }" role="group" aria-label="T-shaped skill profile, bar chart">
    <div class="plot">
      <div
        v-for="group in groups"
        :key="group.pillar.key"
        class="group"
        :class="{ dim: isDim(group.pillar.key) }"
        :style="{
          flex: group.items.length,
          '--c': group.pillar.color,
          '--cs': group.pillar.softColor,
        }"
      >
        <div
          v-for="(item, i) in group.items"
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
            class="bar"
            :style="{ height: `${barHeight(item)}%`, transitionDelay: `${(group.start + i) * 70}ms` }"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>

    <div class="labels" aria-hidden="true">
      <div
        v-for="group in groups"
        :key="group.pillar.key"
        class="label-group"
        :class="{ dim: isDim(group.pillar.key) }"
        :style="{ flex: group.items.length, '--cs': group.pillar.softColor }"
      >
        <span
          v-for="(item, i) in group.items"
          :key="item.key"
          class="label"
          :style="{ transitionDelay: `${(group.start + i) * 70 + 120}ms` }"
        >{{ item.short }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  pillars: { type: Array, required: true },
  spotlight: { type: String, default: null },
  revealed: { type: Boolean, default: false },
})

const emit = defineEmits(['show', 'move', 'hide'])

const barHeight = (item) => item.height * 100
const isDim = (pillar) => !!props.spotlight && props.spotlight !== pillar

// Items arrive ordered by pillar; each contiguous run becomes one band.
const groups = computed(() => {
  const runs = []
  props.items.forEach((item, index) => {
    const last = runs[runs.length - 1]
    if (last && last.pillar.key === item.pillar) {
      last.items.push(item)
    } else {
      runs.push({ pillar: props.pillars.find((p) => p.key === item.pillar), items: [item], start: index })
    }
  })
  return runs
})

function describe(item) {
  return `${item.label}: ${item.tech.join(', ')}. ${item.note}`
}
</script>

<style scoped>
.plot {
  position: relative;
  height: 230px;
  display: flex;
  border-bottom: 1px solid var(--color-border-strong);
}

.group {
  position: relative;
  display: flex;
  align-items: flex-end;
  margin: 0 1px;
  border-radius: 10px 10px 0 0;
  border: 1px solid color-mix(in srgb, var(--c) 30%, transparent);
  border-bottom: 0;
  background: color-mix(in srgb, var(--c) 9%, transparent);
  transition: opacity 0.15s ease;
}

.col {
  position: relative;
  flex: 1;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  cursor: pointer;
  border-radius: 6px;
  outline: none;
}

.bar {
  display: block;
  width: min(30px, 60%);
  border-radius: 6px 6px 0 0;
  background: linear-gradient(to top, var(--c), var(--cs));
  filter: drop-shadow(0 0 8px color-mix(in srgb, var(--c) 40%, transparent));
  transform: scaleY(0);
  transform-origin: bottom;
}

.revealed .bar {
  transform: scaleY(1);
  transition: transform 0.85s cubic-bezier(0.2, 0.85, 0.25, 1);
}

.col:hover .bar,
.col:focus-visible .bar {
  filter: drop-shadow(0 0 12px var(--c));
}

.col:focus-visible {
  box-shadow: 0 0 0 2px var(--color-accent);
}

.labels {
  display: flex;
  margin-top: 10px;
}

.label-group {
  display: flex;
  margin: 0 1px;
  transition: opacity 0.15s ease;
}

.dim {
  opacity: 0.18;
}

/* Ten columns are too narrow for horizontal names at any width, so labels run
   vertically under each bar. */
.label {
  flex: 1;
  display: flex;
  /* In vertical-rl the main axis is vertical; flex-end + the 180° turn puts
     the end of each label right under its bar. */
  justify-content: flex-end;
  align-items: center;
  font-size: 0.72rem;
  font-weight: 500;
  line-height: 1;
  color: var(--cs);
  opacity: 0;
  white-space: nowrap;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  min-height: 78px;
}

.revealed .label {
  opacity: 1;
  transition: opacity 0.5s ease;
}

@media (min-width: 640px) {
  .plot {
    height: 250px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bar,
  .revealed .bar {
    transform: none;
    transition: none;
  }

  .label {
    opacity: 1;
  }
}
</style>
