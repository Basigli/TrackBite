<template>
  <div class="bg-white rounded-lg shadow p-4 md:p-6 mb-4 md:mb-6">
    <h2 class="text-xl md:text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
      Database Statistics
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
      <div class="bg-blue-50 rounded-lg p-4 md:p-6 border border-blue-200">
        <div class="flex items-center gap-3 mb-2">
          <svg class="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h3 class="text-base md:text-lg text-gray-700 font-medium">Users</h3>
        </div>
        <p class="text-3xl md:text-4xl font-bold text-gray-800">{{ dbStats?.users || 0 }}</p>
      </div>

      <div class="bg-green-50 rounded-lg p-4 md:p-6 border border-green-200">
        <div class="flex items-center gap-3 mb-2">
          <svg class="w-6 h-6 md:w-8 md:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 class="text-base md:text-lg text-gray-700 font-medium">Diets</h3>
        </div>
        <p class="text-3xl md:text-4xl font-bold text-gray-800">{{ dbStats?.diets || 0 }}</p>
      </div>

      <div class="bg-purple-50 rounded-lg p-4 md:p-6 border border-purple-200">
        <div class="flex items-center gap-3 mb-2">
          <svg class="w-6 h-6 md:w-8 md:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 class="text-base md:text-lg text-gray-700 font-medium">Recipes</h3>
        </div>
        <p class="text-3xl md:text-4xl font-bold text-gray-800">{{ dbStats?.recipes || 0 }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DatabaseStatsCard',
  props: {
    dbStats: {
      type: Object,
      default: null
    }
  }
};
</script>