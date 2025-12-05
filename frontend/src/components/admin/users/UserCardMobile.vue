<template>
  <div class="bg-white rounded-lg shadow p-4">
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
        @click="$emit('delete', user)"
        :disabled="isCurrentUser"
        class="px-3 py-1.5 text-xs font-medium rounded-md disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed bg-red-50 text-red-600 hover:bg-red-100"
        :title="isCurrentUser ? 'Cannot delete yourself' : 'Delete user'"
      >
        {{ isCurrentUser ? 'You' : 'Delete' }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserCardMobile',
  props: {
    user: {
      type: Object,
      required: true
    },
    isCurrentUser: {
      type: Boolean,
      required: true
    }
  },
  emits: ['delete'],
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }
};
</script>