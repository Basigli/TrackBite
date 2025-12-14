<template>
  <div class="bg-white rounded-lg shadow p-4 md:p-6 mb-4 md:mb-6">
    <h2 class="text-xl md:text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
      System Statistics
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <div class="bg-gray-50 rounded-lg p-3 md:p-4">
        <div class="flex items-center gap-2 mb-2">
          <svg class="w-4 h-4 md:w-5 md:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-xs md:text-sm text-gray-600 font-medium">Uptime</h3>
        </div>
        <p class="text-lg md:text-2xl font-bold text-gray-800">
          {{ formatUptime(stats?.uptime || 0) }}
        </p>
      </div>

      <div class="bg-gray-50 rounded-lg p-3 md:p-4">
        <h3 class="text-xs md:text-sm text-gray-600 font-medium mb-2">Memory (RSS)</h3>
        <p class="text-lg md:text-2xl font-bold text-gray-800">
          {{ formatBytes(stats?.memoryUsage?.rss || 0) }}
        </p>
      </div>

      <div class="bg-gray-50 rounded-lg p-3 md:p-4">
        <h3 class="text-xs md:text-sm text-gray-600 font-medium mb-2">Heap Used</h3>
        <p class="text-lg md:text-2xl font-bold text-gray-800">
          {{ formatBytes(stats?.memoryUsage?.heapUsed || 0) }}
        </p>
      </div>

      <div class="bg-gray-50 rounded-lg p-3 md:p-4">
        <h3 class="text-xs md:text-sm text-gray-600 font-medium mb-2">Platform</h3>
        <p class="text-base md:text-xl font-bold text-gray-800">
          {{ stats?.platform }} ({{ stats?.arch }})
        </p>
        <p class="text-xs text-gray-500 mt-1">{{ stats?.nodeVersion }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SystemStatsCard',
  props: {
    stats: {
      type: Object,
      default: null
    }
  },
  methods: {
    formatUptime(seconds) {
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${days}d ${hours}h ${minutes}m`;
    },
    formatBytes(bytes) {
      return (bytes / 1024 / 1024).toFixed(2) + ' MB';
    }
  }
};
</script>