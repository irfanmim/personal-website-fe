<template>
  <div class="bento" :class="{ revealed }" role="group" aria-label="T-shaped skill profile, bento grid">
    <div
      v-for="(card, c) in cards"
      :key="card.pillar.key"
      class="card"
      :class="[`card--${card.pillar.key}`, { dim: isDim(card.pillar.key) }]"
      :style="cardStyle(card.pillar, c)"
    >
      <span class="badge" :style="badgeStyle(card.pillar)">{{ card.pillar.badge }}</span>

      <p class="card-label">{{ card.pillar.label }}</p>

      <ul class="areas">
        <li v-for="item in card.items" :key="item.key">
          <button
            type="button"
            class="area"
            :style="areaStyle(card.pillar)"
            :aria-label="`${item.label}, ${item.level} out of 10: ${item.tech.join(', ')}`"
            @mouseenter="emit('show', item, $event)"
            @mousemove="emit('move', $event)"
            @mouseleave="emit('hide')"
            @focus="emit('show', item, $event)"
            @blur="emit('hide')"
          >
            <span class="area-name">{{ item.label }}</span>
            <span class="meter" aria-hidden="true">
              <i
                v-for="n in 10"
                :key="n"
                :class="{ on: n <= item.level }"
                :style="n <= item.level ? { background: card.pillar.color } : null"
              />
            </span>
          </button>
        </li>
      </ul>
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

const cards = computed(() =>
  props.pillars.map((pillar) => ({
    pillar,
    items: props.items.filter((item) => item.pillar === pillar.key),
  }))
)

const isDim = (pillar) => !!props.spotlight && props.spotlight !== pillar

const mix = (color, pct) => `color-mix(in srgb, ${color} ${pct}%, transparent)`

function cardStyle(pillar, c) {
  return {
    transitionDelay: `${c * 60}ms`,
    background: [
      `radial-gradient(120% 120% at 15% 10%, ${mix(pillar.color, 22)}, transparent 55%)`,
      'var(--color-panel-2)',
    ].join(', '),
    borderColor: mix(pillar.color, 38),
    boxShadow: `0 0 0 1px ${mix(pillar.color, 10)}, 0 20px 60px -28px ${mix(pillar.color, 55)}`,
  }
}

function badgeStyle(pillar) {
  return {
    color: pillar.softColor,
    background: mix(pillar.color, 14),
    borderColor: mix(pillar.color, 30),
  }
}

function areaStyle(pillar) {
  return {
    '--area': pillar.color,
    background: mix(pillar.color, 10),
    borderColor: mix(pillar.color, 32),
  }
}
</script>

<style scoped>
.bento {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid var(--color-border);
  opacity: 0;
  transform: translateY(14px) scale(0.98);
}

.revealed .card {
  opacity: 1;
  transform: none;
  transition: opacity 0.55s ease, transform 0.6s cubic-bezier(0.2, 0.85, 0.25, 1);
}

.revealed .card.dim {
  opacity: 0.18;
  transition: opacity 0.15s ease;
}

.badge {
  align-self: flex-start;
  font-size: 0.68rem;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid;
}

.card-label {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.2;
  color: var(--color-text);
}

.areas {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.area {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  font-family: inherit;
  font-size: 0.74rem;
  font-weight: 500;
  color: var(--color-text);
  padding: 5px 10px;
  border-radius: 999px;
  border: 1px solid;
  cursor: pointer;
  transition: border-color 0.15s ease;
}

.area-name {
  line-height: 1.2;
  text-align: left;
}

.meter {
  display: flex;
  gap: 2px;
}

.meter i {
  width: 6px;
  height: 3px;
  border-radius: 2px;
  background: var(--color-border-strong);
}

.area:hover {
  border-color: var(--area) !important;
}

.area:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* Sized off the chart panel, not the viewport: Engineering (five areas) takes the
   tall left column, the other pillars stack beside it. */
@container (min-width: 400px) {
  .bento {
    grid-template-columns: 1.1fr 1fr;
    grid-auto-rows: minmax(0, auto);
  }

  .card--engineering {
    grid-row: span 3;
  }
}

@media (prefers-reduced-motion: reduce) {
  .card,
  .revealed .card {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .card.dim,
  .revealed .card.dim {
    opacity: 0.18;
  }

}
</style>
