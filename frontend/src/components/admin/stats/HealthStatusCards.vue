<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
    <div class="bg-white rounded-lg shadow p-4 md:p-6">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2">
          <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span class="text-base md:text-lg">Liveness</span>
        </h2>
        <span :class="[
          'px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold',
          liveness?.status === 'ok' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        ]">
          {{ liveness?.status?.toUpperCase() || 'N/A' }}
        </span>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-4 md:p-6">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2">
          <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
          <span class="text-base md:text-lg">Readiness</span>
        </h2>
        <span :class="[
          'px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold',
          readiness?.status === 'ok' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        ]">
          {{ readiness?.status?.toUpperCase() || 'N/A' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HealthStatusCards',
  props: {
    liveness: {
      type: Object,
      default: null
    },
    readiness: {
      type: Object,
      default: null
    }
  }
};
</script>