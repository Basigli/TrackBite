<template>
  <div v-if="selectedDiet" class="bg-white rounded-xl shadow-lg p-6">
    <div class="flex justify-between items-start mb-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">{{ selectedDiet.name }}</h2>
        <p class="text-gray-600 mt-1">
          <span class="font-semibold">{{ selectedDiet.caloriesAmount }}</span> kcal/day
        </p>
      </div>
    </div>

    <!-- Macros Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div 
        v-for="macro in selectedDiet.macros" 
        :key="`selected-${selectedDiet._id}-${macro.name}`"
        class="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 border border-green-200"
      >
        <div class="text-sm text-gray-600 mb-2">{{ capitalizeFirst(macro.name) }}</div>
        <div class="text-3xl font-bold text-gray-800 mb-1">{{ macro.totalAmount.toFixed(1) }}g</div>
        <div class="text-xs text-gray-500">
          {{ calculateMacroPercentage(macro, selectedDiet.caloriesAmount) }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  selectedDiet: {
    type: Object,
    default: null
  }
})

defineEmits(['delete-diet'])

const calculateMacroPercentage = (macro, totalCalories) => {
  const caloriesPerGram = macro.name === 'fat' ? 9 : 4
  const macroCalories = macro.totalAmount * caloriesPerGram
  return ((macroCalories / totalCalories) * 100).toFixed(1)
}

const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>