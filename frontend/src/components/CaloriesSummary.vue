<template>
  <div class="calories-summary p-4 bg-green-100 rounded flex flex-col items-center">
    <h3 class="font-semibold mb-2">Total Calories</h3>

    <!-- Circular progress -->
    <CircularProgress :current="totalCalories" :goal="dailyGoal" :size="140" />

    <p class="text-2xl font-bold mt-3">{{ totalCalories }} kcal</p>
  </div>
</template>

<script>
import CircularProgress from './CircularProgress.vue';

export default {
  name: 'CaloriesSummary',
  components: { CircularProgress },
  props: { totalCalories: Number },

  setup() {
    const dailyGoal = 2000; // Or inject from store later
    return { dailyGoal };
  }
};
</script>
