<template>
  <header class="app-header flex items-center justify-between p-4 bg-green-500 text-white">
    <div class="logo text-xl font-bold lg:hidden">CalorieTracker</div>

    <div class="header-actions flex items-center gap-4">
      <!-- Date picker -->
      <input
        type="date"
        v-model="selectedDate"
        @change="dateChanged"
        class="rounded px-2 py-1 text-black"
      />

      <!-- User profile dropdown -->
      <div class="user-menu relative" @click="toggleMenu">
        <span class="cursor-pointer">{{ user.name }}</span>
        <ul
          v-if="menuOpen"
          class="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-48"
        >
          <li @click="goToSettings" class="px-4 py-2 hover:bg-gray-200 cursor-pointer">Settings</li>
          <li @click="logout" class="px-4 py-2 hover:bg-gray-200 cursor-pointer">Logout</li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Header',
  setup() {
    const router = useRouter()
    const user = inject('user', { name: 'Guest' })
    const selectedDate = ref(new Date().toISOString().substr(0, 10))
    const menuOpen = ref(false)

    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value
    }

    const goToSettings = () => {
      router.push('/settings')
      menuOpen.value = false
    }

    const logout = () => {
      console.log('Logout clicked') // integrate auth logic
    }

    const dateChanged = () => {
      console.log('Selected date:', selectedDate.value)
      // Emit or update store if needed
    }

    return { user, selectedDate, menuOpen, toggleMenu, goToSettings, logout, dateChanged }
  },
}
</script>

<style scoped>
.app-header {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
