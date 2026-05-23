<template>
  <div class="editor">
    <div class="editor-header">
      <h2 class="editor-title">About Section</h2>
      <div class="editor-actions">
        <button class="btn btn-ghost" @click="discard">Discard</button>
        <button class="btn btn-primary" @click="save">Save Changes</button>
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

    <Transition name="toast">
      <div v-if="saved" class="toast">✓ Changes saved</div>
    </Transition>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { content, saveContent } from '../../../store/content.js'

const local = reactive(JSON.parse(JSON.stringify(content.about)))
const saved = ref(false)

function save() {
  Object.assign(content.about, local)
  saveContent()
  saved.value = true
  setTimeout(() => (saved.value = false), 2500)
}

function discard() {
  Object.assign(local, JSON.parse(JSON.stringify(content.about)))
}
</script>
