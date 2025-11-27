import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import api from '../api';
import type { Recipe } from '../models/Recipe';

export const useRecipeStore = defineStore('recipe', () => {
  const recipes: Ref<Recipe[]> = ref([]);
  const selectedRecipe: Ref<Recipe | null> = ref(null);

  const fetchRecipes = async (userId: string) => {
    try {
      const res = await api.get<Recipe[]>(`/recipes/user/${userId}`);
      recipes.value = res.data;
    } catch (err) {
      console.error('Error fetching recipes:', err);
    }
  };

  const addRecipe = async (recipe: Omit<Recipe, "_id">) => {
    try {
      const res = await api.post<Recipe>(`/recipes`, recipe);
      recipes.value.push(res.data);
    } catch (err) {
      console.error('Error adding recipe:', err);
    }
  };

  const deleteRecipe = async (recipeId: string, userId: string) => {
    try {
      await api.delete(`/recipes/${recipeId}/user/${userId}`);
      recipes.value = recipes.value.filter(r => r._id !== recipeId);
    } catch (err) {
      console.error('Error deleting recipe:', err);
    }
  };

  const updateRecipe = async (
    recipeId: string,
    userId: string,
    updatedData: Partial<Recipe>
  ) => {
    try {
      const res = await api.put<Recipe>(`/recipes/${recipeId}/user/${userId}`, updatedData);
      const index = recipes.value.findIndex(r => r._id === recipeId);

      if (index !== -1) {
        recipes.value[index] = res.data;
      }

    } catch (err) {
      console.error('Error updating recipe:', err);
    }
  };

  const selectRecipe = (recipe: Recipe | null) => {
    selectedRecipe.value = recipe;
  };

  return {
    recipes,
    selectedRecipe,
    fetchRecipes,
    addRecipe,
    deleteRecipe,
    updateRecipe,
    selectRecipe,
  };
});
