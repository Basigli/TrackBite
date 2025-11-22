<template>
  <div class="dashboard max-w-5xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

    <div class="flex flex-wrap gap-2 mb-6">
      <div class="flex-1 min-w-[220px]">
        <CaloriesSummary :totalCalories="dailyIntake.totalCalories" />
      </div>
      <div class="flex-1 min-w-[220px]">
        <MacroBreakdown :macros="dailyIntake.macros" />
      </div>
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
