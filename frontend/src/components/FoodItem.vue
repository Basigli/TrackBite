<template>
  <div class="food-item flex justify-between p-1">
    <span>{{ food.name }} ({{ food.quantity }}g)</span>
    <span>{{ food.calories }} kcal</span>
  </div>
</template>

<script>
export default {
  name: 'FoodItem',
  props: { food: Object },
};
</script>
