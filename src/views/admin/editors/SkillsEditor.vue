<template>
  <div class="editor editor--wide">
    <div class="editor-header">
      <h2 class="editor-title">Skills</h2>
      <div class="editor-actions">
        <button class="btn btn-ghost" @click="discard" :disabled="saving">Discard</button>
        <button class="btn btn-primary" @click="save" :disabled="saving">
          {{ saving ? 'Saving…' : 'Save Changes' }}
        </button>
      </div>
    </div>

    <div class="split">
      <div class="card">
        <div class="tabs" role="tablist">
          <button
            v-for="t in TABS"
            :key="t.id"
            type="button"
            role="tab"
            class="tab"
            :class="{ 'tab--on': board === t.id }"
            :aria-selected="board === t.id ? 'true' : 'false'"
            @click="board = t.id"
          >{{ t.label }}</button>
        </div>

        <p class="hint">{{ board === 'levels' ? LEVEL_HINT : PILLAR_HINT }}</p>

        <!-- Ladder: drag a chip onto a score 10 → 1, or into Hidden -->
        <div v-if="board === 'levels'" class="ladder">
          <div
            v-for="row in rows"
            :key="row.id"
            class="lane"
            :class="{ 'lane--hidden': row.hidden, 'lane--band': row.band }"
          >
            <div class="lane-head">
              <span class="lane-num">{{ row.label }}</span>
              <small>{{ row.band || row.hint }}</small>
            </div>
            <draggable
              :model-value="rowItems(row)"
              item-key="key"
              group="skills"
              :animation="150"
              ghost-class="chip-ghost"
              class="drop"
              @change="(e) => onRowChange(row, e)"
            >
              <template #item="{ element }">
                <button
                  type="button"
                  class="chip"
                  :class="{ 'chip--sel': selectedKey === element.key }"
                  :style="{ '--c': PILLAR_COLOR[element.pillar] }"
                  @click="toggleSelect(element.key)"
                >
                  <i /> {{ element.label || 'Untitled' }}
                </button>
              </template>
            </draggable>
          </div>
        </div>

        <!-- Pillars: drag between and within pillars -->
        <div v-else class="pgrid">
          <div v-for="p in pillarList" :key="p.key" class="pcol" :style="{ '--c': PILLAR_COLOR[p.key] }">
            <h4><i /> {{ p.label }}</h4>
            <draggable
              :model-value="pillarItems(p.key)"
              item-key="key"
              group="skills-pillars"
              :animation="150"
              ghost-class="chip-ghost"
              class="drop"
              @change="(e) => onPillarChange(p.key, e)"
            >
              <template #item="{ element }">
                <button
                  type="button"
                  class="chip"
                  :class="{ 'chip--sel': selectedKey === element.key, 'chip--off': !element.visible }"
                  :style="{ '--c': PILLAR_COLOR[element.pillar] }"
                  @click="toggleSelect(element.key)"
                >
                  <i /> {{ element.label || 'Untitled' }}
                </button>
              </template>
            </draggable>
          </div>
        </div>

        <p v-if="visibleCount < MIN_VISIBLE_AREAS" class="warn">
          The radar needs at least {{ MIN_VISIBLE_AREAS }} visible areas. Until then the public site shows the default areas.
        </p>

        <!-- Edit panel -->
        <div v-if="selected" class="edit">
          <div class="row">
            <label class="field">
              <span class="field-label">Name</span>
              <input v-model="selected.label" class="field-input" type="text" maxlength="80" />
            </label>
            <label class="field">
              <span class="field-label">Short label (phone, bar chart)</span>
              <input v-model="selected.shortLabel" class="field-input" type="text" maxlength="30" />
            </label>
          </div>
          <div class="row">
            <label class="field">
              <span class="field-label">Pillar</span>
              <select v-model="selected.pillar" class="field-input" @change="onPillarSelect">
                <option v-for="p in pillarList" :key="p.key" :value="p.key">{{ p.label }}</option>
              </select>
            </label>
            <label class="field">
              <span class="field-label">
                Level
                <b class="level-val">{{ selected.level }}/10 · {{ levelBand(selected.level) }}</b>
              </span>
              <input
                v-model.number="selected.level"
                class="slider"
                type="range"
                :min="LEVEL_MIN"
                :max="LEVEL_MAX"
                step="1"
              />
            </label>
          </div>
          <label class="field">
            <span class="field-label">Tech (shown in the tooltip)</span>
            <div class="tags">
              <span v-for="(t, i) in selected.tech" :key="t + i" class="tag">
                {{ t }}
                <button type="button" class="tag-x" :aria-label="`Remove ${t}`" @click="selected.tech.splice(i, 1)">×</button>
              </span>
              <input
                v-model="techInput"
                class="tag-input"
                type="text"
                placeholder="Add, press Enter"
                @keydown.enter.prevent="addTech"
              />
            </div>
          </label>
          <label class="check">
            <input v-model="selected.visible" type="checkbox" />
            Show on the site
          </label>
          <div>
            <button type="button" class="btn btn-danger btn-sm" @click="removeSelected">Delete area</button>
          </div>
        </div>
        <p v-else class="hint hint--pad">Click an area to edit its name, tech list, pillar or level.</p>

        <div>
          <button type="button" class="btn btn-ghost btn-sm" @click="addArea">+ Add area</button>
        </div>
      </div>

      <div class="preview">
        <SkillProfile v-if="visibleCount >= MIN_VISIBLE_AREAS" :areas="draft" />
        <p v-else class="hint hint--pad">Show at least {{ MIN_VISIBLE_AREAS }} areas to see the preview.</p>
        <p class="preview-cap">Live preview of the unsaved draft, as visitors will see it.</p>
      </div>
    </div>

    <p v-if="saveError" class="save-error">{{ saveError }}</p>

    <Transition name="toast">
      <div v-if="saved" class="toast">✓ Changes saved</div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import draggable from 'vuedraggable'
