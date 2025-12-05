<template>
  <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-3 py-2 md:px-4 md:py-3 rounded text-sm md:text-base mb-4 md:mb-6">
    <h2 class="text-lg font-bold mb-2">{{ title }}</h2>
    <p class="mb-3">{{ error }}</p>
    <button 
      @click="$emit('retry')"
      class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm md:text-base transition"
    >
      Retry
    </button>
  </div>
</template>

<script>
export default {
  name: 'ErrorState',
  props: {
    error: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: 'Error'
    }
  },
  emits: ['retry']
};
</script>