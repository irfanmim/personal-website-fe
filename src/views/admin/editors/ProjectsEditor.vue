<template>
  <div class="editor">
    <div class="editor-header">
      <h2 class="editor-title">Projects</h2>
      <div class="editor-actions">
        <button class="btn btn-ghost" @click="discard" :disabled="saving">Discard</button>
        <button class="btn btn-primary" @click="save" :disabled="saving">
          {{ saving ? 'Saving…' : 'Save Changes' }}
        </button>
      </div>
    </div>

    <draggable
      v-model="local"
      item-key="_id"
      handle=".drag-handle"
      @end="onReorder"
    >
      <template #item="{ element: project }">
        <div class="card">
          <div class="card-header">
            <span class="drag-handle" title="Drag to reorder">⠿</span>
            <span class="card-title">{{ project.title || 'Untitled Project' }}</span>
            <div style="display: flex; gap: 8px; flex-shrink: 0">
              <button class="btn btn-sm btn-ghost" @click="toggleEdit(project._id)">
                {{ editingId === project._id ? 'Collapse' : 'Edit' }}
              </button>
              <button class="btn btn-sm btn-danger" @click="removeProject(project._id)">Delete</button>
            </div>
          </div>

          <template v-if="editingId === project._id">
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
                @blur="project.tags = $event.target.value.split(',').map(t => t.trim()).filter(Boolean)"
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
            <div class="field">
              <label class="field-label">Image</label>
              <img
                v-if="imagePreviewMap[project._id] || project.image"
                :src="imagePreviewMap[project._id] || project.image"
                class="image-preview"
                alt="Project image preview"
              />
              <div v-else class="image-preview image-preview--empty">No image</div>
              <input type="file" accept="image/*" class="field-input" @change="onFileChange($event, project)" />
              <span class="field-hint">Upload a new image. Existing paths are kept if no file is chosen.</span>
            </div>
          </template>
        </div>
      </template>
    </draggable>

    <button class="btn btn-ghost btn-full" @click="addProject">+ Add Project</button>

    <p v-if="reorderError" class="save-error">{{ reorderError }}</p>
    <p v-if="saveError" class="save-error">{{ saveError }}</p>

    <Transition name="toast">
      <div v-if="saved" class="toast">✓ Changes saved</div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import draggable from 'vuedraggable'
import { content } from '../../../store/content.js'
import client from '../../../api/client.js'

let idCounter = 0

function withIds(projects) {
  return projects.map((p) => ({ ...p, _id: idCounter++ }))
}

const local     = ref(withIds(JSON.parse(JSON.stringify(content.projects))))
// Track by _id instead of array index so dragging doesn't shift the open card
const editingId = ref(null)
const saved      = ref(false)
const saving     = ref(false)
const saveError  = ref('')
const reorderError = ref('')

// Track backend IDs of projects deleted in this session
const deletedIds = []

const pendingFiles    = new Map()   // _id -> File (not reactive)
const imagePreviewMap = ref({})     // _id -> object URL string (reactive for template)

function onFileChange(event, project) {
  const file = event.target.files[0]
  if (!file) return
  if (imagePreviewMap.value[project._id]) URL.revokeObjectURL(imagePreviewMap.value[project._id])
  pendingFiles.set(project._id, file)
  imagePreviewMap.value = { ...imagePreviewMap.value, [project._id]: URL.createObjectURL(file) }
}

function clearPendingFile(localId) {
  if (imagePreviewMap.value[localId]) URL.revokeObjectURL(imagePreviewMap.value[localId])
  pendingFiles.delete(localId)
  const { [localId]: _, ...rest } = imagePreviewMap.value
  imagePreviewMap.value = rest
}

onMounted(async () => {
  const { data } = await client.get('/api/projects')
  content.projects = data
  local.value = withIds(JSON.parse(JSON.stringify(data)))
})

function toggleEdit(localId) {
  editingId.value = editingId.value === localId ? null : localId
}

function addProject() {
  const newItem = { _id: idCounter++, title: '', description: '', tags: [], demo: '', image: '' }
  local.value.push(newItem)
  editingId.value = newItem._id
}

function removeProject(localId) {
  const idx = local.value.findIndex(p => p._id === localId)
  if (idx === -1) return
  const project = local.value[idx]
  if (project.id) deletedIds.push(project.id)
  local.value.splice(idx, 1)
  clearPendingFile(localId)
  if (editingId.value === localId) editingId.value = null
}

async function onReorder() {
  // Only send IDs of projects that already exist on the backend
  const existingIds = local.value.filter(p => p.id).map(p => p.id)
  if (existingIds.length === 0) return
  reorderError.value = ''
  try {
    await client.put('/api/projects/reorder', { ids: existingIds })
  } catch {
    reorderError.value = 'Failed to save order. It will reset on next load.'
  }
}

async function save() {
  saving.value = true
  saveError.value = ''
  try {
    // 1. Delete removed projects
    for (const id of deletedIds) {
      await client.delete(`/api/projects/${id}`)
    }

    // 2. Create or update remaining projects
    for (const project of local.value) {
      const { _id, ...payload } = project
      if (payload.id) {
        // Send as POST (backend accepts PUT and POST for /{id}) so FormData with
        // an optional image file works — PHP doesn't parse multipart for PUT.
        const form = new FormData()
        form.append('title', payload.title)
        form.append('description', payload.description)
        payload.tags.forEach(t => form.append('tags[]', t))
        if (payload.demo) form.append('demo', payload.demo)
        if (pendingFiles.has(project._id)) form.append('image', pendingFiles.get(project._id))
        const { data } = await client.post(`/api/projects/${payload.id}`, form)
        project.image = data.image
      } else {
        const file = pendingFiles.get(project._id)
        let data
        if (file) {
          const form = new FormData()
          form.append('title', payload.title)
          form.append('description', payload.description)
          payload.tags.forEach(t => form.append('tags[]', t))
          if (payload.demo) form.append('demo', payload.demo)
          form.append('image', file)
          ;({ data } = await client.post('/api/projects', form))
        } else {
          ;({ data } = await client.post('/api/projects', payload))
        }
        project.id    = data.id
        project.image = data.image
        project.order = data.order
      }
    }
    local.value.forEach(p => clearPendingFile(p._id))

    // 3. Reload all projects (no limit — admin always needs the full list).
    //    loadContent() would only fetch 3 (homepage limit) so we call the
    //    projects endpoint directly and update the store from here.
    const { data: allProjects } = await client.get('/api/projects')
    content.projects = allProjects
    local.value = withIds(JSON.parse(JSON.stringify(allProjects)))
    deletedIds.length = 0
    editingId.value = null

    saved.value = true
    setTimeout(() => (saved.value = false), 2500)
  } catch {
    saveError.value = 'Failed to save. Please try again.'
  } finally {
    saving.value = false
  }
}

function discard() {
  local.value.forEach(p => clearPendingFile(p._id))
  local.value = withIds(JSON.parse(JSON.stringify(content.projects)))
  deletedIds.length = 0
  editingId.value = null
}
</script>

<style scoped>
.drag-handle {
  cursor: grab;
  color: #ccc;
  font-size: 1.1rem;
  padding: 0 4px;
  flex-shrink: 0;
  user-select: none;
  transition: color 0.15s;
}

.drag-handle:hover {
  color: #888;
}

.drag-handle:active {
  cursor: grabbing;
}

.image-preview {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  background: #f5f5f5;
  display: block;
  margin-bottom: 8px;
}

.image-preview--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  color: #bbb;
}
</style>
