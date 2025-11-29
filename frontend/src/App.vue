<template>
  <div id="app" class="flex h-screen">
    <!-- Sidebar -->
    <Sidebar />

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

export default {
  name: 'App',
  components: { Header, Sidebar },
};
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
}
</style>
