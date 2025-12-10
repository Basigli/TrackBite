<template>
  <div class="community-recipes mt-4 max-w-2xl mx-auto">
    <div class="bg-white rounded-lg shadow p-4 mb-4">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">Community Recipes</h2>
      <p class="text-sm text-gray-600">
        Discover and share recipes with the community
      </p>
    </div>

    <!-- Tab Navigation -->
    <div class="bg-white rounded-lg shadow mb-4">
      <div class="flex border-b border-gray-200">
        <button
          @click="activeTab = 'feed'"
          :class="[
            'flex-1 px-6 py-3 font-medium text-sm transition-colors',
            activeTab === 'feed'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          ]"
        >
          <span class="flex items-center justify-center gap-2">
            <span>Live Feed</span>
          </span>
        </button>
        <button
          @click="activeTab = 'search'"
          :class="[
            'flex-1 px-6 py-3 font-medium text-sm transition-colors',
            activeTab === 'search'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          ]"
        >
          <span class="flex items-center justify-center gap-2">
            <span>Search by Ingredient</span>
          </span>
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <transition name="fade" mode="out-in">
      <RecipeFeed v-if="activeTab === 'feed'" key="feed" />
      <RecipeSearch v-else-if="activeTab === 'search'" key="search" />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import RecipeFeed from '../components/RecipeFeed.vue';
import RecipeSearch from '../components/RecipeSearch.vue';

const activeTab = ref<'feed' | 'search'>('feed');
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>