<template>
  <div class="recipes-page max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Recipes</h1>

    <div class="mb-6">
      <AddRecipe @recipe-added="fetchRecipes" />
    </div>

    <div>
      <RecipeList
        :recipes="recipes"
        @delete-recipe="deleteRecipe"
        @edit-recipe="updateRecipe"
      />
    </div>

    <!-- Empty state -->
    <div v-if="recipes.length === 0" class="text-gray-500 text-center py-6">
      No recipes found. Add a new recipe above.
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useRecipeStore } from '../store/recipeStore';
import RecipeList from '../components/RecipeList.vue';
import AddRecipe from '../components/AddRecipe.vue';

export default {
  name: 'Recipes',
  components: { RecipeList, AddRecipe },
  setup() {
    const store = useRecipeStore();
    const userId = 1; // replace with logged-in user

    const fetchRecipes = () => store.fetchRecipes(userId);
    const deleteRecipe = (recipeId) => store.deleteRecipe(recipeId, userId);
    const updateRecipe = (recipeId, data) => store.updateRecipe(recipeId, userId, data);

    onMounted(() => {
      fetchRecipes();
    });

    return { recipes: store.recipes, fetchRecipes, deleteRecipe, updateRecipe };
  }
};
</script>
