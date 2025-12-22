<template>
  <div id="app" class="flex h-screen">
    <!-- Sidebar -->
    <Sidebar 
      :nav-items="navigationItems"
      :is-open="sidebarOpen" 
      @update:is-open="sidebarOpen = $event"
    />

    <!-- Main content -->
    <div class="flex-1 flex flex-col">
      <Header 
        :sidebar-open="sidebarOpen" 
        @toggle-sidebar="sidebarOpen = !sidebarOpen" 
      />
      <main class="p-4 flex-1 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
import { useUserStore } from './store/userStore';
import { useSocket } from './useSocket';

const userStore = useUserStore();
const { connect, disconnect } = useSocket();

// Sidebar state
const sidebarOpen = ref(false);

const navigationItems = computed(() => {
  const baseItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/history', label: 'History' },
    { path: '/scan-food', label: 'Scan Food' },
    { path: '/my-recipes', label: 'My Recipes' },
    { path: '/find-recipe', label: 'Find Recipe' },
    { path: '/diet', label: 'Diet' }
  ];

  // Admin-specific items if user is admin
  if (userStore.user?.isAdmin) {
    return [
      { path: '/admin', label: 'Dashboard' },
      { path: '/admin/users', label: 'Manage Users' },
      { path: '/admin/recipes', label: 'Manage Recipes' },
      { path: '/settings', label: 'Settings' }
    ];
  }

  // Regular user items
  return [...baseItems, { path: '/settings', label: 'Settings' }];
});

onMounted(() => {
  connect();
  
  // Open sidebar by default on desktop
  if (window.innerWidth >= 1024) {
    sidebarOpen.value = true;
  }
});

onUnmounted(() => {
  disconnect();
});
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
}
</style>