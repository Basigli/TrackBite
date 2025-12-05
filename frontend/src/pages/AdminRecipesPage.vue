<template>
  <div class="admin-recipes-page min-h-screen bg-gray-50">
    <RecipesPageHeader :totalRecipes="recipes.length" />

    <div class="p-4 pb-20">
      <RecipesStatsCards
        :totalRecipes="recipes.length"
        :uniqueUsers="uniqueUsersCount"
        :avgPerUser="avgRecipesPerUser"
        :thisMonth="recipesThisMonth"
      />

      <RecipesFilters
        v-model:search="searchQuery"
        v-model:userFilter="userFilter"
        v-model:sortBy="sortBy"
      />

      <RecipesLoadingState v-if="loading" />

      <RecipesAlerts
        :error="error"
        :success="successMessage"
      />

      <RecipesEmptyState v-if="!loading && filteredRecipes.length === 0" />

      <RecipesList
        v-if="!loading"
        :recipes="filteredRecipes"
        :users="users"
        @view-details="viewRecipeDetails"
        @confirm-delete="confirmDelete"
      />
    </div>

    <RecipeDeleteModal
      v-if="showDeleteModal"
      :recipe="recipeToDelete"
      :deleting="deleting"
      @confirm="deleteRecipe"
      @cancel="cancelDelete"
    />

    <RecipeDetailsModal
      v-if="showDetailsModal && selectedRecipe"
      :recipe="selectedRecipe"
      :users="users"
      @close="closeDetailsModal"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import api from '../api';
import RecipesPageHeader from '../components/admin/RecipesPageHeader.vue';
import RecipesStatsCards from '../components/admin/RecipesStatsCards.vue';
import RecipesFilters from '../components/admin/RecipesFilters.vue';
import RecipesLoadingState from '../components/admin/RecipesLoadingState.vue';
import RecipesAlerts from '../components/admin/RecipesAlerts.vue';
import RecipesEmptyState from '../components/admin/RecipesEmptyState.vue';
import RecipesList from '../components/admin/RecipesList.vue';
import RecipeDeleteModal from '../components/admin/RecipeDeleteModal.vue';
import RecipeDetailsModal from '../components/admin/RecipeDetailsModal.vue';

export default {
  name: 'AdminRecipesPage',
  components: {
    RecipesPageHeader,
    RecipesStatsCards,
    RecipesFilters,
    RecipesLoadingState,
    RecipesAlerts,
    RecipesEmptyState,
    RecipesList,
    RecipeDeleteModal,
    RecipeDetailsModal
  },
  setup() {
    const recipes = ref([]);
    const users = ref({});
    const loading = ref(false);
    const deleting = ref(false);
    const error = ref('');
    const successMessage = ref('');
    const searchQuery = ref('');
    const userFilter = ref('');
    const sortBy = ref('newest');
    const showDeleteModal = ref(false);
    const showDetailsModal = ref(false);
    const recipeToDelete = ref(null);
    const selectedRecipe = ref(null);

    const uniqueUsersCount = computed(() => {
      const uniqueUsers = new Set(recipes.value.map(r => r.userId));
      return uniqueUsers.size;
    });

    const avgRecipesPerUser = computed(() => {
      if (uniqueUsersCount.value === 0) return '0';
      return (recipes.value.length / uniqueUsersCount.value).toFixed(1);
    });

    const recipesThisMonth = computed(() => {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return recipes.value.filter(r => new Date(r.createdAt) >= firstDayOfMonth).length;
    });

    const filteredRecipes = computed(() => {
      let filtered = recipes.value;

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(recipe =>
          recipe.name?.toLowerCase().includes(query) ||
          recipe.instructions?.toLowerCase().includes(query) ||
          recipe.ingredients?.some(ing => typeof ing === 'string' && ing.toLowerCase().includes(query))
        );
      }

      if (userFilter.value) {
        const userQuery = userFilter.value.toLowerCase();
        filtered = filtered.filter(recipe =>
          recipe.userId?.toLowerCase().includes(userQuery) ||
          getUserNickname(recipe.userId).toLowerCase().includes(userQuery)
        );
      }

      if (sortBy.value === 'newest') {
        filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sortBy.value === 'oldest') {
        filtered = [...filtered].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else if (sortBy.value === 'name') {
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      }

      return filtered;
    });

    const fetchAllRecipes = async () => {
      loading.value = true;
      error.value = '';
      try {
        const response = await api.get('/recipes');
        recipes.value = response.data;
        
        const uniqueUserIds = [...new Set(recipes.value.map(r => r.userId))];
        for (const userId of uniqueUserIds) {
          if (userId && !users.value[userId]) {
            try {
              const userResponse = await api.get(`/users/${userId}`);
              users.value[userId] = userResponse.data;
            } catch (err) {
              console.error(`Error fetching user ${userId}:`, err);
              users.value[userId] = { nickname: 'Unknown User' };
            }
          }
        }
      } catch (err) {
        console.error('Error fetching recipes:', err);
        error.value = 'Failed to load recipes. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    const getUserNickname = (userId) => {
      return users.value[userId]?.nickname || 'Unknown User';
    };

    const confirmDelete = (recipe) => {
      recipeToDelete.value = recipe;
      showDeleteModal.value = true;
    };

    const cancelDelete = () => {
      recipeToDelete.value = null;
      showDeleteModal.value = false;
    };

    const deleteRecipe = async () => {
      if (!recipeToDelete.value) return;

      deleting.value = true;
      error.value = '';
      successMessage.value = '';

      try {
        await api.delete(`/recipes/${recipeToDelete.value._id}/user/${recipeToDelete.value.userId}`);
        
        recipes.value = recipes.value.filter(r => r._id !== recipeToDelete.value._id);
        
        successMessage.value = `Recipe "${recipeToDelete.value.name}" deleted successfully`;
        
        setTimeout(() => {
          successMessage.value = '';
        }, 3000);

        cancelDelete();
      } catch (err) {
        console.error('Error deleting recipe:', err);
        error.value = err.response?.data?.message || 'Failed to delete recipe. Please try again.';
      } finally {
        deleting.value = false;
      }
    };

    const viewRecipeDetails = (recipe) => {
      selectedRecipe.value = recipe;
      showDetailsModal.value = true;
    };

    const closeDetailsModal = () => {
      selectedRecipe.value = null;
      showDetailsModal.value = false;
    };

    onMounted(() => {
      fetchAllRecipes();
    });

    return {
      recipes,
      users,
      loading,
      deleting,
      error,
      successMessage,
      searchQuery,
      userFilter,
      sortBy,
      showDeleteModal,
      showDetailsModal,
      recipeToDelete,
      selectedRecipe,
      uniqueUsersCount,
      avgRecipesPerUser,
      recipesThisMonth,
      filteredRecipes,
      confirmDelete,
      cancelDelete,
      deleteRecipe,
      viewRecipeDetails,
      closeDetailsModal,
      getUserNickname
    };
  }
};
</script>