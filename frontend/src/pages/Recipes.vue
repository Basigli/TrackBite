<template>
  <div class="recipes-page p-4">
    <h1 class="text-2xl font-bold mb-4">Recipes</h1>
    
    <AddRecipe @recipe-added="fetchRecipes" />
    
    <RecipeList :recipes="recipes" @delete-recipe="deleteRecipe" @edit-recipe="updateRecipe" />
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
