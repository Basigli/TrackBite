<template>
  <div class="meal border p-2 rounded mb-2">
    <h3 class="font-semibold">{{ meal.name }}</h3>
    <div class="foods ml-2">
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
