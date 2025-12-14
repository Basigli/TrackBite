<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fade-in"
    @click.self="$emit('cancel')"
  >
    <div class="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md animate-slide-up sm:animate-none shadow-2xl">
      <div class="p-6">
        <div class="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2 text-center">Delete Recipe?</h3>
        <p class="text-gray-600 mb-6 text-center">
          Are you sure you want to delete <strong class="text-gray-900">{{ recipe?.name }}</strong>? This action cannot be undone.
        </p>
        <div class="flex flex-col gap-3">
          <button
            @click="$emit('confirm')"
            :disabled="deleting"
            class="w-full py-3.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 active:scale-98 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
          >
            {{ deleting ? 'Deleting...' : 'Yes, Delete' }}
          </button>
          <button
            @click="$emit('cancel')"
            class="w-full py-3.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 active:scale-98 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecipeDeleteModal',
  props: {
    recipe: { type: Object, default: null },
    deleting: { type: Boolean, required: true }
  },
  emits: ['confirm', 'cancel']
};
</script>
