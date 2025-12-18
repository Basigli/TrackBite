<template>
  <div class="calories-summary p-6 bg-white rounded-xl shadow-lg flex flex-col items-center max-w-sm mx-auto">
    <h3 class="text-lg font-semibold text-gray-700 mb-4">Total Calories</h3>

    <CircularProgress :current="totalCalories" :goal="dailyGoal" :size="160" />

    <p class="text-3xl font-bold text-gray-800 mt-4">{{ totalCalories }} kcal</p>
    <p class="text-sm text-gray-500 mt-1">Daily goal: {{ dailyGoal }} kcal</p>
  </div>
</template>

<script>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDietStore } from '../../store/dietStore'
import CircularProgress from './CircularProgress.vue'

export default {
  name: 'CaloriesSummary',
  components: { CircularProgress },
  props: { 
    totalCalories: {
      type: Number,
      default: 0
    }
  },

  setup() {
    const dietStore = useDietStore()
    const { selectedDiet } = storeToRefs(dietStore)

    const dailyGoal = computed(() => {
      return selectedDiet.value?.caloriesAmount ?? 2000
    })

    return { dailyGoal }
  }
}
</script>