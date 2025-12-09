import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import api from '../api';
import type { Recipe } from '../models/Recipe';
import { useUserStore } from './userStore';

export const useRecipeStore = defineStore('recipe', () => {
  // User's own recipes (created + saved)
  const recipes: Ref<Recipe[]> = ref([]);
  const selectedRecipe: Ref<Recipe | null> = ref(null);
  const userStore = useUserStore();
  
  // Community recipes from other users (for real-time feed)
  const communityRecipes: Ref<Recipe[]> = ref([]);

  // ============================================
  // USER'S OWN RECIPES (CREATED + SAVED)
  // ============================================

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
      console.log('Adding recipe for user:', recipe);
      const res = await api.post<Recipe>(`/recipes`, recipe);
      recipes.value.push(res.data);
    } catch (err) {
      console.error('Error adding recipe:', err);
    }
  };

  const deleteRecipe = async (recipeId: string, userId: string) => {
    try {
      console.log('Deleting recipe:', recipeId, 'for user:', userId);
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
      console.log('Updating recipe:', recipeId, 'for user:', userId, 'with data:', updatedData);
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

  // ============================================
  // COMMUNITY RECIPES (REAL-TIME FEED)
  // ============================================

  const addCommunityRecipe = (recipe: Recipe) => {
    const exists = communityRecipes.value.some(r => r._id === recipe._id);
    if (exists) return;
    
    communityRecipes.value.unshift(recipe);
    
    // Keep only the 50 most recent
    if (communityRecipes.value.length > 50) {
      communityRecipes.value = communityRecipes.value.slice(0, 50);
    }
  };

  const removeCommunityRecipe = (recipeId: string) => {
    communityRecipes.value = communityRecipes.value.filter(r => r._id !== recipeId);
  };

  const clearCommunityRecipes = () => {
    communityRecipes.value = [];
  };

  // Save a community recipe to user's saved list
  const saveCommunityRecipeToOwn = async (recipe: Recipe) => {
    try {
      // Check if already saved
      if (userStore.user.savedRecipesIds.includes(recipe._id)) {
        console.log('Recipe already saved');
        return;
      }

      // Add recipe ID to user's saved list
      userStore.user.savedRecipesIds.push(recipe._id);
      await userStore.updateUser({ savedRecipesIds: userStore.user.savedRecipesIds });
      
      // Refetch recipes to include the newly saved recipe
      await fetchRecipes(userStore.user._id);
    } catch (err) {
      console.error('Error saving community recipe:', err);
      throw err;
    }
  };

  return {
    // User's own recipes (created + saved)
    recipes,
    selectedRecipe,
    fetchRecipes,
    addRecipe,
    deleteRecipe,
    updateRecipe,
    selectRecipe,
    
    // Community recipes (real-time feed)
    communityRecipes,
    addCommunityRecipe,
    removeCommunityRecipe,
    clearCommunityRecipes,
    saveCommunityRecipeToOwn,
  };
});