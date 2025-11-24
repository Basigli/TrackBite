<template>
  <div class="user-settings max-w-md mx-auto p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">User Settings</h1>

    <!-- Profile Info Form -->
    <form @submit.prevent="updateProfile" class="flex flex-col gap-4 p-4 rounded-lg shadow bg-white">
      <h2 class="text-xl font-semibold text-gray-700 mb-2">Profile Info</h2>
      <input
        v-model="name"
        type="text"
        placeholder="Name"
        class="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        required
      />
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        required
      />
      <button type="submit" class="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded transition">
        Save Profile
      </button>
    </form>

    <!-- Change Password Form -->
    <form @submit.prevent="updatePassword" class="flex flex-col gap-4 p-4 rounded-lg shadow bg-white mt-6">
      <h2 class="text-xl font-semibold text-gray-700 mb-2">Change Password</h2>
      <input
        v-model="currentPassword"
        type="password"
        placeholder="Current Password"
        class="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
      <input
        v-model="newPassword"
        type="password"
        placeholder="New Password"
        class="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
      <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded transition">
        Change Password
      </button>
    </form>

    <!-- Preferences -->
<div class="preferences border p-4 rounded bg-gray-50 mt-4">
  <h2 class="font-semibold mb-2">Preferences</h2>

  <label class="flex items-center justify-between gap-2">
    <span class="inline-block w-40">Dark Mode</span>
    <input type="checkbox" v-model="preferences.darkMode" />
  </label>

  <label class="flex items-center justify-between gap-2 mt-2">
    <span class="inline-block w-40">Notifications</span>
    <input type="checkbox" v-model="preferences.notifications" />
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
