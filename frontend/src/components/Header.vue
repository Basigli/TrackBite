<template>
  <header class="app-header flex items-center justify-between gap-1 px-1 py-2 bg-green-500 text-white shadow-md">
    <div class="flex items-center gap-1">
      <!-- Hamburger button - only show on mobile -->
      <button 
        @click="toggleSidebar" 
        class="hamburger-btn lg:hidden bg-white/20 hover:bg-white/30 p-1 rounded-md transition-all duration-200"
        :class="{ active: sidebarOpen }"
      >
        <div class="hamburger">
          <span class="line"></span>
          <span class="line"></span>
          <span class="line"></span>
        </div>
      </button>
      
      <div class="logo text-lg font-bold gap-1 ml-4">TrackBite</div>
    </div>

    <div class="header-actions flex items-center gap-0.5">
      <!-- Date picker - only show when logged in -->
      <DatePicker v-if="isAuthenticated" />

      <!-- User profile dropdown -->
      <div class="user-menu relative">
        <button
          @click="toggleMenu"
          class="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/30"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="font-medium text-sm">{{ displayName }}</span>
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
        <transition name="slide-fade">
          <ul
            v-if="menuOpen"
            class="absolute right-0 mt-2 bg-white text-gray-800 rounded-xl shadow-2xl w-48 py-2 z-50 border border-gray-200"
          >
            <template v-if="isAuthenticated">
              <li @click="goToSettings" class="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </li>
              <li @click="handleLogout" class="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors text-red-600 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </li>
            </template>
            <template v-else>
              <li @click="goToLogin" class="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login
              </li>
              <li @click="goToRegister" class="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Register
              </li>
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
import DatePicker from './DatePicker.vue'

export default {
  name: 'Header',
  components: {
    DatePicker
  },
  props: {
    sidebarOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle-sidebar'],
  setup(props, { emit }) {
    const router = useRouter()
    const userStore = useUserStore()
    
    const menuOpen = ref(false)

    const isAuthenticated = computed(() => {
      return !!userStore.authToken.value && !userStore.isTokenExpired()
    })

    const displayName = computed(() => {
      if (!isAuthenticated.value || !userStore.user || !userStore.user._id) {
        return 'Guest'
      }
      return userStore.user.nickname || userStore.user.name || 'Guest'
    })

    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value
    }

    const toggleSidebar = () => {
      emit('toggle-sidebar')
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

    return { 
      displayName,
      isAuthenticated,
      menuOpen,
      toggleMenu,
      toggleSidebar,
      goToSettings,
      goToLogin,
      goToRegister,
      handleLogout
    }
  }
}
</script>

<style scoped>
.app-header {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.15s ease-in;
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Hamburger Menu Styles */
.hamburger-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.hamburger-btn:hover {
  transform: scale(1.1);
}

.hamburger {
  width: 20px;
  height: 14px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger .line {
  width: 100%;
  height: 2px;
  background-color: white;
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}

/* Animated hamburger to X */
.hamburger-btn.active .line:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}

.hamburger-btn.active .line:nth-child(2) {
  opacity: 0;
  transform: translateX(-10px);
}

.hamburger-btn.active .line:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}
</style>