<template>
  <div class="editor">
    <div class="editor-header">
      <h2 class="editor-title">Projects</h2>
      <div class="editor-actions">
        <button class="btn btn-ghost" @click="discard">Discard</button>
        <button class="btn btn-primary" @click="save">Save Changes</button>
      </div>
    </div>

    <div v-for="(project, index) in local" :key="project._id" class="card">
      <div class="card-header">
        <span class="card-title">{{ project.title || 'Untitled Project' }}</span>
        <div style="display: flex; gap: 8px; flex-shrink: 0">
          <button class="btn btn-sm btn-ghost" @click="toggleEdit(index)">
            {{ editingIndex === index ? 'Collapse' : 'Edit' }}
          </button>
          <button class="btn btn-sm btn-danger" @click="removeProject(index)">Delete</button>
        </div>
      </div>

      <template v-if="editingIndex === index">
        <div class="divider" />
        <div class="field">
          <label class="field-label">Title</label>
          <input v-model="project.title" type="text" class="field-input" placeholder="Project title" />
        </div>
        <div class="field">
          <label class="field-label">Description</label>
          <textarea v-model="project.description" class="field-textarea" rows="3" placeholder="What this project does" />
        </div>
        <div class="field">
          <label class="field-label">Tags</label>
          <input
            :value="project.tags.join(', ')"
            @input="project.tags = $event.target.value.split(',').map(t => t.trim()).filter(Boolean)"
            type="text"
            class="field-input"
            placeholder="React, Vue, Python (comma-separated)"
          />
          <span class="field-hint">Separate each tag with a comma.</span>
        </div>
        <div class="field">
          <label class="field-label">Demo URL</label>
          <input v-model="project.demo" type="url" class="field-input" placeholder="https://..." />
          <span class="field-hint">Leave blank to hide the live demo link.</span>
        </div>
      </template>
    </div>

    <button class="btn btn-ghost btn-full" @click="addProject">+ Add Project</button>

    <Transition name="toast">
      <div v-if="saved" class="toast">✓ Changes saved</div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { content, saveContent } from '../../../store/content.js'

let idCounter = 0

function withIds(projects) {
  return projects.map((p) => ({ ...p, _id: idCounter++ }))
}

const local = ref(withIds(JSON.parse(JSON.stringify(content.projects))))
const editingIndex = ref(null)
const saved = ref(false)

function toggleEdit(index) {
  editingIndex.value = editingIndex.value === index ? null : index
}

function addProject() {
  local.value.push({ _id: idCounter++, title: '', description: '', tags: [], demo: '' })
  editingIndex.value = local.value.length - 1
}

function removeProject(index) {
  local.value.splice(index, 1)
  if (editingIndex.value === index) editingIndex.value = null
  else if (editingIndex.value > index) editingIndex.value--
}

function save() {
  content.projects = local.value.map(({ _id, ...rest }) => rest)
  saveContent()
  saved.value = true
  setTimeout(() => (saved.value = false), 2500)
}

function discard() {
  local.value = withIds(JSON.parse(JSON.stringify(content.projects)))
  editingIndex.value = null
}
</script>
