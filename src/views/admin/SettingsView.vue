<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-brand">
        <span class="brand-dot"></span>
        <span class="brand-label">Admin Panel</span>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/admin" class="sidebar-item sidebar-back">← Dashboard</router-link>
      </nav>

      <div class="sidebar-footer">
        <a href="/" target="_blank" rel="noopener" class="sidebar-link">↗ View Site</a>
        <button class="sidebar-logout" @click="logout">Logout</button>
      </div>
    </aside>

    <!-- Main content area -->
    <main class="admin-main">
      <div class="editor">
        <div class="editor-header">
          <h2 class="editor-title">Account Settings</h2>
        </div>

        <!-- ── Change Username ── -->
        <div class="card">
          <h3 class="settings-section-title">Change Username</h3>

          <div class="field">
            <label class="field-label">New Username</label>
            <input
              v-model="usernameForm.username"
              type="text"
              class="field-input"
              placeholder="Enter new username"
            />
            <span v-if="usernameErrors.username" class="field-error">
              {{ usernameErrors.username[0] }}
            </span>
          </div>

          <div class="settings-actions">
            <button
              class="btn btn-primary"
              :disabled="usernameSaving"
              @click="saveUsername"
            >
              {{ usernameSaving ? 'Saving…' : 'Save Username' }}
            </button>
            <span v-if="usernameSaved" class="settings-success">✓ Username updated</span>
            <span v-if="usernameError" class="settings-error">{{ usernameError }}</span>
          </div>
        </div>

        <!-- ── Change Password ── -->
        <div class="card">
          <h3 class="settings-section-title">Change Password</h3>

          <div class="field">
            <label class="field-label">Current Password</label>
            <input
              v-model="passwordForm.current_password"
              type="password"
              class="field-input"
              placeholder="Enter current password"
              autocomplete="current-password"
            />
            <span v-if="passwordErrors.current_password" class="field-error">
              {{ passwordErrors.current_password[0] }}
            </span>
          </div>

          <div class="field">
            <label class="field-label">New Password</label>
            <input
              v-model="passwordForm.password"
              type="password"
              class="field-input"
              placeholder="Min 8 characters"
              autocomplete="new-password"
            />
            <span v-if="passwordErrors.password" class="field-error">
              {{ passwordErrors.password[0] }}
            </span>
          </div>

          <div class="field">
            <label class="field-label">Confirm New Password</label>
            <input
              v-model="passwordForm.password_confirmation"
              type="password"
              class="field-input"
              placeholder="Repeat new password"
              autocomplete="new-password"
            />
          </div>

          <div class="settings-actions">
            <button
              class="btn btn-primary"
              :disabled="passwordSaving"
              @click="savePassword"
            >
              {{ passwordSaving ? 'Saving…' : 'Change Password' }}
            </button>
            <span v-if="passwordError" class="settings-error">{{ passwordError }}</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { updateUsername, updatePassword } from '../../api/admin.js'
import client from '../../api/client.js'

const router = useRouter()

// ── Username ──────────────────────────────────────────────────────────────────
const usernameForm   = reactive({ username: '' })
const usernameErrors = ref({})
const usernameSaving = ref(false)
const usernameSaved  = ref(false)
const usernameError  = ref('')

async function saveUsername() {
  usernameErrors.value = {}
  usernameError.value  = ''
  usernameSaved.value  = false
  usernameSaving.value = true
  try {
    const data = await updateUsername(usernameForm.username)
    usernameForm.username = data.username
    usernameSaved.value   = true
    setTimeout(() => (usernameSaved.value = false), 2500)
  } catch (err) {
    if (err.response?.status === 422) {
      usernameErrors.value = err.response.data.details ?? {}
    } else {
      usernameError.value = 'Something went wrong. Please try again.'
    }
  } finally {
    usernameSaving.value = false
  }
}

// ── Password ──────────────────────────────────────────────────────────────────
const passwordForm = reactive({
  current_password:      '',
  password:              '',
  password_confirmation: '',
})
const passwordErrors = ref({})
const passwordSaving = ref(false)
const passwordError  = ref('')

async function savePassword() {
  passwordErrors.value = {}
  passwordError.value  = ''
  passwordSaving.value = true
  try {
    await updatePassword(
      passwordForm.current_password,
      passwordForm.password,
      passwordForm.password_confirmation,
    )
    // Backend revokes all tokens — clear local token and redirect to login.
    localStorage.removeItem('admin_jwt')
    router.push('/admin/login')
  } catch (err) {
    if (err.response?.status === 422) {
      passwordErrors.value = err.response.data.details ?? {}
    } else {
      passwordError.value = 'Something went wrong. Please try again.'
    }
  } finally {
    passwordSaving.value = false
  }
}

// ── Logout ────────────────────────────────────────────────────────────────────
async function logout() {
  await client.post('/api/auth/logout').catch(() => {})
  localStorage.removeItem('admin_jwt')
  router.push('/admin/login')
}
</script>

<style>
@import './admin.css';
</style>

<style scoped>
.sidebar-back {
  display: block;
  text-decoration: none;
  color: #888;
  font-size: 0.88rem;
  padding: 10px 20px;
  transition: color 0.15s, background 0.15s;
}

.sidebar-back:hover {
  color: #fff;
  background: #222;
}

.settings-section-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.settings-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 4px;
}

.settings-success {
  font-size: 0.83rem;
  color: #16a34a;
}

.settings-error {
  font-size: 0.83rem;
  color: #dc2626;
}

.field-error {
  font-size: 0.76rem;
  color: #dc2626;
}
</style>
