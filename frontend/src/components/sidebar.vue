<template>
  <aside class="app-sidebar w-64 h-screen bg-gray-800 text-white flex flex-col p-4">
    <div class="sidebar-logo text-2xl font-bold mb-8">
      CalorieTracker
    </div>

    <nav class="flex flex-col gap-2">
      <router-link to="/" class="sidebar-link" active-class="active-link">Dashboard</router-link>
      <router-link to="/history" class="sidebar-link" active-class="active-link">History</router-link>
      <router-link to="/add-food" class="sidebar-link" active-class="active-link">Add Food</router-link>
      <router-link to="/recipes" class="sidebar-link" active-class="active-link">Recipes</router-link>
      <router-link to="/diet" class="sidebar-link" active-class="active-link">Diet</router-link>
      <router-link to="/settings" class="sidebar-link" active-class="active-link">Settings</router-link>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
};
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
  background-color: rgba(255,255,255,0.1);
}
.active-link {
  background-color: rgba(255,255,255,0.2);
  font-weight: bold;
}
</style>
