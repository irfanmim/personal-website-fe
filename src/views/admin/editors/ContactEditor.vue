<template>
  <div class="editor">
    <div class="editor-header">
      <h2 class="editor-title">Contact Section</h2>
      <div class="editor-actions">
        <button class="btn btn-ghost" @click="discard" :disabled="saving">Discard</button>
        <button class="btn btn-primary" @click="save" :disabled="saving">
          {{ saving ? 'Saving…' : 'Save Changes' }}
        </button>
      </div>
    </div>

    <div class="card">
      <div class="field">
        <label class="field-label">LinkedIn URL</label>
        <input
          v-model="local.linkedin"
          type="url"
          class="field-input"
          placeholder="https://linkedin.com/in/yourhandle"
        />
      </div>
      <div class="field">
        <label class="field-label">GitHub URL</label>
        <input
          v-model="local.github"
          type="url"
          class="field-input"
          placeholder="https://github.com/yourhandle"
        />
      </div>
      <div class="field">
        <label class="field-label">Instagram URL</label>
        <input
          v-model="local.instagram"
          type="url"
          class="field-input"
          placeholder="https://instagram.com/yourhandle"
        />
        <span class="field-hint">Leave blank to hide the Instagram link.</span>
      </div>
      <div class="field">
        <label class="field-label">CV / Resume URL</label>
        <input
          v-model="local.cvUrl"
          type="url"
          class="field-input"
          placeholder="https://..."
        />
        <span class="field-hint">Leave blank to hide the download button.</span>
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
import { content, saveContact } from '../../../store/content.js'

const local = reactive(JSON.parse(JSON.stringify(content.contact)))
const saved = ref(false)
const saving = ref(false)
const saveError = ref('')

const stopWatch = watch(
  () => content.contact,
  (fresh) => { Object.assign(local, fresh); stopWatch() },
)

async function save() {
  saving.value = true
  saveError.value = ''
  try {
    Object.assign(content.contact, local)
    await saveContact()
    saved.value = true
    setTimeout(() => (saved.value = false), 2500)
  } catch {
    saveError.value = 'Failed to save. Please try again.'
  } finally {
    saving.value = false
  }
}

function discard() {
  Object.assign(local, JSON.parse(JSON.stringify(content.contact)))
}
</script>
