<template>
  <div id="app" class="flex h-screen">
    <!-- Sidebar -->
    <Sidebar :navItems="navigationItems" />

    <!-- Main content -->
    <div class="flex-1 flex flex-col">
      <Header />
      <main class="p-4 flex-1 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
import { useUserStore } from './store/userStore';

export default {
  name: 'App',
  components: { Header, Sidebar },
  computed: {
    navigationItems() {
      const userStore = useUserStore();
      
      const baseItems = [
        { path: '/', label: 'Dashboard' },
        { path: '/history', label: 'History' },
        { path: '/scan-food', label: 'Scan Food' },
        { path: '/recipes', label: 'Recipes' },
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
    }
  }
};
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
}
</style>