<template>
  <div class="community-recipes mt-4 max-w-2xl mx-auto">
    <div class="bg-white rounded-lg shadow p-4 mb-4">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">Community Recipe Feed</h2>
      <p class="text-sm text-gray-600">
        Real-time recipes from other users
      </p>
    </div>

    <!-- Show notification when new recipe is detected -->
    <transition name="slide-down">
      <div 
        v-if="hasNewRecipes" 
        class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between"
      >
        <div class="flex items-center gap-2">
          <span class="text-blue-600">🎉</span>
          <span class="text-blue-800 font-medium">{{ newRecipeCount }} new recipe(s)!</span>
        </div>
        <button 
          @click="acknowledgeNewRecipes"
          class="text-blue-600 hover:text-blue-800"
        >
          ✕
        </button>
      </div>
    </transition>

    <div v-if="recipeStore.communityRecipes.length === 0" class="text-gray-500 text-center py-8">
      <p class="text-lg mb-2">No community recipes yet.</p>
      <p class="text-sm">Recipes from other users will appear here in real-time!</p>
    </div>

    <ul class="space-y-3">
      <transition-group name="recipe-list">
        <li
          v-for="recipe in recipeStore.communityRecipes"
          :key="recipe._id"
          class="recipe-item"
        >
          <div class="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div class="p-4">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <div class="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                    {{ getInitials(recipe.userName || 'Unknown') }}
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">
                      {{ recipe.userName || 'Anonymous User' }}
                    </p>
                    <p class="text-xs text-gray-400">
                      {{ formatTime(recipe.createdAt) }}
                    </p>
                  </div>
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
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useIntakeStore } from '../store/intakeStore';
import { useUserStore } from '../store/userStore';
import { useRecipeStore } from '../store/recipeStore';
import Recipe from '../components/Recipe.vue';
import type { Recipe as RecipeType } from '../models/Recipe';

const intakeStore = useIntakeStore();
const userStore = useUserStore();
const recipeStore = useRecipeStore();

const lastSeenCount = ref(0);

// Track new recipes since component mounted
const hasNewRecipes = computed(() => {
  return recipeStore.communityRecipes.length > lastSeenCount.value;
});

const newRecipeCount = computed(() => {
  return recipeStore.communityRecipes.length - lastSeenCount.value;
});

const acknowledgeNewRecipes = () => {
  lastSeenCount.value = recipeStore.communityRecipes.length;
};

onMounted(async () => {
  if (userStore.user?._id) {
    await recipeStore.fetchRecentCommunityRecipes(userStore.user._id);
  }
  lastSeenCount.value = recipeStore.communityRecipes.length;
});

// Watch for new recipes and show notification briefly
watch(() => recipeStore.communityRecipes.length, (newCount, oldCount) => {
  if (newCount > oldCount) {
    // Auto-acknowledge after 5 seconds
    setTimeout(() => {
      lastSeenCount.value = recipeStore.communityRecipes.length;
    }, 5000);
  }
});

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatTime = (timestamp: string | Date): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
};

// Check if recipe is already saved
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
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

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