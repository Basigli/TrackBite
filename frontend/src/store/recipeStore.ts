import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import api from '../api';
import type { Recipe } from '../models/Recipe';
import { useUserStore } from './userStore';

interface CommunityRecipe extends Recipe {
  authorName?: string;
  authorId?: string;
  receivedAt?: number;
}

export const useRecipeStore = defineStore('recipe', () => {
  // User's own recipes
  const recipes: Ref<Recipe[]> = ref([]);
  const selectedRecipe: Ref<Recipe | null> = ref(null);
  const userStore = useUserStore();
  
  // Community recipes from other users
  const communityRecipes: Ref<CommunityRecipe[]> = ref([]);

  // ============================================
  // USER'S OWN RECIPES
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
  // COMMUNITY RECIPES
  // ============================================

  const addCommunityRecipe = (recipe: CommunityRecipe) => {
    recipe.receivedAt = Date.now();

    const exists = communityRecipes.value.some(r => r._id === recipe._id);
    if (exists) return;
    
    communityRecipes.value.unshift(recipe);
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

  
  const isRecipeNew = (recipe: CommunityRecipe): boolean => {
    if (!recipe.receivedAt) return false;
    return Date.now() - recipe.receivedAt < 30000; // 30 seconds
  };

  // Save a community recipe to user's own recipes
  const saveCommunityRecipeToOwn = async (recipe: CommunityRecipe) => {
    try {
      userStore.user.savedRecipesIds.push(recipe._id);
      await userStore.updateUser({ savedRecipesIds: userStore.user.savedRecipesIds });
      const { authorName, authorId, receivedAt, ...recipeData } = recipe;
      recipes.value.push(recipeData as Recipe);
    } catch (err) {
      console.error('Error saving community recipe:', err);
      throw err;
    }
  };

  return {
    // User's own recipes
    recipes,
    selectedRecipe,
    fetchRecipes,
    addRecipe,
    deleteRecipe,
    updateRecipe,
    selectRecipe,
    
    // Community recipes
    communityRecipes,
    addCommunityRecipe,
    removeCommunityRecipe,
    clearCommunityRecipes,
    isRecipeNew,
    saveCommunityRecipeToOwn,
  };
});