<template>
  <div>
    <!-- Overlay (visible when sidebar is open on mobile) -->
    <div v-if="isOpen" @click="closeSidebar" class="fixed inset-0 z-30 lg:hidden" style="background-color: rgba(0, 0, 0, 0.5);"></div>

    <!-- Sidebar -->
    <aside
      class="app-sidebar w-64 h-screen bg-gray-800 text-white flex flex-col p-4 fixed lg:static z-40 transition-transform duration-300"
      :class="{ '-translate-x-full lg:translate-x-0': !isOpen, 'translate-x-0': isOpen }">
      
      <!-- Header with logo -->
      <div class="flex items-center mb-8 mt-4 lg:mt-0">
        <div class="sidebar-logo text-2xl font-bold">{{ appName }}</div>
      </div>

      <nav class="flex flex-col gap-2">
        <router-link 
          v-for="item in computedNavItems" 
          :key="item.path"
          :to="item.path" 
          class="sidebar-link text-white no-underline" 
          active-class="active-link"
          @click="closeSidebarOnMobile">
          {{ item.label }}
        </router-link>
      </nav>
    </aside>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useUserStore } from '../store/userStore'

const props = defineProps({
  navItems: {
    type: Array,
    default: null
  },
  appName: {
    type: String,
    default: 'TrackBite'
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:isOpen'])

const userStore = useUserStore()

const computedNavItems = computed(() => {
  // If navItems prop is provided, use it
  if (props.navItems) {
    return props.navItems
  }

  // Otherwise, compute based on user role
  const baseItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/history', label: 'History' },
    { path: '/scan-food', label: 'Scan Food' },
    { path: '/recipes', label: 'Recipes' },
    { path: '/diet', label: 'Diet' },
    { path: '/settings', label: 'Settings' }
  ]

  return [...baseItems]
})

const closeSidebar = () => {
  emit('update:isOpen', false)
}

const closeSidebarOnMobile = () => {
  // Close sidebar on mobile when a link is clicked
  if (window.innerWidth < 1024) {
    closeSidebar()
  }
}

onMounted(() => {
  // Open sidebar by default on desktop
  if (window.innerWidth >= 1024) {
    emit('update:isOpen', true)
  }
})
</script>

<style scoped>
.sidebar-link {
  padding: 10px 12px;
  border-radius: 4px;
  text-decoration: none;
  color: inherit;
  transition: background 0.2s;
}

.sidebar-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.active-link {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: bold;
}
</style>