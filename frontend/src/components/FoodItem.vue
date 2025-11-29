<template>
  <div
    class="food-item flex justify-between items-center p-3 mb-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
    <span class="text-gray-700 font-medium">{{ food.name }} ({{ food.quantity }}g)</span>
    <span class="text-gray-500 font-semibold">{{ food.calories }} kcal</span>
  </div>
</template>
<script>
export default {
  name: 'FoodItem',
  props: { food: Object },
};
</script>
