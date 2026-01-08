<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fade-in overflow-y-auto"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl animate-slide-up sm:animate-none shadow-2xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto">
      <div class="sticky top-0 bg-white border-b-2 border-gray-100 px-6 py-4 rounded-t-3xl sm:rounded-t-3xl z-10">
        <div class="flex items-start justify-between">
          <div class="flex-1 pr-4">
            <h3 class="text-2xl font-bold text-gray-900 leading-tight">{{ recipe.name }}</h3>
            <p class="text-sm text-gray-500 mt-1">{{ formatDate(recipe.createdAt) }}</p>
          </div>
          <button
            @click="$emit('close')"
            class="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 active:scale-95 transition-all"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div class="p-6 space-y-6 pb-8">
        <!-- User Info -->
        <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
              {{ getUserNickname(recipe.userId).charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="text-xs text-blue-700 font-medium">Recipe Owner</p>
              <p class="text-sm font-semibold text-blue-900">{{ getUserNickname(recipe.userId) }}</p>
            </div>
          </div>
        </div>

        <!-- Ingredients -->
        <div>
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <svg class="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
              </svg>
            </div>
            <h4 class="text-lg font-bold text-gray-900">Ingredients</h4>
            <span class="ml-auto bg-orange-100 text-orange-800 px-2.5 py-1 rounded-full text-xs font-bold">
              {{ recipe.ingredients?.length || 0 }}
            </span>
          </div>
          <div class="space-y-2">
            <div
              v-for="(ingredient, index) in recipe.ingredients"
              :key="index"
              class="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
            >
              <div class="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {{ index + 1 }}
              </div>
              <span class="text-sm text-gray-800">{{ ingredient.name || ingredient }}</span>
            </div>
          </div>
        </div>

        <!-- Instructions -->
        <div>
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 class="text-lg font-bold text-gray-900">Instructions</h4>
          </div>
          <div class="bg-gray-50 rounded-2xl p-4">
            <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {{ recipe.description || 'No instructions provided' }}
            </p>
          </div>
        </div>

        <!-- Meta Info -->
        <div class="bg-gray-50 rounded-2xl p-4 space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="text-gray-600">Recipe ID</span>
            <span class="font-mono text-gray-900">{{ recipe._id }}</span>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-gray-600">Created</span>
            <span class="text-gray-900 font-medium">{{ formatDate(recipe.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecipeDetailsModal',
  props: {
    recipe: { type: Object, required: true },
    users: { type: Object, required: true }
  },
  emits: ['close'],
  methods: {
    getUserNickname(userId) {
      return this.users[userId]?.nickname || 'Unknown User';
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
};
</script>