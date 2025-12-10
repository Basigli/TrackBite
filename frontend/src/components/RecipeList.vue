<template>
  <div class="recipe-list mt-4 max-w-2xl mx-auto">
    <Toast ref="toastRef" />
    <!-- Empty State -->
    <div v-if="recipes.length === 0" class="text-gray-500 text-center py-8">
      <p class="text-lg mb-2">No recipes found.</p>
      <p class="text-sm">Create your first recipe to get started!</p>
    </div>

    <!-- Recipe List -->
    <ul class="space-y-3">
      <li
        v-for="recipe in recipes"
        :key="recipe._id"
      >
        <RecipeCard
          :recipe="recipe"
          :show-delete="true"
          @delete="deleteRecipe"
          @added-to-intake="onAddedToIntake"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRecipeStore } from '../store/recipeStore';
import RecipeCard from './RecipeCard.vue';
import Toast from './Toast.vue';
import type { Recipe as RecipeType } from '../models/Recipe';

const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const store = useRecipeStore();

const recipes = computed(() => store.recipes);

const emit = defineEmits(['delete-recipe']);

const deleteRecipe = (recipeId: string) => {
  emit('delete-recipe', recipeId);
};

const onAddedToIntake = (recipe: RecipeType) => {
  toastRef.value?.show(`Added "${recipe.name}" and its ingredients to daily intake!`);
};
</script>