<template>
  <div>
    <div v-if="error" class="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3.5 rounded-2xl mb-4 shadow-sm">
      <div class="flex items-start">
        <svg class="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <span class="text-sm">{{ error }}</span>
      </div>
    </div>

    <div v-if="success" class="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3.5 rounded-2xl mb-4 shadow-sm">
      <div class="flex items-start">
        <svg class="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span class="text-sm">{{ success }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecipesAlerts',
  props: {
    error: { type: String, default: '' },
    success: { type: String, default: '' }
  }
};
</script>