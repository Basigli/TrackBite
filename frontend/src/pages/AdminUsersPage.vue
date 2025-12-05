<template>
  <div class="admin-users-page p-4 md:p-6 max-w-7xl mx-auto">
    <div class="mb-4 md:mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-1">User Management</h1>
      <p class="text-sm md:text-base text-gray-600">Manage all registered users</p>
    </div>

    <UserStatsCards
      :totalUsers="users.length"
      :adminCount="adminCount"
      :regularCount="regularCount"
    />

    <UserSearchFilter
      v-model:searchQuery="searchQuery"
      v-model:filterRole="filterRole"
    />

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-green-500"></div>
      <p class="mt-4 text-sm md:text-base text-gray-600">Loading users...</p>
    </div>

    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-3 py-2 md:px-4 md:py-3 rounded text-sm md:text-base mb-4 md:mb-6">
      {{ error }}
    </div>

    <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-3 py-2 md:px-4 md:py-3 rounded text-sm md:text-base mb-4 md:mb-6">
      {{ successMessage }}
    </div>

    <div v-if="!loading" class="block md:hidden space-y-3">
      <div v-if="filteredUsers.length === 0" class="bg-white rounded-lg shadow p-6 text-center">
        <p class="text-gray-500 text-sm">No users found</p>
      </div>
      
      <UserCardMobile
        v-for="user in filteredUsers"
        :key="user._id"
        :user="user"
        :isCurrentUser="user._id === currentUserId"
        @delete="confirmDelete"
      />
    </div>

    <div v-if="!loading" class="hidden md:block">
      <UserTableDesktop
        :users="filteredUsers"
        :currentUserId="currentUserId"
        @delete="confirmDelete"
      />
    </div>

    <DeleteConfirmModal
      :show="showDeleteModal"
      :user="userToDelete"
      :deleting="deleting"
      @cancel="cancelDelete"
      @confirm="deleteUser"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../store/userStore';
import api from '../api';
import UserStatsCards from '../components/admin/users/UserStatsCards.vue';
import UserSearchFilter from '../components/admin/users/UserSearchFilter.vue';
import UserCardMobile from '../components/admin/users/UserCardMobile.vue';
import UserTableDesktop from '../components/admin/users/UserTableDesktop.vue';
import DeleteConfirmModal from '../components/admin/users/DeleteConfirmModal.vue';
export default {
  name: 'AdminUsersPage',
  components: {
    UserStatsCards,
    UserSearchFilter,
    UserCardMobile,
    UserTableDesktop,
    DeleteConfirmModal
  },
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

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(user =>
          user.nickname?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user._id?.toLowerCase().includes(query)
        );
      }

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
        users.value = users.value.filter(u => u._id !== userToDelete.value._id);
        successMessage.value = `User ${userToDelete.value.nickname} deleted successfully`;
        
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
      deleteUser
    };
  }
};
</script>