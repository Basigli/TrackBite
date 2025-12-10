<template>
  <div class="community-recipes mt-4 max-w-2xl mx-auto">
    <div class="bg-white rounded-lg shadow p-4 mb-4">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">Community Recipe Feed</h2>
      <p class="text-sm text-gray-600">
        Real-time recipes from other users
      </p>
    </div>

    <RecipeFeed />
  </div>
</template>

<script setup lang="ts">
import RecipeFeed from '../components/RecipeFeed.vue';
</script>