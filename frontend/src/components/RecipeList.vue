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

        <button
          @click="deleteRecipe(recipe._id)"
          class="text-red-500 hover:text-red-700 font-medium text-sm mt-1"
        >
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRecipeStore } from '../store/recipeStore';
import Recipe from './Recipe.vue';

const store = useRecipeStore();
const recipes = computed(() => store.recipes);

const emit = defineEmits(['delete-recipe']);

const deleteRecipe = (recipeId) => {
  emit('delete-recipe', recipeId);
};
</script>
