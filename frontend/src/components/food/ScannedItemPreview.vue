<template>
  <div v-if="preview" class="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 border-2 border-green-300">
    <h4 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
      <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      You're Adding
    </h4>
    <div class="space-y-3">
      <!-- Grams and Calories on same line -->
      <div class="bg-white rounded-lg p-4 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-xs text-gray-500 block mb-1">Quantity</span>
            <span class="font-bold text-gray-800 text-lg">{{ preview.quantity }}</span>
          </div>
          <div class="text-right">
            <span class="text-xs text-gray-500 block mb-1">Calories</span>
            <div>
              <span class="font-bold text-green-600 text-2xl">{{ preview.calories.toFixed(0) }}</span>
              <span class="text-sm text-gray-600 ml-1">kcal</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Percentage -->
      <div class="bg-white rounded-lg p-3 shadow-sm">
        <span class="text-xs text-gray-500 block mb-1">Percentage of package</span>
        <span class="font-bold text-blue-600 text-lg">{{ percentage.toFixed(1) }}%</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScannedItemPreview',
  props: {
    preview: {
      type: Object,
      default: null
    },
    percentage: {
      type: Number,
      required: true
    }
  }
}
</script>
