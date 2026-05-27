import client from './client.js'

export async function updateUsername(username) {
  const { data } = await client.put('/api/admin/username', { username })
  return data // { username }
}

export async function updatePassword(currentPassword, password, passwordConfirmation) {
  const { data } = await client.put('/api/admin/password', {
    current_password:      currentPassword,
    password,
    password_confirmation: passwordConfirmation,
  })
  return data // { message }
}
