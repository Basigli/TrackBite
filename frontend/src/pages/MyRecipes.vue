<template>
  <div class="recipes-page max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Recipes</h1>
    
    <!-- Add Recipe Form -->
    <div class="mb-6">
      <!-- Listen to 'recipe-added' event -->
      <AddRecipe @recipe-added="onRecipeAdded" />
    </div>

    <!-- Recipe List -->
    <div v-if="recipes.length > 0">
      <RecipeList
        :recipes="recipes"
        @delete-recipe="deleteRecipe"
        @save-recipe="updateRecipe"
      />
    </div>

    <!-- Empty state -->
    <div v-else class="text-gray-500 text-center py-6">
      No recipes found. Add a new recipe above.
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRecipeStore } from '../store/recipeStore';
import RecipeList from '../components/RecipeList.vue';
import AddRecipe from '../components/AddRecipe.vue';
import { useUserStore } from '@/store/userStore';

const store = useRecipeStore();
const userStore = useUserStore();
const userId = userStore.user?._id;

const recipes = computed(() => store.recipes);

const fetchRecipes = () => store.fetchRecipes(userId);
const deleteRecipe = (recipeId) => store.deleteRecipe(recipeId, userId);
const updateRecipe = (recipeId, data) => store.updateRecipe(recipeId, userId, data);

// Event handler for newly added recipe
const onRecipeAdded = (recipe) => {
  store.recipes.push(recipe);
  fetchRecipes();
};

// Initial fetch
onMounted(() => {
  fetchRecipes();
});
</script>
