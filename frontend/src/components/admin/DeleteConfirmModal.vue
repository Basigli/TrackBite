<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('cancel')"
  >
    <div class="bg-white rounded-lg p-5 md:p-6 max-w-md w-full">
      <h3 class="text-lg font-semibold text-gray-900 mb-3 md:mb-4">Confirm Delete</h3>
      <p class="text-sm md:text-base text-gray-600 mb-5 md:mb-6">
        Are you sure you want to delete user <strong>{{ user?.nickname }}</strong>? This action cannot be undone.
      </p>
      <div class="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
        <button
          @click="$emit('cancel')"
          class="w-full sm:w-auto px-4 py-2 text-sm md:text-base border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          @click="$emit('confirm')"
          :disabled="deleting"
          class="w-full sm:w-auto px-4 py-2 text-sm md:text-base bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
        >
          {{ deleting ? 'Deleting...' : 'Delete' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeleteConfirmModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    user: {
      type: Object,
      default: null
    },
    deleting: {
      type: Boolean,
      default: false
    }
  },
  emits: ['cancel', 'confirm']
};
</script>