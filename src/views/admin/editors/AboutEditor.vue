<template>
  <div class="editor">
    <div class="editor-header">
      <h2 class="editor-title">About Section</h2>
      <div class="editor-actions">
        <button class="btn btn-ghost" @click="discard" :disabled="saving">Discard</button>
        <button class="btn btn-primary" @click="save" :disabled="saving">
          {{ saving ? 'Saving…' : 'Save Changes' }}
        </button>
      </div>
    </div>

    <div class="card">
      <div class="field">
        <label class="field-label">Bio</label>
        <textarea
          v-model="local.bio"
          class="field-textarea"
          rows="7"
          placeholder="Write a short bio about yourself..."
          style="min-height: 160px"
        />
        <span class="field-hint">Displayed in the About section of your site.</span>
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
import { content, saveAbout } from '../../../store/content.js'

const local = reactive(JSON.parse(JSON.stringify(content.about)))
const saved = ref(false)
const saving = ref(false)
const saveError = ref('')

const stopWatch = watch(
  () => content.about,
  (fresh) => { Object.assign(local, fresh); stopWatch() },
)

async function save() {
  saving.value = true
  saveError.value = ''
  try {
    Object.assign(content.about, local)
    await saveAbout()
    saved.value = true
    setTimeout(() => (saved.value = false), 2500)
  } catch {
    saveError.value = 'Failed to save. Please try again.'
  } finally {
    saving.value = false
  }
}

function discard() {
  Object.assign(local, JSON.parse(JSON.stringify(content.about)))
}
</script>
