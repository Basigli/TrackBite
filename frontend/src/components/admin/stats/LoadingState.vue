<template>
  <div v-if="loading" class="text-center py-12">
    <div class="inline-block animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-green-500"></div>
    <p class="mt-4 text-sm md:text-base text-gray-600">{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'LoadingState',
  props: {
    loading: {
      type: Boolean,
      required: true
    },
    message: {
      type: String,
      default: 'Loading...'
    }
  }
};
</script>