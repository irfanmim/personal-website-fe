<template>
  <div class="editor">
    <div class="editor-header">
      <h2 class="editor-title">Contact Section</h2>
      <div class="editor-actions">
        <button class="btn btn-ghost" @click="discard">Discard</button>
        <button class="btn btn-primary" @click="save">Save Changes</button>
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

    <Transition name="toast">
      <div v-if="saved" class="toast">✓ Changes saved</div>
    </Transition>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { content, saveContent } from '../../../store/content.js'

const local = reactive(JSON.parse(JSON.stringify(content.contact)))
const saved = ref(false)

function save() {
  Object.assign(content.contact, local)
  saveContent()
  saved.value = true
  setTimeout(() => (saved.value = false), 2500)
}

function discard() {
  Object.assign(local, JSON.parse(JSON.stringify(content.contact)))
}
</script>