import SkillProfile from '../../../components/skill-profile/SkillProfile.vue'
import { content, saveSkills } from '../../../store/content.js'
import {
  levelBand,
  LEVEL_MAX,
  LEVEL_MIN,
  MIN_VISIBLE_AREAS,
  skillPillars,
} from '../../../data/skillProfile.js'

const TABS = [
  { id: 'levels', label: 'By level' },
  { id: 'pillars', label: 'By pillar' },
]
const LEVEL_HINT = 'Drag a skill area onto a score from 1 to 10 (10 = strongest). Hidden areas are kept but not shown on the site.'
const PILLAR_HINT = 'Drag an area into another pillar. The order inside a pillar sets the axis order on the charts.'

const PILLAR_COLOR = {
  engineering: 'var(--chart-engineering)',
  product: 'var(--chart-product)',
  delivery: 'var(--chart-tools)',
  leadership: 'var(--chart-lead)',
}
const pillarList = Object.entries(skillPillars).map(([key, p]) => ({ key, label: p.label }))
const PILLAR_KEYS = pillarList.map((p) => p.key)

// Ladder rows 10 → 1, with the named band labelled on its top row, then Hidden.
const BAND_TOP = { 10: 'Expert', 8: 'Strong', 6: 'Working', 3: 'Familiar' }
const rows = [
  ...[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((n) => ({ id: `l${n}`, level: n, label: n, band: BAND_TOP[n] || '' })),
  { id: 'hidden', hidden: true, label: 'Hidden', hint: 'Not shown on site' },
]

const clone = (list) => JSON.parse(JSON.stringify(list))
const draft = ref(clone(content.skills))
const board = ref('levels')
const selectedKey = ref(null)
const techInput = ref('')
const saving = ref(false)
const saved = ref(false)
const saveError = ref('')

const selected = computed(() => draft.value.find((a) => a.key === selectedKey.value) || null)
const visibleCount = computed(() => draft.value.filter((a) => a.visible).length)

const rowItems = (row) =>
  draft.value.filter((a) => (row.hidden ? !a.visible : a.visible && a.level === row.level))
const pillarItems = (key) => draft.value.filter((a) => a.pillar === key)

function toggleSelect(key) {
  selectedKey.value = selectedKey.value === key ? null : key
  techInput.value = ''
}

function onRowChange(row, event) {
  if (!event.added) return
  const area = event.added.element
  if (row.hidden) {
    area.visible = false
  } else {
    area.visible = true
    area.level = row.level
  }
}

// Move (or reorder) an area within the draft, keeping the draft grouped by pillar so array
// order is the display order the API stores.
function placeInPillar(area, pillar, index) {
  const rest = draft.value.filter((a) => a !== area)
  area.pillar = pillar
  const groups = PILLAR_KEYS.map((k) => rest.filter((a) => a.pillar === k))
  groups[PILLAR_KEYS.indexOf(pillar)].splice(index, 0, area)
  draft.value = groups.flat()
}

function onPillarChange(pillar, event) {
  const hit = event.added || event.moved
  if (hit) placeInPillar(hit.element, pillar, hit.newIndex)
}

// Pillar changed from the dropdown: append to that pillar.
function onPillarSelect() {
  const area = selected.value
  if (area) placeInPillar(area, area.pillar, pillarItems(area.pillar).filter((a) => a !== area).length)
}

function addTech() {
  const area = selected.value
  const value = techInput.value.trim().replace(/,$/, '')
  if (area && value && !area.tech.includes(value)) area.tech.push(value)
  techInput.value = ''
}

function addArea() {
  const area = {
    key: `area-${Date.now().toString(36)}`,
    label: 'New area',
    shortLabel: 'New',
    pillar: 'engineering',
    level: 5,
    visible: true,
    tech: [],
  }
  placeInPillar(area, 'engineering', pillarItems('engineering').length)
  selectedKey.value = area.key
}

function removeSelected() {
  draft.value = draft.value.filter((a) => a.key !== selectedKey.value)
  selectedKey.value = null
}

function discard() {
  draft.value = clone(content.skills)
  selectedKey.value = null
  saveError.value = ''
}

async function save() {
  const blank = draft.value.find((a) => !a.label.trim())
  if (blank) {
    saveError.value = 'Every area needs a name.'
    selectedKey.value = blank.key
    return
  }
  saving.value = true
  saveError.value = ''
  try {
    await saveSkills(
      draft.value.map((a) => ({
        key: a.key,
        label: a.label.trim(),
        shortLabel: a.shortLabel.trim() || a.label.trim(),
        pillar: a.pillar,
        level: a.level,
        tech: a.tech,
        visible: a.visible,
      }))
    )
    draft.value = clone(content.skills)
    saved.value = true
    setTimeout(() => (saved.value = false), 2500)
  } catch (err) {
    saveError.value = err?.response?.data?.message || 'Failed to save. Please try again.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.editor--wide {
  max-width: 1180px;
}

.split {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(300px, 1fr);
  gap: 20px;
  align-items: start;
}

@media (max-width: 1100px) {
  .split {
    grid-template-columns: 1fr;
  }
}

.tabs {
  display: inline-flex;
  align-self: flex-start;
  gap: 2px;
  padding: 3px;
  border-radius: 8px;
  background: #ebecef;
}

.tab {
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  background: none;
  font: inherit;
  font-size: 0.82rem;
  color: #555;
  cursor: pointer;
}

.tab--on {
  background: #fff;
  color: #111;
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.hint {
  font-size: 0.78rem;
  color: #888;
  margin: 0;
}

.hint--pad {
  padding: 4px 0;
}

.warn {
  font-size: 0.78rem;
  color: #b45309;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 8px 10px;
  margin: 0;
}

/* ── Ladder ── */
.ladder {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lane {
  display: grid;
  grid-template-columns: 112px 1fr;
  gap: 8px;
  align-items: stretch;
}

.lane--band {
  margin-top: 8px;
}

.lane--band:first-child {
  margin-top: 0;
}

.lane-head {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  font-weight: 700;
}

.lane-num {
  min-width: 26px;
  text-align: right;
  font-size: 0.95rem;
  font-variant-numeric: tabular-nums;
  color: #444;
}

.lane-head small {
  font-weight: 600;
  color: #999;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.drop {
  min-height: 40px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 6px;
  padding: 7px;
  border: 1.5px dashed #dcdde1;
  border-radius: 9px;
  background: #fafafb;
}

.lane--hidden .drop {
  background: repeating-linear-gradient(45deg, #fafafb, #fafafb 8px, #f3f3f5 8px, #f3f3f5 16px);
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 11px 6px 9px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--c) 40%, #fff);
  background: color-mix(in srgb, var(--c) 10%, #fff);
  font: inherit;
  font-size: 0.8rem;
  font-weight: 500;
  color: #1a1a1a;
  cursor: grab;
  user-select: none;
}

.chip:active {
  cursor: grabbing;
}

.chip i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--c);
}

.chip--sel {
  box-shadow: 0 0 0 2px var(--c);
}

.chip--off {
  opacity: 0.55;
}

.chip-ghost {
  opacity: 0.35;
}

/* ── Pillars ── */
.pgrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.pcol h4 {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0 0 6px;
  font-size: 0.8rem;
}

.pcol h4 i {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--c);
}

.pcol .drop {
  min-height: 90px;
}

/* ── Edit panel ── */
.edit {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid #eee;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.level-val {
  margin-left: 6px;
  color: #111;
  text-transform: none;
  letter-spacing: 0;
}

.slider {
  width: 100%;
  margin-top: 8px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 5px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px;
  border-radius: 6px;
  background: #f0f1f4;
  font-size: 0.75rem;
}

.tag-x {
  border: none;
  background: none;
  padding: 0;
  color: #999;
  cursor: pointer;
  font-size: 0.9rem;
  line-height: 1;
}

.tag-input {
  width: 150px;
  padding: 4px 8px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font: inherit;
  font-size: 0.8rem;
}

.check {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
}

/* ── Preview ── */
.preview {
  position: sticky;
  top: 16px;
}

.preview-cap {
  margin: 8px 0 0;
  text-align: center;
  font-size: 0.72rem;
  color: #999;
}
</style>
