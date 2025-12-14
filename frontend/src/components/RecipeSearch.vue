<template>
  <div class="recipe-search">
    <!-- Search Bar -->
    <div class="bg-white rounded-lg shadow p-4 mb-4">
      <div class="flex gap-2">
        <div class="relative flex-1">
          <input
            v-model="searchQuery"
            @keyup.enter="performSearch"
            type="text"
            placeholder="Search recipes by ingredient (e.g., chicken, tomato, rice)..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <button
          @click="performSearch"
          :disabled="!searchQuery.trim() || isSearching"
          class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium px-6 py-2 rounded-lg transition"
        >
          {{ isSearching ? 'Searching...' : 'Search' }}
        </button>
      </div>
      
      <!-- Search Info -->
      <div v-if="hasSearched" class="mt-2 text-sm text-gray-600">
        <span v-if="searchResults.length > 0">
          Found {{ searchResults.length }} recipe{{ searchResults.length !== 1 ? 's' : '' }} with "{{ lastSearchQuery }}"
        </span>
        <span v-else>
          No recipes found with "{{ lastSearchQuery }}"
        </span>
      </div>
    </div>

    <!-- Search Results -->
    <div v-if="hasSearched" class="space-y-3">
      <!-- No Results State -->
      <div v-if="searchResults.length === 0" class="bg-white rounded-lg shadow p-8 text-center">
        <div class="text-gray-400 text-5xl mb-4">🔍</div>
        <p class="text-gray-600 text-lg mb-2">No recipes found</p>
        <p class="text-gray-500 text-sm">Try searching for a different ingredient</p>
      </div>

      <!-- Results List -->
      <ul v-else class="space-y-3">
        <transition-group name="recipe-list">
          <li
            v-for="recipe in searchResults"
            :key="recipe._id"
            class="recipe-item"
          >
            <RecipeCard
              :recipe="recipe"
              :show-user-info="true"
              :show-save="true"
              @save="saveToMyRecipes"
              @added-to-intake="onAddedToIntake"
            >
              <template #badge>
                <div class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  Contains: {{ lastSearchQuery }}
                </div>
              </template>
            </RecipeCard>
          </li>
        </transition-group>
      </ul>
    </div>

    <!-- Empty State (no search yet) -->
    <div v-else class="bg-white rounded-lg shadow p-8 text-center">
      <div class="text-gray-300 text-6xl mb-4">🔍</div>
      <p class="text-gray-600 text-lg mb-2">Search for recipes by ingredient</p>
      <p class="text-gray-500 text-sm">Enter an ingredient name above to find recipes</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRecipeStore } from '../store/recipeStore';
import RecipeCard from './RecipeCard.vue';
import type { Recipe as RecipeType } from '../models/Recipe';
import { notifySuccess, notifyError } from '../utils/Notifications';

const recipeStore = useRecipeStore();

const searchQuery = ref('');
const lastSearchQuery = ref('');
const searchResults = ref<RecipeType[]>([]);
const isSearching = ref(false);
const hasSearched = ref(false);

const performSearch = async () => {
  const query = searchQuery.value.trim();
  if (!query) return;

  isSearching.value = true;
  lastSearchQuery.value = query;
  hasSearched.value = true;

  try {
    await recipeStore.searchRecipesByQuery(query);
    searchResults.value = recipeStore.searchResults;
  } catch (error) {
    console.error('Error searching recipes:', error);
    notifyError('Failed to search recipes');
  } finally {
    isSearching.value = false;
  }
};

const clearSearch = () => {
  searchQuery.value = '';
  searchResults.value = [];
  hasSearched.value = false;
  lastSearchQuery.value = '';
};

const saveToMyRecipes = async (recipe: RecipeType) => {
  try {
    await recipeStore.saveCommunityRecipeToOwn(recipe);
    notifySuccess(`"${recipe.name}" saved to your recipes!`);
  } catch (error) {
    console.error('Error saving recipe:', error);
    notifyError('Failed to save recipe');
  }
};

const onAddedToIntake = (recipe: RecipeType) => {
  notifySuccess(`Added "${recipe.name}" to your daily intake!`);
};
</script>

<style scoped>
.recipe-list-enter-active {
  transition: all 0.4s ease;
}

.recipe-list-leave-active {
  transition: all 0.3s ease;
  position: absolute;
}

.recipe-list-enter-from {
  transform: translateY(-30px);
  opacity: 0;
}

.recipe-list-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

.recipe-list-move {
  transition: transform 0.4s ease;
}
</style>