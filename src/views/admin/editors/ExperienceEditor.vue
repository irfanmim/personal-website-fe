<template>
  <div class="editor">
    <div class="editor-header">
      <h2 class="editor-title">Experience</h2>
      <div class="editor-actions">
        <button class="btn btn-ghost" @click="discard" :disabled="saving">Discard</button>
        <button class="btn btn-primary" @click="save" :disabled="saving">
          {{ saving ? 'Saving…' : 'Save Changes' }}
        </button>
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
            <label class="field-label">Position / Title</label>
            <input v-model="company.summary" type="text" class="field-input" placeholder="e.g. Product Manager" />
          </div>
          <div class="field">
            <label class="field-label">Company Name</label>
            <input v-model="company.company" type="text" class="field-input" placeholder="Company name" />
          </div>
          <div class="field">
            <label class="field-label">Period</label>
            <input v-model="company.period" type="text" class="field-input" placeholder="Jan 2024 – Present" />
          </div>
        </div>
      </template>

      <button class="btn btn-ghost btn-sm" @click="addCompany(ri)">+ Add Company</button>
    </div>

    <button class="btn btn-ghost btn-full" @click="addRole">+ Add Role</button>

    <p v-if="saveError" class="save-error">{{ saveError }}</p>

    <Transition name="toast">
      <div v-if="saved" class="toast">✓ Changes saved</div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { content, loadContent } from '../../../store/content.js'
import client from '../../../api/client.js'

let idCounter = 0

function withIds(experiences) {
  return experiences.map((role) => ({
    ...role,
    _id: idCounter++,
    companies: role.companies.map((c) => ({ ...c, _id: idCounter++ })),
  }))
}

const local = ref(withIds(JSON.parse(JSON.stringify(content.experiences))))
const saved = ref(false)
const saving = ref(false)
const saveError = ref('')

const stopWatch = watch(
  () => content.experiences,
  (fresh) => {
    local.value = withIds(JSON.parse(JSON.stringify(fresh)))
    stopWatch()
  },
)

// Track deletions so we can issue the right DELETE calls on save.
// Using plain arrays (not reactive) — we only read them inside save().
const deletedRoleIds = []
const deletedCompanyKeys = [] // { roleId, companyId }

function addRole() {
  local.value.push({ _id: idCounter++, role: '', companies: [] })
}

function removeRole(ri) {
  const role = local.value[ri]
  if (role.id) deletedRoleIds.push(role.id)
  local.value.splice(ri, 1)
}

function addCompany(ri) {
  local.value[ri].companies.push({ _id: idCounter++, summary: '', company: '', period: '' })
}

function removeCompany(ri, ci) {
  const role = local.value[ri]
  const company = role.companies[ci]
  // Only track if both role and company already exist on the backend
  if (role.id && company.id) {
    deletedCompanyKeys.push({ roleId: role.id, companyId: company.id })
  }
  role.companies.splice(ci, 1)
}

async function save() {
  saving.value = true
  saveError.value = ''
  try {
    // 1. Delete removed roles (companies cascade)
    const deletedRoleIdSet = new Set(deletedRoleIds)
    for (const id of deletedRoleIds) {
      await client.delete(`/api/experiences/${id}`)
    }

    // 2. Delete removed companies from roles that still exist
    for (const { roleId, companyId } of deletedCompanyKeys) {
      if (!deletedRoleIdSet.has(roleId)) {
        await client.delete(`/api/experiences/${roleId}/companies/${companyId}`)
      }
    }

    // 3. Upsert roles and their companies in order
    for (const role of local.value) {
      let roleId = role.id
      if (!roleId) {
        const { data } = await client.post('/api/experiences', { role: role.role })
        roleId = data.id
        role.id = roleId
      } else {
        await client.put(`/api/experiences/${roleId}`, { role: role.role })
      }

      for (const company of role.companies) {
        if (!company.id) {
          const { data } = await client.post(`/api/experiences/${roleId}/companies`, {
            summary: company.summary,
            company: company.company,
            period:  company.period,
          })
          company.id = data.id
        } else {
          await client.put(`/api/experiences/${roleId}/companies/${company.id}`, {
            summary: company.summary,
            company: company.company,
            period:  company.period,
          })
        }
      }
    }

    // 4. Reload store and re-sync local so IDs are fully settled
    await loadContent()
    local.value = withIds(JSON.parse(JSON.stringify(content.experiences)))
    deletedRoleIds.length = 0
    deletedCompanyKeys.length = 0

    saved.value = true
    setTimeout(() => (saved.value = false), 2500)
  } catch {
    saveError.value = 'Failed to save. Please try again.'
  } finally {
    saving.value = false
  }
}

function discard() {
  local.value = withIds(JSON.parse(JSON.stringify(content.experiences)))
  deletedRoleIds.length = 0
  deletedCompanyKeys.length = 0
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
