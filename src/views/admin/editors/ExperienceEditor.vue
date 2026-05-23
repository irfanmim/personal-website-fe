<template>
  <div class="editor">
    <div class="editor-header">
      <h2 class="editor-title">Experience</h2>
      <div class="editor-actions">
        <button class="btn btn-ghost" @click="discard">Discard</button>
        <button class="btn btn-primary" @click="save">Save Changes</button>
      </div>
    </div>

    <div v-for="(roleEntry, ri) in local" :key="roleEntry._id" class="card">
      <!-- Role header -->
      <div class="card-header">
        <div class="field" style="flex: 1">
          <label class="field-label">Role</label>
          <input v-model="roleEntry.role" type="text" class="field-input" placeholder="e.g. Product Manager" />
        </div>
        <button class="btn btn-sm btn-danger" style="align-self: flex-end" @click="removeRole(ri)">
          Delete Role
        </button>
      </div>

      <!-- Companies under this role -->
      <template v-if="roleEntry.companies.length">
        <div class="divider" />
        <div
          v-for="(company, ci) in roleEntry.companies"
          :key="company._id"
          class="company-block"
        >
          <div class="company-block-header">
            <span class="company-block-label">Company {{ ci + 1 }}</span>
            <button class="btn btn-sm btn-danger" @click="removeCompany(ri, ci)">Remove</button>
          </div>
          <div class="field">
            <label class="field-label">Company Name</label>
            <input v-model="company.company" type="text" class="field-input" placeholder="Company name" />
          </div>
          <div class="field">
            <label class="field-label">Period</label>
            <input v-model="company.period" type="text" class="field-input" placeholder="Jan 2024 – Present" />
          </div>
          <div class="field">
            <label class="field-label">Summary</label>
            <textarea v-model="company.summary" class="field-textarea" rows="3" placeholder="What you accomplished here..." />
          </div>
        </div>
      </template>

      <button class="btn btn-ghost btn-sm" @click="addCompany(ri)">+ Add Company</button>
    </div>

    <button class="btn btn-ghost btn-full" @click="addRole">+ Add Role</button>

    <Transition name="toast">
      <div v-if="saved" class="toast">✓ Changes saved</div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { content, saveContent } from '../../../store/content.js'

let idCounter = 0

function withIds(experiences) {
  return experiences.map((role) => ({
    ...role,
    _id: idCounter++,
    companies: role.companies.map((c) => ({ ...c, _id: idCounter++ })),
  }))
}

function stripIds(experiences) {
  return experiences.map(({ _id, companies, ...role }) => ({
    ...role,
    companies: companies.map(({ _id: _cid, ...c }) => c),
  }))
}

const local = ref(withIds(JSON.parse(JSON.stringify(content.experiences))))
const saved = ref(false)

function addRole() {
  local.value.push({ _id: idCounter++, role: '', companies: [] })
}

function removeRole(ri) {
  local.value.splice(ri, 1)
}

function addCompany(ri) {
  local.value[ri].companies.push({ _id: idCounter++, company: '', period: '', summary: '' })
}

function removeCompany(ri, ci) {
  local.value[ri].companies.splice(ci, 1)
}

function save() {
  content.experiences = stripIds(local.value)
  saveContent()
  saved.value = true
  setTimeout(() => (saved.value = false), 2500)
}

function discard() {
  local.value = withIds(JSON.parse(JSON.stringify(content.experiences)))
}
</script>

<style scoped>
.company-block {
  background: #f9f9f9;
  border: 1px solid #efefef;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.company-block-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.company-block-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}
</style>
