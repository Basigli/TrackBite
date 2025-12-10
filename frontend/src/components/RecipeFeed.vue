<template>
  <div class="space-y-3">
    <Toast ref="toastRef" />
    <!-- Show notification when new recipe is detected -->
    <transition name="slide-down">
      <div 
        v-if="hasNewRecipes" 
        class="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between"
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

    <!-- Empty State -->
    <div v-if="recipes.length === 0" class="text-gray-500 text-center py-8">
      <p class="text-lg mb-2">No community recipes yet.</p>
      <p class="text-sm">Recipes from other users will appear here in real-time!</p>
    </div>

    <!-- Recipe List -->
    <ul class="space-y-3">
      <transition-group name="recipe-list">
        <li
          v-for="recipe in recipes"
          :key="recipe._id"
          class="recipe-item"
        >
          <RecipeCard
            :recipe="recipe"
            :show-user-info="true"
            :show-save="true"
            @save="saveToMyRecipes"
            @added-to-intake="onAddedToIntake"
          />
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
import RecipeCard from './RecipeCard.vue';
import Toast from './Toast.vue';
import type { Recipe as RecipeType } from '../models/Recipe';

const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const intakeStore = useIntakeStore();
const userStore = useUserStore();
const recipeStore = useRecipeStore();

const lastSeenCount = ref(0);
const recipes = computed(() => recipeStore.communityRecipes);

// Track new recipes since component mounted
const hasNewRecipes = computed(() => {
  return recipes.value.length > lastSeenCount.value;
});

const newRecipeCount = computed(() => {
  return recipes.value.length - lastSeenCount.value;
});

const acknowledgeNewRecipes = () => {
  lastSeenCount.value = recipes.value.length;
};

onMounted(async () => {
  if (userStore.user?._id) {
    await recipeStore.fetchRecentCommunityRecipes(userStore.user._id);
  }
  lastSeenCount.value = recipes.value.length;
});

// Watch for new recipes and show notification briefly
watch(() => recipes.value.length, (newCount, oldCount) => {
  if (newCount > oldCount) {
    // Auto-acknowledge after 5 seconds
    setTimeout(() => {
      lastSeenCount.value = recipes.value.length;
    }, 5000);
  }
});

const saveToMyRecipes = async (recipe: RecipeType) => {
  if (!userStore.user?._id) {
    toastRef.value?.show('Please log in to save recipes', 'error');
    return;
  }

  try {
    await recipeStore.saveCommunityRecipeToOwn(recipe);
    toastRef.value?.show(`"${recipe.name}" saved to your recipes!`);
  } catch (error) {
    console.error('Error saving recipe:', error);
    toastRef.value?.show('Failed to save recipe', 'error');
  }
};

const onAddedToIntake = (recipe: RecipeType) => {
  toastRef.value?.show(`Added "${recipe.name}" to your daily intake!`);
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