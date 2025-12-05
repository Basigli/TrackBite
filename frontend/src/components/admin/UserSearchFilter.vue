<template>
  <div class="bg-white rounded-lg shadow p-3 md:p-4 mb-4 md:mb-6">
    <div class="flex flex-col gap-3">
      <input
        :value="searchQuery"
        @input="$emit('update:searchQuery', $event.target.value)"
        type="text"
        placeholder="Search users..."
        class="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <select
        :value="filterRole"
        @change="$emit('update:filterRole', $event.target.value)"
        class="w-full md:w-auto px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="all">All Users</option>
        <option value="admin">Admin Only</option>
        <option value="regular">Regular Only</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserSearchFilter',
  props: {
    searchQuery: {
      type: String,
      required: true
    },
    filterRole: {
      type: String,
      required: true
    }
  },
  emits: ['update:searchQuery', 'update:filterRole']
};
</script>