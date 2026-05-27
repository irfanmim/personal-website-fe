<template>
  <div class="editor">
    <div class="editor-header">
      <h2 class="editor-title">Hero Section</h2>
      <div class="editor-actions">
        <button class="btn btn-ghost" @click="discard" :disabled="saving">Discard</button>
        <button class="btn btn-primary" @click="save" :disabled="saving">
          {{ saving ? 'Saving…' : 'Save Changes' }}
        </button>
      </div>
    </div>

    <div class="card">
      <div class="field">
        <label class="field-label">Display Name</label>
        <input
          v-model="local.name"
          type="text"
          class="field-input"
          placeholder="Your full name"
        />
        <span class="field-hint">Shown in the navbar and used as the site identity.</span>
      </div>
      <div class="field">
        <label class="field-label">Role / Tagline</label>
        <input
          v-model="local.role"
          type="text"
          class="field-input"
          placeholder="e.g. Software Engineer | Product Manager"
        />
        <span class="field-hint">Shown below the greeting on the homepage.</span>
      </div>
    </div>

    <p v-if="saveError" class="save-error">{{ saveError }}</p>

    <Transition name="toast">
      <div v-if="saved" class="toast">✓ Changes saved</div>
    </Transition>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { content, saveHero } from '../../../store/content.js'

const local = reactive(JSON.parse(JSON.stringify(content.hero)))
const saved = ref(false)
const saving = ref(false)
const saveError = ref('')

// Re-sync local when the store is first populated from the API.
// Stops after one firing so user edits are never overwritten.
const stopWatch = watch(
  () => content.hero,
  (fresh) => { Object.assign(local, fresh); stopWatch() },
)

async function save() {
  saving.value = true
  saveError.value = ''
  try {
    Object.assign(content.hero, local)
    await saveHero()
    saved.value = true
    setTimeout(() => (saved.value = false), 2500)
  } catch {
    saveError.value = 'Failed to save. Please try again.'
  } finally {
    saving.value = false
  }
}

function discard() {
  Object.assign(local, JSON.parse(JSON.stringify(content.hero)))
}
</script>
