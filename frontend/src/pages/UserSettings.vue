<template>
  <div class="user-settings max-w-5xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">User Settings</h1>

    <div class="flex flex-col gap-6">
      <!-- Profile Info Form -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Profile Info</h2>
        <form @submit.prevent="updateProfile" class="flex flex-col gap-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              id="name"
              v-model="name"
              type="text"
              placeholder="Enter your name"
              class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="Enter your email"
              class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
          <button type="submit" class="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded transition">
            Save Profile
          </button>
        </form>
      </div>

      <!-- Change Password Form -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Change Password</h2>
        <form @submit.prevent="updatePassword" class="flex flex-col gap-4">
          <div>
            <label for="current-password" class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              id="current-password"
              v-model="currentPassword"
              type="password"
              placeholder="Enter current password"
              class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label for="new-password" class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              id="new-password"
              v-model="newPassword"
              type="password"
              placeholder="Enter new password"
              class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded transition">
            Change Password
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, watch } from 'vue'
import { useUserStore } from '../store/userStore'
import {notifySuccess, notifyError, notifyInfo} from '../utils/Notifications';

export default {
  name: 'UserSettings',
  setup() {
    const store = useUserStore()
    const userId = store.user?._id

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
      const success = await store.updateUser({ nickname: name.value, mail: email.value })
      if (success) notifyInfo('Profile updated!')
    }

    const updatePassword = async () => {
      const success = await store.changePassword(currentPassword.value, newPassword.value)
      if (success) {
        notifySuccess('Password changed!')
        currentPassword.value = ''
        newPassword.value = ''
      } else {
        notifyError('Failed to change password')
      }
    }

    return {
      name,
      email,
      currentPassword,
      newPassword,
      preferences,
      updateProfile,
      updatePassword,
    }
  },
}
</script>

<style scoped>
input {
  width: 100%;
}
</style>