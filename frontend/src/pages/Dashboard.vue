<template>
  <div class="dashboard p-4">
    <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <CaloriesSummary :totalCalories="dailyIntake.totalCalories" />
      <MacroBreakdown :macros="dailyIntake.macros" />
    </div>

    <DailyIntake :meals="dailyIntake.meals" />
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useIntakeStore } from '../store/intakeStore'
import DailyIntake from '../components/DailyIntake.vue'
import CaloriesSummary from '../components/CaloriesSummary.vue'
import MacroBreakdown from '../components/MacroBreakdown.vue'

export default {
  name: 'Dashboard',
  components: { DailyIntake, CaloriesSummary, MacroBreakdown },
  setup() {
    const intakeStore = useIntakeStore()
    const userId = 1 // replace with injected or store user ID

    onMounted(() => {
      intakeStore.fetchDailyIntake(userId)
    })

    return { dailyIntake: intakeStore.dailyIntake }
  },
}
</script>
