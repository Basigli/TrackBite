<template>
  <div class="user-settings min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-slate-800 to-indigo-600 bg-clip-text text-transparent mb-2">
          Account Settings
        </h1>
        <p class="text-slate-600">Manage your profile and account preferences</p>
      </div>

      <div class="flex flex-col gap-6">
        <!-- Profile Info Form -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 class="text-2xl font-semibold text-slate-800">Profile Information</h2>
          </div>
          <form @submit.prevent="updateProfile" class="flex flex-col gap-5">
            <div class="group">
              <label for="name" class="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <input
                id="name"
                v-model="name"
                type="text"
                placeholder="Enter your name"
                class="w-full border-2 border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-200 bg-white"
                required
              />
            </div>
            <div class="group">
              <label for="email" class="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="Enter your email"
                class="w-full border-2 border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-200 bg-white"
                required
              />
            </div>
            <button 
              type="submit" 
              class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Save Changes
            </button>
          </form>
        </div>

        <!-- Change Password Form -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 class="text-2xl font-semibold text-slate-800">Security</h2>
          </div>
          <form @submit.prevent="updatePassword" class="flex flex-col gap-5">
            <div class="group">
              <label for="current-password" class="block text-sm font-semibold text-slate-700 mb-2">Current Password</label>
              <input
                id="current-password"
                v-model="currentPassword"
                type="password"
                placeholder="Enter current password"
                class="w-full border-2 border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white"
                required
              />
            </div>
            <div class="group">
              <label for="new-password" class="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
              <input
                id="new-password"
                v-model="newPassword"
                type="password"
                placeholder="Enter new password"
                class="w-full border-2 border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white"
                required
              />
            </div>
            <button 
              type="submit" 
              class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Update Password
            </button>
          </form>
        </div>

        <!-- Delete Account Section -->
        <div class="bg-gradient-to-br from-red-50 to-pink-50 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-red-200 p-8 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 class="text-2xl font-semibold text-slate-800">Danger Zone</h2>
          </div>
          <p class="text-slate-700 mb-6 leading-relaxed">
            Once you delete your account, there is no going back. All your data will be permanently removed and cannot be recovered.
          </p>
          <button 
            @click="confirmDelete"
            class="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Delete Account Permanently
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div v-if="showDeleteModal" class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div class="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-red-100">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-800 mb-4 text-center">Delete Account?</h3>
            <p class="text-slate-600 mb-8 text-center leading-relaxed">
              Are you absolutely sure? This action cannot be undone and all your data will be permanently removed from our servers.
            </p>
            <div class="flex flex-col gap-3">
              <button 
                @click="handleDeleteAccount"
                class="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Yes, Delete My Account
              </button>
              <button 
                @click="showDeleteModal = false"
                class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, reactive, onMounted, watch } from 'vue'
import { useUserStore } from '../store/userStore'
import { useRouter } from 'vue-router'
import { notifySuccess, notifyError, notifyInfo } from '../utils/Notifications'

export default {
  name: 'UserSettings',
  setup() {
    const store = useUserStore()
    const router = useRouter()
    const userId = store.user?._id

    const name = ref('')
    const email = ref('')
    const currentPassword = ref('')
    const newPassword = ref('')
    const preferences = reactive({ darkMode: false, notifications: true })
    const showDeleteModal = ref(false)

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

    const confirmDelete = () => {
      showDeleteModal.value = true
    }

    const handleDeleteAccount = async () => {
      const success = await store.deleteAccount()
      if (success) {
        notifySuccess('Account deleted successfully')
        router.push('/login')
      } else {
        notifyError('Failed to delete account')
        showDeleteModal.value = false
      }
    }

    return {
      name,
      email,
      currentPassword,
      newPassword,
      preferences,
      showDeleteModal,
      updateProfile,
      updatePassword,
      confirmDelete,
      handleDeleteAccount,
    }
  },
}
</script>

<style scoped>
input {
  width: 100%;
}
</style>