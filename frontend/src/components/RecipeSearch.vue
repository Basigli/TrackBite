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
      <div v-if="searchResults.length === 0" class="bg-white rounded-lg shadow p-8 text-center">
        <div class="text-gray-400 text-5xl mb-4">🔍</div>
        <p class="text-gray-600 text-lg mb-2">No recipes found</p>
        <p class="text-gray-500 text-sm">Try searching for a different ingredient</p>
      </div>

      <ul v-else class="space-y-3">
        <transition-group name="recipe-list">
          <li
            v-for="recipe in searchResults"
            :key="recipe._id"
            class="recipe-item"
          >
            <div class="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div class="p-4">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <div class="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
                      {{ getInitials(recipe.userName || 'Unknown') }}
                    </div>
                    <div>
                      <p class="text-xs text-gray-500">
                        {{ recipe.userName || 'Anonymous User' }}
                      </p>
                      <p v-if="recipe.createdAt" class="text-xs text-gray-400">
                        {{ formatDate(recipe.createdAt) }}
                      </p>
                    </div>
                  </div>
                  
                  <!-- Highlight matched ingredient -->
                  <div class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    Contains: {{ lastSearchQuery }}
                  </div>
                </div>

                <Recipe :recipe="recipe" />

                <div class="flex gap-2 mt-3">
                  <button
                    @click="addRecipeToDailyIntake(recipe)"
                    class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm px-4 py-2 rounded transition"
                  >
                    Add to My Daily Intake
                  </button>
                  <button
                    @click="saveToMyRecipes(recipe)"
                    class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm px-4 py-2 rounded transition"
                    :disabled="isRecipeSaved(recipe)"
                    :class="{ 'opacity-50 cursor-not-allowed': isRecipeSaved(recipe) }"
                  >
                    {{ isRecipeSaved(recipe) ? 'Saved' : 'Save' }}
                  </button>
                </div>
              </div>
            </div>
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
import { useIntakeStore } from '../store/intakeStore';
import { useUserStore } from '../store/userStore';
import Recipe from './Recipe.vue';
import type { Recipe as RecipeType } from '../models/Recipe';

const recipeStore = useRecipeStore();
const intakeStore = useIntakeStore();
const userStore = useUserStore();

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
    await recipeStore.searchRecipesByIngredient(query);
    searchResults.value = recipeStore.searchResults;
  } catch (error) {
    console.error('Error searching recipes:', error);
    alert('Failed to search recipes');
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

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (timestamp: string | Date): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
};

const isRecipeSaved = (recipe: RecipeType): boolean => {
  return userStore.user?.savedRecipesIds.includes(recipe._id) || false;
};

const addRecipeToDailyIntake = async (recipe: RecipeType) => {
  if (!userStore.user?._id) {
    alert('Please log in to add to daily intake');
    return;
  }

  const date = intakeStore.selectedDate;

  try {
    for (const ingredient of recipe.ingredients) {
      await intakeStore.addToDailyIntake(userStore.user._id, ingredient, date);
    }
    alert(`Added "${recipe.name}" to your daily intake!`);
  } catch (error) {
    console.error('Error adding to daily intake:', error);
    alert('Failed to add recipe to daily intake');
  }
};

const saveToMyRecipes = async (recipe: RecipeType) => {
  if (!userStore.user?._id) {
    alert('Please log in to save recipes');
    return;
  }

  if (isRecipeSaved(recipe)) {
    return;
  }

  try {
    await recipeStore.saveCommunityRecipeToOwn(recipe);
    alert(`"${recipe.name}" saved to your recipes!`);
  } catch (error) {
    console.error('Error saving recipe:', error);
    alert('Failed to save recipe');
  }
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