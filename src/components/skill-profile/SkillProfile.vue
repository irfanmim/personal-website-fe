<template>
  <div class="profile">
    <div
      id="sp-panel"
      class="panel"
      role="tabpanel"
      :aria-labelledby="`sp-tab-${view}`"
    >
      <div class="tabs" role="tablist" aria-label="Skill profile view" @keydown="onTabKey">
        <button
          v-for="tab in TABS"
          :id="`sp-tab-${tab.id}`"
          :key="tab.id"
          ref="tabRefs"
          type="button"
          role="tab"
          class="tab"
          :aria-selected="view === tab.id ? 'true' : 'false'"
          :aria-label="tab.label"
          :title="tab.label"
          aria-controls="sp-panel"
          :tabindex="view === tab.id ? 0 : -1"
          @click="select(tab.id)"
        >
          <svg
            v-if="tab.id === 'bar'"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ><path d="M5 19V13M12 19V9M19 19V5" /></svg>
          <svg
            v-else-if="tab.id === 'radar'"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ><path d="M12 3l7 4v10l-7 4-7-4V7z" /><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" /></svg>
          <svg
            v-else
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></svg>
        </button>
      </div>

      <div class="chart-slot">
        <component
          :is="VIEWS[view]"
          :items="items"
          :revealed="revealed"
          @show="showTip"
          @move="moveTip"
          @hide="hideTip"
        />
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="tip.item"
        class="sp-tip"
        role="tooltip"
        :style="{ left: tip.x + 'px', top: tip.y + 'px' }"
      >
        <p class="sp-tip-label">{{ tip.item.label }}</p>
        <p class="sp-tip-tech">{{ tip.item.tech.join(', ') }}</p>
        <p
          class="sp-tip-note"
          :style="tip.item.isPeak ? { color: tip.item.softColor } : null"
        >
          {{ tip.item.isPeak ? `${tip.item.durationLabel} of ${tip.item.depthLabel}` : 'Part of my toolkit' }}
        </p>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { skillProfile } from '../../data/skillProfile.js'
import { buildCareerTimeline, formatDuration } from '../../utils/careerTimeline.js'
import SkillProfileBar from './SkillProfileBar.vue'
import SkillProfileRadar from './SkillProfileRadar.vue'
import SkillProfileBento from './SkillProfileBento.vue'

const props = defineProps({
  experiences: {
    type: Array,
    default: () => [],
  },
})

const TABS = [
  { id: 'radar', label: 'Radar' },
  { id: 'bar', label: 'Bar chart' },
  { id: 'bento', label: 'Bento' },
]
const VIEWS = { bar: SkillProfileBar, radar: SkillProfileRadar, bento: SkillProfileBento }

// Breadth sits at one uniform height (the crossbar); peaks rise above it in
// proportion to real tenure, the longer track reaching the top.
const CROSSBAR = 0.36

const ACCENT = {
  engineering: { color: 'var(--chart-engineering)', soft: 'var(--chart-engineering-soft)' },
  product: { color: 'var(--chart-product)', soft: 'var(--chart-product-soft)' },
  tools: { color: 'var(--chart-tools)', soft: 'var(--chart-tools)' },
}

const items = computed(() => {
  const totals = buildCareerTimeline(props.experiences).totalsByTrack
  const peakMonths = skillProfile.filter((s) => s.peakTrack).map((s) => totals[s.peakTrack] || 0)
  const maxMonths = Math.max(...peakMonths, 1)

  return skillProfile.map((s) => {
    const accent = ACCENT[s.accent] || ACCENT.tools
    const months = s.peakTrack ? totals[s.peakTrack] || 0 : 0
    const isPeak = months > 0
    return {
      ...s,
      color: accent.color,
      softColor: accent.soft,
      isPeak,
      months,
      years: Math.round(months / 12),
      durationLabel: formatDuration(months),
      height: isPeak ? CROSSBAR + (1 - CROSSBAR) * (months / maxMonths) : CROSSBAR,
    }
  })
})

const view = ref('radar')
const revealed = ref(false)
const tabRefs = ref([])

function replayReveal() {
  revealed.value = false
  nextTick(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => (revealed.value = true)))
  })
}

function select(id) {
  if (id === view.value) return
  hideTip()
  view.value = id
  replayReveal()
}

function onTabKey(event) {
  const ids = TABS.map((t) => t.id)
  const i = ids.indexOf(view.value)
  let next = null
  if (event.key === 'ArrowRight') next = ids[(i + 1) % ids.length]
  else if (event.key === 'ArrowLeft') next = ids[(i - 1 + ids.length) % ids.length]
  else if (event.key === 'Home') next = ids[0]
  else if (event.key === 'End') next = ids[ids.length - 1]
  if (!next) return
  event.preventDefault()
  select(next)
  nextTick(() => tabRefs.value[ids.indexOf(next)]?.focus())
}

// ── Shared tooltip ──
const tip = reactive({ item: null, x: 0, y: 0 })

function position(event) {
  if (event.type === 'focus' || event.type === 'focusin') {
    const rect = event.currentTarget.getBoundingClientRect()
    tip.x = rect.left + rect.width / 2
    tip.y = rect.top
  } else {
    tip.x = event.clientX
    tip.y = event.clientY
  }
}

function showTip(item, event) {
  tip.item = item
  position(event)
}

function moveTip(event) {
  if (tip.item) position(event)
}

function hideTip() {
  tip.item = null
}

onMounted(() => {
  replayReveal()
  window.addEventListener('scroll', hideTip, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', hideTip)
})
</script>

<style scoped>
.profile {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.tabs {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  border-radius: 10px;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
}

.tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: var(--color-text-faint);
  background: none;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 0;
  cursor: pointer;
  transition: color 0.18s ease, background 0.18s ease, border-color 0.18s ease;
}

.tab:hover {
  color: var(--color-text);
}

.tab[aria-selected='true'] {
  color: var(--color-text);
  background: var(--color-panel-2);
  border-color: var(--color-border-strong);
}

.panel {
  position: relative;
  container-type: inline-size;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  padding: 20px;
}

.chart-slot {
  height: 368px;
  --chart-height: 368px;
  display: grid;
  align-items: center;
}

@media (min-width: 640px) {
  .panel {
    padding: 28px;
  }

  .chart-slot {
    height: 400px;
    --chart-height: 400px;
  }
}
</style>

<style>
/* Teleported to <body>, so unscoped. */
.sp-tip {
  position: fixed;
  z-index: 60;
  pointer-events: none;
  transform: translate(-50%, -118%);
  min-width: 140px;
  max-width: 260px;
  padding: 8px 11px;
  border-radius: 10px;
  background: var(--color-panel-2);
  border: 1px solid var(--color-border-strong);
  box-shadow: 0 12px 30px -12px rgba(0, 0, 0, 0.7);
  font-family: var(--font-body);
  font-size: 0.75rem;
  line-height: 1.45;
}

.sp-tip-label {
  font-weight: 600;
  color: var(--color-text);
}

.sp-tip-tech {
  margin-top: 2px;
  color: var(--color-text-faint);
}

.sp-tip-note {
  margin-top: 6px;
  font-weight: 500;
  color: var(--color-text-faint);
}
</style>
