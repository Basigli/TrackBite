<template>
  <div
    class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
  >
    <div class="flex justify-between items-start">
      <div class="flex-1">
        <h3 class="font-semibold text-gray-800 text-lg">{{ food.name }}</h3>
        <div class="flex items-center gap-3 mt-1">
          <p class="text-sm text-gray-600">
            {{ food.quantity }}
          </p>
          <span 
            v-if="food.grade" 
            class="text-xs font-bold px-2 py-1 rounded"
            :class="getGradeClass(food.grade)"
          >
            Grade {{ food.grade }}
          </span>
        </div>
      </div>
      <div class="text-right">
        <p class="text-green-600 font-bold text-lg">
          {{ food.calories }} kcal
        </p>
        <p class="text-xs text-gray-500">Score: {{ food.score }}</p>
      </div>
    </div>
    
    <div v-if="food.nutrients && food.nutrients.length > 0" class="mt-3 pt-3 border-t border-gray-100">
      <div class="grid grid-cols-3 gap-2 text-sm">
        <div v-for="nutrient in food.nutrients" :key="nutrient.name" class="text-gray-600">
          <span class="font-medium">{{ nutrient.name }}:</span> {{ nutrient.totalAmount }} {{ nutrient.unit }}  
        </div>
      </div>
    </div>

    <div v-if="food.macros && food.macros.length > 0" class="mt-3 pt-3 border-t border-gray-100">
      <div class="grid grid-cols-3 gap-2 text-sm">
        <div v-for="macro in food.macros" :key="macro.name" class="text-gray-600">
          <span class="font-medium">{{ macro.name }}:</span> {{ macro.totalAmount }} {{ macro.unit }}  
        </div>
      </div>
    </div>

    <div v-if="food.allergens && food.allergens.length > 0" class="mt-3 pt-3 border-t border-gray-100">
      <p class="text-xs text-orange-600">
        <span class="font-semibold">Allergens:</span> {{ food.allergens.join(', ') }}
      </p>
    </div>

    <div v-if="food.ingredients && food.ingredients.length > 0" class="mt-3 pt-3 border-t border-gray-100">
      <p class="text-xs text-gray-600">
        <span class="font-semibold">Ingredients:</span> {{ food.ingredients.join(', ') }}
      </p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'FoodItem',
  props: { 
    food: {
      type: Object,
      required: true
    }
  },
  setup() {
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

    return { getGradeClass };
  }
};
</script>