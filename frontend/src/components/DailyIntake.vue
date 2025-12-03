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
            <h3 class="font-semibold text-gray-800 text-lg">{{ foodItem.name }}</h3>
            <div class="flex items-center gap-3 mt-1">
              <p class="text-sm text-gray-600">
                {{ foodItem.quantity }}
              </p>
              <span 
                v-if="foodItem.grade" 
                class="text-xs font-bold px-2 py-1 rounded"
                :class="getGradeClass(foodItem.grade)"
              >
                Grade {{ foodItem.grade }}
              </span>
            </div>
          </div>
          <div class="text-right">
            <p class="text-green-600 font-bold text-lg">
              {{ foodItem.calories }} kcal
            </p>
            <p class="text-xs text-gray-500">Score: {{ foodItem.score }}</p>
          </div>
        </div>
        
        <div v-if="foodItem.nutrients && Object.keys(foodItem.nutrients).length > 0" class="mt-3 pt-3 border-t border-gray-100">
          <div class="grid grid-cols-3 gap-2 text-sm">
            <div v-for="(value, name) in foodItem.nutrients" :key="name" class="text-gray-600">
              <span class="font-medium">{{ name }}:</span> {{ value }}
            </div>
          </div>
        </div>

        <div v-if="foodItem.macros && Object.keys(foodItem.macros).length > 0" class="mt-3 pt-3 border-t border-gray-100">
          <div class="grid grid-cols-3 gap-2 text-sm">
            <div v-for="(value, name) in foodItem.macros" :key="name" class="text-gray-600">
              <span class="font-medium">{{ name }}:</span> {{ value }}
            </div>
          </div>
        </div>

        <div v-if="foodItem.allergens && foodItem.allergens.length > 0" class="mt-3 pt-3 border-t border-gray-100">
          <p class="text-xs text-orange-600">
            <span class="font-semibold">Allergens:</span> {{ foodItem.allergens.join(', ') }}
          </p>
        </div>

        <div v-if="foodItem.ingredients && foodItem.ingredients.length > 0" class="mt-3 pt-3 border-t border-gray-100">
          <p class="text-xs text-gray-600">
            <span class="font-semibold">Ingredients:</span> {{ foodItem.ingredients.join(', ') }}
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
    const getGradeClass = (grade) => {
      if (!grade) return 'bg-gray-100 text-gray-800';
      
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

    return { getGradeClass };
  }
};
</script>