<template>
  <div class="admin-recipes-page min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm sticky top-0 z-10">
      <div class="px-4 py-4">
        <h1 class="text-xl font-bold text-gray-900">Recipe Management</h1>
        <p class="text-sm text-gray-600 mt-0.5">{{ recipes.length }} total recipes</p>
      </div>
    </div>

    <div class="p-4 pb-20">
      <!-- Stats Cards -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white shadow-lg">
          <div class="text-3xl font-bold">{{ recipes.length }}</div>
          <div class="text-sm opacity-90 mt-1">Total Recipes</div>
        </div>
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white shadow-lg">
          <div class="text-3xl font-bold">{{ uniqueUsersCount }}</div>
          <div class="text-sm opacity-90 mt-1">Users</div>
        </div>
        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg">
          <div class="text-3xl font-bold">{{ avgRecipesPerUser }}</div>
          <div class="text-sm opacity-90 mt-1">Avg/User</div>
        </div>
        <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 text-white shadow-lg">
          <div class="text-3xl font-bold">{{ recipesThisMonth }}</div>
          <div class="text-sm opacity-90 mt-1">This Month</div>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="relative mb-3">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search recipes..."
          class="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-green-500 text-base shadow-sm"
        />
        <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <!-- User Filter -->
      <div class="relative mb-3">
        <input
          v-model="userFilter"
          type="text"
          placeholder="Filter by user..."
          class="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-green-500 text-base shadow-sm"
        />
        <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>

      <!-- Sort Chips -->
      <div class="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4">
        <button
          @click="sortBy = 'newest'"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
            sortBy === 'newest' 
              ? 'bg-green-600 text-white shadow-lg' 
              : 'bg-white text-gray-700 border-2 border-gray-200'
          ]"
        >
           Newest
        </button>
        <button
          @click="sortBy = 'oldest'"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
            sortBy === 'oldest' 
              ? 'bg-green-600 text-white shadow-lg' 
              : 'bg-white text-gray-700 border-2 border-gray-200'
          ]"
        >
          Oldest
        </button>
        <button
          @click="sortBy = 'name'"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
            sortBy === 'name' 
              ? 'bg-green-600 text-white shadow-lg' 
              : 'bg-white text-gray-700 border-2 border-gray-200'
          ]"
        >
          A-Z
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-14 w-14 border-4 border-green-500 border-t-transparent"></div>
        <p class="mt-4 text-gray-600 font-medium">Loading recipes...</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3.5 rounded-2xl mb-4 shadow-sm">
        <div class="flex items-start">
          <svg class="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <span class="text-sm">{{ error }}</span>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3.5 rounded-2xl mb-4 shadow-sm">
        <div class="flex items-start">
          <svg class="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span class="text-sm">{{ successMessage }}</span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredRecipes.length === 0" class="text-center py-16">
        <div class="text-6xl mb-4">🍳</div>
        <p class="text-gray-500 font-medium">No recipes found</p>
        <p class="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
      </div>

      <!-- Recipe Cards -->
      <div v-if="!loading" class="space-y-3">
        <div
          v-for="recipe in filteredRecipes"
          :key="recipe._id"
          class="bg-white rounded-2xl shadow-md overflow-hidden active:scale-98 transition-transform"
        >
          <!-- Card Header -->
          <div class="p-4 pb-3">
            <div class="flex items-start justify-between mb-2">
              <h3 class="text-lg font-bold text-gray-900 flex-1 pr-2 leading-tight">
                {{ recipe.name }}
              </h3>
              <button
                @click="viewRecipeDetails(recipe)"
                class="flex-shrink-0 w-9 h-9 rounded-full bg-green-50 text-green-600 flex items-center justify-center active:bg-green-100"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>

            <!-- User Badge -->
            <div class="flex items-center gap-2 mb-3">
              <div class="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-full">
                <svg class="w-3.5 h-3.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
                <span class="text-xs font-medium text-blue-900">{{ getUserNickname(recipe.userId) }}</span>
              </div>
              <div class="flex items-center gap-1.5 bg-orange-50 px-2.5 py-1 rounded-full">
                <svg class="w-3.5 h-3.5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                  <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                  <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                </svg>
                <span class="text-xs font-medium text-orange-900">{{ recipe.ingredients?.length || 0 }}</span>
              </div>
              <div class="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-full">
                <svg class="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-xs font-medium text-gray-700">{{ formatDateShort(recipe.createdAt) }}</span>
              </div>
            </div>

            <!-- Instructions Preview -->
            <p class="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {{ recipe.instructions || 'No instructions provided' }}
            </p>
          </div>

          <!-- Action Button -->
          <div class="border-t-2 border-gray-100">
            <button
              @click="confirmDelete(recipe)"
              class="w-full py-3.5 text-sm font-semibold text-red-600 active:bg-red-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fade-in"
      @click.self="cancelDelete"
    >
      <div class="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md animate-slide-up sm:animate-none shadow-2xl">
        <div class="p-6">
          <div class="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2 text-center">Delete Recipe?</h3>
          <p class="text-gray-600 mb-6 text-center">
            Are you sure you want to delete <strong class="text-gray-900">{{ recipeToDelete?.name }}</strong>? This action cannot be undone.
          </p>
          <div class="flex flex-col gap-3">
            <button
              @click="deleteRecipe"
              :disabled="deleting"
              class="w-full py-3.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 active:scale-98 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
            >
              {{ deleting ? 'Deleting...' : 'Yes, Delete' }}
            </button>
            <button
              @click="cancelDelete"
              class="w-full py-3.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 active:scale-98 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Recipe Details Modal -->
    <div
      v-if="showDetailsModal && selectedRecipe"
      class="fixed inset-0 bg-black bg-opacity-60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fade-in overflow-y-auto"
      @click.self="closeDetailsModal"
    >
      <div class="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl animate-slide-up sm:animate-none shadow-2xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto">
        <!-- Header -->
        <div class="sticky top-0 bg-white border-b-2 border-gray-100 px-6 py-4 rounded-t-3xl sm:rounded-t-3xl z-10">
          <div class="flex items-start justify-between">
            <div class="flex-1 pr-4">
              <h3 class="text-2xl font-bold text-gray-900 leading-tight">{{ selectedRecipe.name }}</h3>
              <p class="text-sm text-gray-500 mt-1">{{ formatDate(selectedRecipe.createdAt) }}</p>
            </div>
            <button
              @click="closeDetailsModal"
              class="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 active:scale-95 transition-all"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-6 pb-8">
          <!-- User Info -->
          <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                {{ getUserNickname(selectedRecipe.userId).charAt(0).toUpperCase() }}
              </div>
              <div>
                <p class="text-xs text-blue-700 font-medium">Recipe Owner</p>
                <p class="text-sm font-semibold text-blue-900">{{ getUserNickname(selectedRecipe.userId) }}</p>
              </div>
            </div>
          </div>

          <!-- Ingredients -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <div class="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <svg class="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                  <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                  <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                </svg>
              </div>
              <h4 class="text-lg font-bold text-gray-900">Ingredients</h4>
              <span class="ml-auto bg-orange-100 text-orange-800 px-2.5 py-1 rounded-full text-xs font-bold">
                {{ selectedRecipe.ingredients?.length || 0 }}
              </span>
            </div>
            <div class="space-y-2">
              <div
                v-for="(ingredient, index) in selectedRecipe.ingredients"
                :key="index"
                class="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
              >
                <div class="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {{ index + 1 }}
                </div>
                <span class="text-sm text-gray-800">{{ ingredient.name }}</span>
              </div>
            </div>
          </div>

          <!-- Instructions -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <div class="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 class="text-lg font-bold text-gray-900">Instructions</h4>
            </div>
            <div class="bg-gray-50 rounded-2xl p-4">
              <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {{ selectedRecipe.instructions || 'No instructions provided' }}
              </p>
            </div>
          </div>

          <!-- Meta Info -->
          <div class="bg-gray-50 rounded-2xl p-4 space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-600">Recipe ID</span>
              <span class="font-mono text-gray-900">{{ selectedRecipe._id }}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-600">Created</span>
              <span class="text-gray-900 font-medium">{{ formatDate(selectedRecipe.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import api from '../api';

export default {
  name: 'AdminRecipesPage',
  setup() {
    const recipes = ref([]);
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

    const users = ref({});

    const fetchAllRecipes = async () => {
      loading.value = true;
      error.value = '';
      try {
        const response = await api.get('/recipes');
        recipes.value = response.data;
        
        // Fetch user details for all unique user IDs
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

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const formatDateShort = (dateString) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
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
      formatDate,
      formatDateShort,
      getUserNickname
    };
  }
};
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>