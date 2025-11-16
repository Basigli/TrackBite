<template>
  <div class="user-settings p-4 max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-4">User Settings</h1>

    <form @submit.prevent="updateProfile" class="flex flex-col gap-3 border p-4 rounded bg-gray-50">
      <h2 class="font-semibold mb-2">Profile Info</h2>
      <input
        v-model="name"
        type="text"
        placeholder="Name"
        class="border px-2 py-1 rounded"
        required
      />
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="border px-2 py-1 rounded"
        required
      />
      <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">Save Profile</button>
    </form>

    <form
      @submit.prevent="updatePassword"
      class="flex flex-col gap-3 border p-4 rounded bg-gray-50 mt-4"
    >
      <h2 class="font-semibold mb-2">Change Password</h2>
      <input
        v-model="currentPassword"
        type="password"
        placeholder="Current Password"
        class="border px-2 py-1 rounded"
        required
      />
      <input
        v-model="newPassword"
        type="password"
        placeholder="New Password"
        class="border px-2 py-1 rounded"
        required
      />
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
        Change Password
      </button>
    </form>

    <div class="preferences border p-4 rounded bg-gray-50 mt-4">
      <h2 class="font-semibold mb-2">Preferences</h2>
      <label class="flex items-center gap-2">
        <input type="checkbox" v-model="preferences.darkMode" />
        Dark Mode
      </label>
      <label class="flex items-center gap-2 mt-2">
        <input type="checkbox" v-model="preferences.notifications" />
        Enable Notifications
      </label>
      <button @click="savePreferences" class="mt-3 bg-purple-500 text-white px-4 py-2 rounded">
        Save Preferences
      </button>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, watch } from 'vue'
import { useUserStore } from '../store/userStore'

export default {
  name: 'UserSettings',
  setup() {
    const store = useUserStore()
    const userId = 1 // replace with logged-in user

    const name = ref('')
    const email = ref('')
    const currentPassword = ref('')
    const newPassword = ref('')
    const preferences = reactive({ darkMode: false, notifications: true })

    onMounted(async () => {
      await store.fetchUser(userId)
      name.value = store.user.name
      email.value = store.user.email
      Object.assign(preferences, store.user.preferences || {})
    })

    watch(
      () => store.user.preferences,
      (newPrefs) => {
        Object.assign(preferences, newPrefs || {})
      },
    )

    const updateProfile = async () => {
      const success = await store.updateUser({ name: name.value, email: email.value })
      if (success) alert('Profile updated!')
    }

    const updatePassword = async () => {
      const success = await store.changePassword(currentPassword.value, newPassword.value)
      if (success) {
        alert('Password changed!')
        currentPassword.value = ''
        newPassword.value = ''
      } else {
        alert('Failed to change password')
      }
    }

    const savePreferences = async () => {
      const success = await store.updateUser({ preferences })
      if (success) alert('Preferences saved!')
    }

    return {
      name,
      email,
      currentPassword,
      newPassword,
      preferences,
      updateProfile,
      updatePassword,
      savePreferences,
    }
  },
}
</script>

<style scoped>
input {
  width: 100%;
}
</style>
