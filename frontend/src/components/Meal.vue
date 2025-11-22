<template>
  <div class="meal bg-white rounded-xl shadow-md p-4 mb-4">
    <h3 class="font-bold text-gray-800 text-lg mb-3">{{ meal.name }}</h3>
    <div class="foods space-y-2">
      <FoodItem v-for="food in meal.foods" :key="food.id" :food="food"/>
    </div>
  </div>
</template>

<script>
import FoodItem from './FoodItem.vue';
export default {
  name: 'Meal',
  components: { FoodItem },
  props: { meal: Object },
};
</script>
