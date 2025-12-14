<template>
  <div v-if="metrics" class="bg-white rounded-lg shadow p-4 md:p-6">
    <h2 class="text-xl md:text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
      HTTP Metrics
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
      <div class="bg-gray-50 rounded-lg p-3 md:p-4">
        <h3 class="text-xs md:text-sm text-gray-600 font-medium mb-2">Total Requests</h3>
        <p class="text-2xl md:text-3xl font-bold text-gray-800">
          {{ metrics.httpRequestsTotal }}
        </p>
      </div>

      <div class="bg-gray-50 rounded-lg p-3 md:p-4">
        <h3 class="text-xs md:text-sm text-gray-600 font-medium mb-3">Requests by Status</h3>
        <div class="space-y-2">
          <div 
            v-for="(count, status) in metrics.requestsByStatus" 
            :key="status"
            class="flex justify-between items-center"
          >
            <span :class="[
              'px-2 py-1 rounded text-xs md:text-sm font-semibold',
              status.startsWith('2') ? 'bg-green-100 text-green-800' :
              status.startsWith('4') ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            ]">
              {{ status }}
            </span>
            <span class="text-gray-800 font-semibold text-sm md:text-base">{{ count }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HttpMetricsCard',
  props: {
    metrics: {
      type: Object,
      default: null
    }
  }
};
</script>