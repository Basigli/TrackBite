<template>
  <div class="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
    <div class="bg-white rounded-lg shadow p-3 md:p-4">
      <div class="text-gray-500 text-xs md:text-sm">Total</div>
      <div class="text-xl md:text-2xl font-bold text-gray-800">{{ totalUsers }}</div>
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
</template>

<script>
export default {
  name: 'UserStatsCards',
  props: {
    totalUsers: {
      type: Number,
      required: true
    },
    adminCount: {
      type: Number,
      required: true
    },
    regularCount: {
      type: Number,
      required: true
    }
  }
};
</script>