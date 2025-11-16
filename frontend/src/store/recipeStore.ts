import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import axios from 'axios';

export const useRecipeStore = defineStore('recipe', () => {
  const recipes = ref([]);
  const selectedRecipe = ref(null);

  const fetchRecipes = async (userId) => {
    try {
      const res = await axios.get(`/recipes/user/${userId}`);
      recipes.value = res.data;
    } catch (err) {
      console.error('Error fetching recipes:', err);
    }
  };

  const addRecipe = async (recipe) => {
    try {
      const res = await axios.post(`/recipes`, recipe);
      recipes.value.push(res.data);
    } catch (err) {
      console.error('Error adding recipe:', err);
    }
  };

  const deleteRecipe = async (recipeId, userId) => {
    try {
      await axios.delete(`/recipes/${recipeId}/user/${userId}`);
      recipes.value = recipes.value.filter(r => r.id !== recipeId);
    } catch (err) {
      console.error('Error deleting recipe:', err);
    }
  };

  const updateRecipe = async (recipeId, userId, updatedData) => {
    try {
      const res = await axios.put(`/recipes/${recipeId}/user/${userId}`, updatedData);
      const index = recipes.value.findIndex(r => r.id === recipeId);
      if (index !== -1) recipes.value[index] = res.data;
    } catch (err) {
      console.error('Error updating recipe:', err);
    }
  };

  const selectRecipe = (recipe) => {
    selectedRecipe.value = recipe;
  };

  return { recipes, selectedRecipe, fetchRecipes, addRecipe, deleteRecipe, updateRecipe, selectRecipe };
});
