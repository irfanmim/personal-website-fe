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
          v-bind="viewProps"
          :revealed="revealed"
          @show="showTip"
          @move="moveTip"
          @hide="hideTip"
        />
      </div>

      <ul class="legend">
        <li v-for="p in radarModel.pillars" :key="p.key">
          <button
            type="button"
            class="chip"
            :class="{ on: pinned === p.key }"
            :style="{ '--c': p.color }"
            :aria-pressed="pinned === p.key ? 'true' : 'false'"
            @mouseenter="hovered = p.key"
            @mouseleave="hovered = null"
            @focus="hovered = p.key"
            @blur="hovered = null"
            @click="pinned = pinned === p.key ? null : p.key"
          >
            <i aria-hidden="true" />
            {{ p.label }}
          </button>
        </li>
      </ul>
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
        <p class="sp-tip-note" :style="{ color: tip.item.softColor }">{{ tip.item.note }}</p>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { content } from '../../store/content.js'
import {
  defaultSkills,
  levelToHeight,
  MIN_VISIBLE_AREAS,
  skillPillars,
  wrapLabel,
} from '../../data/skillProfile.js'
import SkillProfileBar from './SkillProfileBar.vue'
import SkillProfileRadar from './SkillProfileRadar.vue'
import SkillProfileBento from './SkillProfileBento.vue'

const props = defineProps({
  // Skill areas to chart; defaults to the saved ones. The admin editor passes its unsaved draft.
  areas: {
    type: Array,
    default: null,
  },
})

const TABS = [
  { id: 'radar', label: 'Radar' },
  { id: 'bar', label: 'Bar chart' },
  { id: 'bento', label: 'Bento' },
]
const VIEWS = { bar: SkillProfileBar, radar: SkillProfileRadar, bento: SkillProfileBento }

const ACCENT = {
  engineering: { color: 'var(--chart-engineering)', soft: 'var(--chart-engineering-soft)' },
  product: { color: 'var(--chart-product)', soft: 'var(--chart-product-soft)' },
  delivery: { color: 'var(--chart-tools)', soft: 'var(--chart-tools-soft)' },
  leadership: { color: 'var(--chart-lead)', soft: 'var(--chart-lead-soft)' },
}

// Pillars and areas shared by all views. Areas are grouped by pillar (in pillar order) so
// each pillar stays one contiguous run on the radar and bar; pillars with no visible area
// are left out.
const radarModel = computed(() => {
  const source = props.areas ?? content.skills
  let visible = source.filter((a) => a.visible)
  // A radar needs a few axes; an over-hidden list on the public site falls back to the defaults.
  if (!props.areas && visible.length < MIN_VISIBLE_AREAS) visible = defaultSkills.filter((a) => a.visible)

  const allPillars = Object.entries(skillPillars).map(([key, p]) => ({
    key,
    label: p.label,
    color: ACCENT[p.accent].color,
    softColor: ACCENT[p.accent].soft,
    badge: p.badge,
  }))
  const byKey = Object.fromEntries(allPillars.map((p) => [p.key, p]))
  const pillars = allPillars.filter((p) => visible.some((a) => a.pillar === p.key))

  const items = pillars.flatMap((p) =>
    visible
      .filter((a) => a.pillar === p.key)
      .map((a) => ({
        key: a.key,
        pillar: a.pillar,
        label: a.label,
        lines: wrapLabel(a.label),
        short: a.shortLabel || a.label,
        tech: a.tech || [],
        level: a.level,
        color: byKey[a.pillar].color,
        softColor: byKey[a.pillar].softColor,
        height: levelToHeight(a.level),
        note: `${byKey[a.pillar].label} · ${a.level}/10`,
      }))
  )
  return { items, pillars }
})
// Pillar spotlight, shared by all three views: hovering or focusing a legend chip
// previews a pillar, clicking pins it.
const hovered = ref(null)
const pinned = ref(null)
const spotlight = computed(() => hovered.value ?? pinned.value)

const viewProps = computed(() => ({
  items: radarModel.value.items,
  pillars: radarModel.value.pillars,
  spotlight: spotlight.value,
}))

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

.legend {
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px 8px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: inherit;
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-text);
  background: var(--color-panel-2);
  border: 1px solid var(--color-border-strong);
  border-radius: 999px;
  padding: 4px 10px;
  cursor: pointer;
  transition: border-color 0.15s ease;
}

.chip:hover,
.chip.on {
  border-color: var(--c);
}

.chip:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.chip i {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--c);
}

.chip small {
  font-size: 0.7rem;
  color: var(--color-text-faint);
}

.chart-slot {
  min-height: 368px;
  --chart-height: 368px;
  display: grid;
  align-items: center;
}

@media (min-width: 640px) {
  .panel {
    padding: 28px;
  }

  .chart-slot {
    min-height: 400px;
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
