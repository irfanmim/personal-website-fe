<template>
  <div v-if="entry" class="detail" aria-live="polite">
    <div class="top">
      <span class="period">{{ entry.period }} · {{ duration }}</span>
      <div class="chips">
        <span v-for="layer in layers" :key="layer.key" class="chip" :class="`chip--${layer.key}`">{{ layer.label }}</span>
      </div>
    </div>
    <h3 class="title">{{ entry.summary }}</h3>
    <p class="company">{{ entry.company }}</p>

    <div v-if="achievements.owned.length" class="split">
      <div class="box box--built">
        <h4 class="box-title">Built (hands-on)</h4>
        <ul class="achievements">
          <li v-for="(item, i) in achievements.built" :key="i">{{ item }}</li>
        </ul>
      </div>
      <div class="box box--owned">
        <h4 class="box-title">Owned (product)</h4>
        <ul class="achievements">
          <li v-for="(item, i) in achievements.owned" :key="i">{{ item }}</li>
        </ul>
      </div>
    </div>
    <ul v-else-if="achievements.built.length" class="achievements achievements--single">
      <li v-for="(item, i) in achievements.built" :key="i">{{ item }}</li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDuration, splitAchievements } from '../../utils/careerTimeline.js'

const props = defineProps({
  entry: { type: Object, default: null },
})

const duration = computed(() => formatDuration(props.entry?.duration || 0))
const achievements = computed(() => splitAchievements(props.entry?.achievements))

// Every role is hands-on engineering; leadership and product are layered on top.
const layers = computed(() => {
  const out = [{ key: 'engineering', label: 'Engineering' }]
  if (props.entry?.isLeadership) out.push({ key: 'leadership', label: 'Leadership' })
  if (props.entry?.isProduct) out.push({ key: 'product', label: 'Product' })
  return out
})
</script>

<style scoped>
.detail {
  border: 1px solid var(--color-border);
  border-radius: 16px;
  background: var(--color-bg-elevated);
  padding: 20px 22px 22px;
}

.top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 14px;
}

.period {
  font-size: var(--text-sm);
  color: var(--color-text-faint);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  --chip-color: var(--chart-engineering);
  font-size: var(--text-xs);
  font-weight: 600;
  padding: 2px 9px;
  border-radius: 999px;
  color: var(--chip-color);
  background: color-mix(in srgb, var(--chip-color) 13%, transparent);
  border: 1px solid color-mix(in srgb, var(--chip-color) 32%, transparent);
}

.chip--leadership {
  --chip-color: var(--chart-tools);
}

.chip--product {
  --chip-color: var(--chart-product);
}

.title {
  margin-top: 10px;
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 600;
  color: var(--color-text);
}

.company {
  margin-top: 2px;
  font-size: var(--text-body);
  color: var(--color-text-muted);
}

.achievements {
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.achievements li {
  font-size: var(--text-body);
  line-height: 1.6;
  color: var(--color-text-muted);
}

.achievements--single {
  margin-top: 14px;
}

.split {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  margin-top: 16px;
}

.box {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 12px 14px;
}

.box--built {
  border-top: 3px solid var(--chart-engineering);
}

.box--owned {
  border-top: 3px solid var(--chart-product);
}

.box-title {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
}

@media (min-width: 680px) {
  .split {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
