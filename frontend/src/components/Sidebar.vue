<template>
  <div>
    <!-- Hamburger Button (visible on mobile) -->
    <button @click="toggleSidebar" class="hamburger-btn fixed top-4 left-4 z-50 lg:hidden bg-gray-800 p-2 rounded-md"
      :class="{ active: isOpen }">
      <div class="hamburger lg:hidden">
        <span class="line lg:hidden"></span>
        <span class="line lg:hidden"></span>
        <span class="line lg:hidden"></span>
      </div>
    </button>
    <!-- Overlay (visible when sidebar is open on mobile) -->
    <div v-if="isOpen" @click="toggleSidebar" class="fixed inset-0 z-30 lg:hidden" style="background-color: rgba(0, 0, 0, 0.5);"></div>

    <!-- Sidebar -->
    <aside
      class="app-sidebar w-64 h-screen bg-gray-800 text-white flex flex-col p-4 fixed lg:static z-40 transition-transform duration-300"
      :class="{ '-translate-x-full lg:translate-x-0': !isOpen, 'translate-x-0': isOpen }">
      <div class="sidebar-logo text-2xl font-bold mb-8 mt-16 lg:mt-0">{{ appName }}</div>
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

<script>
import { useUserStore } from '../store/userStore'

export default {
  name: 'Sidebar',
  props: {
    navItems: {
      type: Array,
      default: null
    },
    appName: {
      type: String,
      default: 'TrackBite'
    }
  },
  data() {
    return {
      isOpen: false,
    }
  },
  computed: {
    computedNavItems() {
      // If navItems prop is provided, use it
      if (this.navItems) {
        return this.navItems
      }

      // Otherwise, compute based on user role
      const userStore = useUserStore()
      const baseItems = [
        { path: '/', label: 'Dashboard' },
        { path: '/history', label: 'History' },
        { path: '/scan-food', label: 'Scan Food' },
        { path: '/recipes', label: 'Recipes' },
        { path: '/diet', label: 'Diet' }
      ]

      if (userStore.user?.isAdmin) {
        return [
          // ...baseItems,
          // { path: '/admin/users', label: 'Manage Users' },
          // { path: '/admin/reports', label: 'Reports' },
          // { path: '/settings', label: 'Settings' }
        ]
      }

      return [...baseItems, { path: '/settings', label: 'Settings' }]
    }
  },
  methods: {
    toggleSidebar() {
      this.isOpen = !this.isOpen
    },
    closeSidebarOnMobile() {
      // Close sidebar on mobile when a link is clicked
      if (window.innerWidth < 1024) {
        this.isOpen = false
      }
    },
  },
  mounted() {
    // Open sidebar by default on desktop
    if (window.innerWidth >= 1024) {
      this.isOpen = true
    }
  },
}
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

/* Hamburger Menu Styles */
.hamburger-btn {
  width: 40px;
  height: 40px;
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
  width: 24px;
  height: 18px;
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
  transform: translateY(8px) rotate(45deg);
}

.hamburger-btn.active .line:nth-child(2) {
  opacity: 0;
  transform: translateX(-10px);
}

.hamburger-btn.active .line:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}
@media (min-width: 1024px) {
  .hamburger-btn {
    display: none !important;
  }
}
</style>