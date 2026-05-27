<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="login-title">Admin Login</h1>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="field">
          <label class="field-label" for="username">Username</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            class="field-input"
            autocomplete="username"
            placeholder="Username"
            required
          />
        </div>
        <div class="field">
          <label class="field-label" for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="field-input"
            autocomplete="current-password"
            placeholder="Password"
            required
          />
        </div>
        <p v-if="error" class="error-msg">{{ error }}</p>
        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? 'Logging in…' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import client from '../../api/client.js'

const router = useRouter()
const form = reactive({ username: '', password: '' })
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    const { data } = await client.post('/api/auth/login', {
      username: form.username,
      password: form.password,
    })
    localStorage.setItem('admin_jwt', data.token)
    router.push('/admin')
  } catch {
    error.value = 'Invalid username or password.'
    form.password = ''
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #f5f6f8;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  font-family: system-ui, Arial, sans-serif;
}

.login-card {
  background: #fff;
  border-radius: 14px;
  padding: 44px 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 2px 24px rgba(0, 0, 0, 0.07);
}

.login-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 32px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.field-input {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.92rem;
  color: #1a1a1a;
  outline: none;
  font-family: system-ui, Arial, sans-serif;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.field-input:focus {
  border-color: #1a1a1a;
  box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.06);
}

.error-msg {
  font-size: 0.83rem;
  color: #dc2626;
  background: #fff5f5;
  border: 1px solid #fecaca;
  border-radius: 6px;
  padding: 8px 12px;
}

.login-btn {
  background: #1a1a1a;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 0.92rem;
  font-weight: 500;
  cursor: pointer;
  font-family: system-ui, Arial, sans-serif;
  transition: opacity 0.15s;
  margin-top: 4px;
}

.login-btn:hover {
  opacity: 0.82;
}
</style>
