<template>
  <div class="dashboard max-w-5xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

    <div class="flex flex-wrap gap-2 mb-6">
      <div class="flex-1 min-w-[220px]">
        <CaloriesSummary :totalCalories="dailyIntake.totalCalories" />
      </div>
      <div class="flex-1 min-w-[220px]">
        <MacroBreakdown :macros="dailyIntake.totalMacros" />
      </div>
    </div>

    <DailyIntake :meals="dailyIntake.foodItems" />
  </div>
</template>

<script>
import { onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useIntakeStore } from '../store/intakeStore'
import { useDietStore } from '../store/dietStore'
import DailyIntake from '../components/food/DailyIntake.vue'
import CaloriesSummary from '../components/food/CaloriesSummary.vue'
import MacroBreakdown from '../components/food/MacroBreakdown.vue'
import { useUserStore } from '@/store/userStore'

export default {
  name: 'Dashboard',
  components: { DailyIntake, CaloriesSummary, MacroBreakdown },
  setup() {
    const intakeStore = useIntakeStore()
    const dietStore = useDietStore()
    const userStore = useUserStore()
    const userId = userStore.user?._id

    // Get reactive references from the store
    const { dailyIntake, selectedDate } = storeToRefs(intakeStore)

    // Watch for date changes and refetch intake
    watch(selectedDate, () => {
      if (userId) {
        intakeStore.fetchDailyIntake(userId)
      }
    })

    // Initial fetch on mount
    onMounted(() => {
      if (userId) {
        intakeStore.fetchDailyIntake(userId)
        dietStore.fetchDiets(userId) // Fetch diets to get calorie goal
      }
    })

    return { dailyIntake }
  },
}
</script>