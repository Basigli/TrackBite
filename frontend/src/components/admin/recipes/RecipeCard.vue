<template>
  <div class="bg-white rounded-2xl shadow-md overflow-hidden active:scale-98 transition-transform">
    <div class="p-4 pb-3">
      <div class="flex items-start justify-between mb-2">
        <h3 class="text-lg font-bold text-gray-900 flex-1 pr-2 leading-tight">
          {{ recipe.name }}
        </h3>
        <button
          @click="$emit('view-details')"
          class="flex-shrink-0 w-9 h-9 rounded-full bg-green-50 text-green-600 flex items-center justify-center active:bg-green-100"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </div>

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

      <p class="text-sm text-gray-600 line-clamp-2 leading-relaxed">
        {{ recipe.instructions || 'No instructions provided' }}
      </p>
    </div>

    <div class="border-t-2 border-gray-100">
      <button
        @click="$emit('confirm-delete')"
        class="w-full py-3.5 text-sm font-semibold text-red-600 active:bg-red-50 transition-colors flex items-center justify-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecipeCard',
  props: {
    recipe: { type: Object, required: true },
    users: { type: Object, required: true }
  },
  emits: ['view-details', 'confirm-delete'],
  methods: {
    getUserNickname(userId) {
      return this.users[userId]?.nickname || 'Unknown User';
    },
    formatDateShort(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  }
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>