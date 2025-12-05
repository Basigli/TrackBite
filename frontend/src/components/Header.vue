<template>
  <header class="app-header flex items-center justify-between px-6 py-4 bg-green-500 text-white shadow-md">
    <div class="logo text-xl font-bold lg:hidden">TrackBite</div>

    <div class="header-actions flex items-center gap-4">
      <!-- Date picker - only show when logged in -->
      <input
        v-if="isAuthenticated"
        type="date"
        v-model="selectedDate"
        @change="dateChanged"
        class="date-input rounded-md px-3 py-1 text-white placeholder-white border border-white focus:outline-none focus:ring-2 focus:ring-white bg-green-500 appearance-none"
      />

      <!-- User profile dropdown -->
      <div class="user-menu relative">
        <button
          @click="toggleMenu"
          class="flex items-center gap-2 font-medium hover:text-gray-100 focus:outline-none"
        >
          {{ displayName }}
          <svg
            class="w-4 h-4 transition-transform duration-200"
            :class="{ 'rotate-180': menuOpen }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Dropdown menu -->
        <transition name="fade">
          <ul
            v-if="menuOpen"
            class="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg w-48 py-1 z-50"
          >
            <!-- Show different options based on auth status -->
            <template v-if="isAuthenticated">
              <li @click="goToSettings" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
              <li @click="handleLogout" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
            </template>
            <template v-else>
              <li @click="goToLogin" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Login</li>
              <li @click="goToRegister" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Register</li>
            </template>
          </ul>
        </transition>
      </div>
    </div>
  </header>
</template>

<script>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/userStore'
import { useIntakeStore } from '@/store/intakeStore'
import { storeToRefs } from 'pinia'

export default {
  name: 'Header',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const intakeStore = useIntakeStore()
    const { selectedDate } = storeToRefs(intakeStore)
    
    const menuOpen = ref(false)

    // Check if user is authenticated
    const isAuthenticated = computed(() => {
      return !!userStore.authToken.value && !userStore.isTokenExpired()
    })

    // Get display name
    const displayName = computed(() => {
      if (!isAuthenticated.value || !userStore.user || !userStore.user._id) {
        return 'Guest'
      }
      return userStore.user.nickname || userStore.user.name || 'Guest'
    })

    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value
    }

    const goToSettings = () => {
      router.push('/settings')
      menuOpen.value = false
    }

    const goToLogin = () => {
      router.push('/login')
      menuOpen.value = false
    }

    const goToRegister = () => {
      router.push('/register')
      menuOpen.value = false
    }

    const handleLogout = () => {
      userStore.logout()
      router.push('/login')
      menuOpen.value = false
    }

    const dateChanged = () => {
      console.log('Selected date:', selectedDate.value)
      const userId = userStore.user?._id
      if (userId) {
        intakeStore.fetchDailyIntake(userId)
      }
    }

    return { 
      displayName,
      isAuthenticated,
      selectedDate, 
      menuOpen, 
      toggleMenu, 
      goToSettings,
      goToLogin,
      goToRegister,
      handleLogout, 
      dateChanged 
    }
  }
}
</script>

<style scoped>
.app-header {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>