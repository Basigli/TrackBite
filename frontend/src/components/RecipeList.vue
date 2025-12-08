<template>
  <div class="recipe-list mt-4 max-w-2xl mx-auto">
    <div v-if="recipes.length === 0" class="text-gray-500 text-center py-4">
      No recipes found.
    </div>

    <ul>
      <li
        v-for="recipe in recipes"
        :key="recipe._id"
        class="mb-3"
      >
        <Recipe :recipe="recipe" />

        <div class="flex gap-2 mt-1">
          <button
            @click="deleteRecipe(recipe._id)"
            class="bg-red-500 hover:bg-red-600 text-white font-medium text-sm px-3 py-1 rounded transition"
          >
            Delete
          </button>

          <button
            @click="addRecipeToDailyIntake(recipe)"
            class="bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm px-3 py-1 rounded"
          >
            Add to Daily Intake
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRecipeStore } from '../store/recipeStore';
import { useIntakeStore } from '../store/intakeStore';
import { useUserStore } from '../store/userStore';
import Recipe from './Recipe.vue';

const store = useRecipeStore();
const intakeStore = useIntakeStore();
const userStore = useUserStore();

const recipes = computed(() => store.recipes);

const emit = defineEmits(['delete-recipe']);

const deleteRecipe = (recipeId: string) => {
  emit('delete-recipe', recipeId);
};

const addRecipeToDailyIntake = async (recipe: any) => {
  if (!userStore.user?._id) {
    alert('Please log in to add to daily intake');
    return;
  }

  const date = intakeStore.selectedDate;

  for (const ingredient of recipe.ingredients) {
    await intakeStore.addToDailyIntake(userStore.user._id, ingredient, date);
  }

  alert(`Added "${recipe.name}" and its ingredients to daily intake!`);
};
</script>
