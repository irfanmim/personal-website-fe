<template>
  <div class="editor">
    <div class="editor-header">
      <h2 class="editor-title">Hero Section</h2>
      <div class="editor-actions">
        <button class="btn btn-ghost" @click="discard">Discard</button>
        <button class="btn btn-primary" @click="save">Save Changes</button>
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

    <Transition name="toast">
      <div v-if="saved" class="toast">✓ Changes saved</div>
    </Transition>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { content, saveContent } from '../../../store/content.js'

const local = reactive(JSON.parse(JSON.stringify(content.hero)))
const saved = ref(false)

function save() {
  Object.assign(content.hero, local)
  saveContent()
  saved.value = true
  setTimeout(() => (saved.value = false), 2500)
}

function discard() {
  Object.assign(local, JSON.parse(JSON.stringify(content.hero)))
}
</script>
