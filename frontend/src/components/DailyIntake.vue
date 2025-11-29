<template>
  <div class="daily-intake mt-6 max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Today's Food</h2>
    
    <div v-if="!meals || meals.length === 0" class="text-gray-500 text-center py-6">
      No food items logged yet.
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="(foodItem, index) in meals"
        :key="foodItem._id || index"
        class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="font-semibold text-gray-800 text-lg">{{ foodItem.scannedItem.name }}</h3>
            <div class="flex items-center gap-3 mt-1">
              <p class="text-sm text-gray-600">
                {{ foodItem.percentage }}% portion
              </p>
              <span 
                v-if="foodItem.scannedItem.grade" 
                class="text-xs font-bold px-2 py-1 rounded"
                :class="getGradeClass(foodItem.scannedItem.grade)"
              >
                Grade {{ foodItem.scannedItem.grade }}
              </span>
            </div>
          </div>
          <div class="text-right">
            <p class="text-green-600 font-bold text-lg">
              {{ calculateCalories(foodItem) }} kcal
            </p>
            <p class="text-xs text-gray-500">Score: {{ foodItem.scannedItem.score }}</p>
          </div>
        </div>
        
        <div v-if="foodItem.scannedItem.nutrients && foodItem.scannedItem.nutrients.length > 0" class="mt-3 pt-3 border-t border-gray-100">
          <div class="grid grid-cols-3 gap-2 text-sm">
            <div v-for="nutrient in foodItem.scannedItem.nutrients" :key="nutrient.name" class="text-gray-600">
              <span class="font-medium">{{ nutrient.name }}:</span> 
              {{ calculateNutrientAmount(nutrient, foodItem.percentage) }}{{ nutrient.unit }}
            </div>
          </div>
        </div>

        <div v-if="foodItem.scannedItem.allergens && foodItem.scannedItem.allergens.length > 0" class="mt-3 pt-3 border-t border-gray-100">
          <p class="text-xs text-orange-600">
            <span class="font-semibold">Allergens:</span> {{ foodItem.scannedItem.allergens.join(', ') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { watch } from 'vue';

export default {
  name: 'DailyIntake',
  props: { 
    meals: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const calculateCalories = (foodItem) => {
      const energyNutrient = foodItem.scannedItem.nutrients.find(
        n => n.name.toLowerCase() === 'energy' || n.name.toLowerCase() === 'calories'
      );
      if (energyNutrient) {
        return Math.round((energyNutrient.amount * foodItem.percentage) / 100);
      }
      return 0;
    };

    const calculateNutrientAmount = (nutrient, percentage) => {
      return ((nutrient.amount * percentage) / 100).toFixed(1);
    };

    const getGradeClass = (grade) => {
      const gradeMap = {
        'A': 'bg-green-100 text-green-800',
        'B': 'bg-lime-100 text-lime-800',
        'C': 'bg-yellow-100 text-yellow-800',
        'D': 'bg-orange-100 text-orange-800',
        'E': 'bg-red-100 text-red-800'
      };
      return gradeMap[grade.toUpperCase()] || 'bg-gray-100 text-gray-800';
    };

    // Watch meals to reactively handle changes if needed
    watch(() => props.meals, (newMeals) => {
      console.log('Food items updated:', newMeals);
    });

    return { calculateCalories, calculateNutrientAmount, getGradeClass };
  }
};
</script>