<template>
  <div class="admin-users-page p-4 md:p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-4 md:mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-1">User Management</h1>
      <p class="text-sm md:text-base text-gray-600">Manage all registered users</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
      <div class="bg-white rounded-lg shadow p-3 md:p-4">
        <div class="text-gray-500 text-xs md:text-sm">Total</div>
        <div class="text-xl md:text-2xl font-bold text-gray-800">{{ users.length }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-3 md:p-4">
        <div class="text-gray-500 text-xs md:text-sm">Admins</div>
        <div class="text-xl md:text-2xl font-bold text-green-600">{{ adminCount }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-3 md:p-4">
        <div class="text-gray-500 text-xs md:text-sm">Users</div>
        <div class="text-xl md:text-2xl font-bold text-blue-600">{{ regularCount }}</div>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="bg-white rounded-lg shadow p-3 md:p-4 mb-4 md:mb-6">
      <div class="flex flex-col gap-3">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search users..."
          class="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <select
          v-model="filterRole"
          class="w-full md:w-auto px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All Users</option>
          <option value="admin">Admin Only</option>
          <option value="regular">Regular Only</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-green-500"></div>
      <p class="mt-4 text-sm md:text-base text-gray-600">Loading users...</p>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-3 py-2 md:px-4 md:py-3 rounded text-sm md:text-base mb-4 md:mb-6">
      {{ error }}
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-3 py-2 md:px-4 md:py-3 rounded text-sm md:text-base mb-4 md:mb-6">
      {{ successMessage }}
    </div>

    <!-- Mobile View - Cards -->
    <div v-if="!loading" class="block md:hidden space-y-3">
      <div v-if="filteredUsers.length === 0" class="bg-white rounded-lg shadow p-6 text-center">
        <p class="text-gray-500 text-sm">No users found</p>
      </div>
      
      <div
        v-for="user in filteredUsers"
        :key="user._id"
        class="bg-white rounded-lg shadow p-4"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3 flex-1">
            <div class="flex-shrink-0 h-12 w-12 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold text-lg">
              {{ user.nickname?.charAt(0).toUpperCase() || 'U' }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-semibold text-gray-900 truncate">{{ user.nickname }}</div>
              <div class="text-xs text-gray-500 truncate">{{ user.email || 'No email' }}</div>
            </div>
          </div>
          <span
            class="px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap"
            :class="user.isAdmin ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'"
          >
            {{ user.isAdmin ? 'Admin' : 'User' }}
          </span>
        </div>
        
        <div class="flex items-center justify-between pt-3 border-t border-gray-100">
          <div class="text-xs text-gray-500">
            Joined {{ formatDate(user.createdAt) }}
          </div>
          <button
            @click="confirmDelete(user)"
            :disabled="user._id === currentUserId"
            class="px-3 py-1.5 text-xs font-medium rounded-md disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed bg-red-50 text-red-600 hover:bg-red-100"
            :title="user._id === currentUserId ? 'Cannot delete yourself' : 'Delete user'"
          >
            {{ user._id === currentUserId ? 'You' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Desktop View - Table -->
    <div v-if="!loading" class="hidden md:block bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in filteredUsers" :key="user._id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
                      {{ user.nickname?.charAt(0).toUpperCase() || 'U' }}
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.nickname }}</div>
                    <div class="text-sm text-gray-500">ID: {{ user._id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ user.email || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="user.isAdmin ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'"
                >
                  {{ user.isAdmin ? 'Admin' : 'User' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="confirmDelete(user)"
                  :disabled="user._id === currentUserId"
                  class="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                  :title="user._id === currentUserId ? 'Cannot delete yourself' : 'Delete user'"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredUsers.length === 0" class="text-center py-12">
        <p class="text-gray-500">No users found</p>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="cancelDelete"
    >
      <div class="bg-white rounded-lg p-5 md:p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold text-gray-900 mb-3 md:mb-4">Confirm Delete</h3>
        <p class="text-sm md:text-base text-gray-600 mb-5 md:mb-6">
          Are you sure you want to delete user <strong>{{ userToDelete?.nickname }}</strong>? This action cannot be undone.
        </p>
        <div class="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            @click="cancelDelete"
            class="w-full sm:w-auto px-4 py-2 text-sm md:text-base border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="deleteUser"
            :disabled="deleting"
            class="w-full sm:w-auto px-4 py-2 text-sm md:text-base bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
          >
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../store/userStore';
import api from '../api';

export default {
  name: 'AdminUsersPage',
  setup() {
    const userStore = useUserStore();
    const users = ref([]);
    const loading = ref(false);
    const deleting = ref(false);
    const error = ref('');
    const successMessage = ref('');
    const searchQuery = ref('');
    const filterRole = ref('all');
    const showDeleteModal = ref(false);
    const userToDelete = ref(null);

    const currentUserId = computed(() => userStore.user?._id);

    const adminCount = computed(() => users.value.filter(u => u.isAdmin).length);
    const regularCount = computed(() => users.value.filter(u => !u.isAdmin).length);

    const filteredUsers = computed(() => {
      let filtered = users.value;

      // Filter by search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(user =>
          user.nickname?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user._id?.toLowerCase().includes(query)
        );
      }

      // Filter by role
      if (filterRole.value === 'admin') {
        filtered = filtered.filter(user => user.isAdmin);
      } else if (filterRole.value === 'regular') {
        filtered = filtered.filter(user => !user.isAdmin);
      }

      return filtered;
    });

    const fetchUsers = async () => {
      loading.value = true;
      error.value = '';
      try {
        const response = await api.get('/users');
        users.value = response.data;
      } catch (err) {
        console.error('Error fetching users:', err);
        error.value = 'Failed to load users. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    const confirmDelete = (user) => {
      userToDelete.value = user;
      showDeleteModal.value = true;
    };

    const cancelDelete = () => {
      userToDelete.value = null;
      showDeleteModal.value = false;
    };

    const deleteUser = async () => {
      if (!userToDelete.value) return;

      deleting.value = true;
      error.value = '';
      successMessage.value = '';

      try {
        await api.delete(`/users/${userToDelete.value._id}`);
        
        // Remove user from local list
        users.value = users.value.filter(u => u._id !== userToDelete.value._id);
        
        successMessage.value = `User ${userToDelete.value.nickname} deleted successfully`;
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          successMessage.value = '';
        }, 3000);

        cancelDelete();
      } catch (err) {
        console.error('Error deleting user:', err);
        error.value = err.response?.data?.message || 'Failed to delete user. Please try again.';
      } finally {
        deleting.value = false;
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    onMounted(() => {
      fetchUsers();
    });

    return {
      users,
      loading,
      deleting,
      error,
      successMessage,
      searchQuery,
      filterRole,
      showDeleteModal,
      userToDelete,
      currentUserId,
      adminCount,
      regularCount,
      filteredUsers,
      confirmDelete,
      cancelDelete,
      deleteUser,
      formatDate
    };
  }
};
</script>

<style scoped>
/* Custom scrollbar for table */
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