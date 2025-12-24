<template>
  <div class="daily-intake mt-6 max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Today's Food</h2>
    
    <div v-if="!meals || meals.length === 0" class="text-gray-500 text-center py-6">
      No food items logged yet.
    </div>

    <div v-else class="space-y-3">
      <FoodItem
        v-for="(foodItem, index) in meals"
        :key="foodItem._id || index"
        :food="foodItem"
      />
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import FoodItem from './FoodItem.vue'

const props = defineProps({ 
  meals: {
    type: Array,
    default: () => []
  }
})

watch(() => props.meals, (newMeals) => {
  console.log('Food items updated:', newMeals)
})
</script>