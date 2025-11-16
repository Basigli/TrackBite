<template>
  <div class="calories-summary p-4 bg-green-100 rounded">
    <h3 class="font-semibold">Total Calories</h3>
    <p class="text-2xl font-bold">{{ totalCalories }} kcal</p>
  </div>
</template>

<script>
export default {
  name: 'CaloriesSummary',
  props: { totalCalories: Number },
};
</script>
