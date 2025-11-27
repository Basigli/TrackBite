<template>
  <header class="app-header flex items-center justify-between px-6 py-4 bg-green-500 text-white shadow-md">
    <div class="logo text-xl font-bold lg:hidden">TrackBite</div>

    <div class="header-actions flex items-center gap-4">
      <!-- Date picker -->
      <input
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
          {{ user.name }}
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
            <li @click="goToSettings" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
            <li @click="handleLogout" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
          </ul>
        </transition>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import { useUserStore } from '@/store/userStore'

export default {
  name: 'Header',
  setup() {
    const router = useRouter()
    const user = ref({ name: 'Guest' })
    const selectedDate = ref(new Date().toISOString().substr(0, 10))
    const menuOpen = ref(false)
    const userStore = useUserStore()
    // Function to load user from token
    
    // Load user when component mounts
    onMounted(() => {
      // loadUserFromToken()
      user.value.name = userStore.authToken.value;
    })

    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value
    }

    const goToSettings = () => {
      router.push('/settings')
      menuOpen.value = false
    }

    const handleLogout = () => {
      // Clear authentication data
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      
      // Reset user
      user.value = { name: 'Guest' }
      
      // Redirect to login
      router.push('/login')
      
      menuOpen.value = false
    }

    const dateChanged = () => {
      console.log('Selected date:', selectedDate.value)
      // Emit or update store if needed
    }

    return { 
      user, 
      selectedDate, 
      menuOpen, 
      toggleMenu, 
      goToSettings, 
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
</style>