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
import { onMounted } from 'vue'
import { useIntakeStore } from '../store/intakeStore'
import DailyIntake from '../components/DailyIntake.vue'
import CaloriesSummary from '../components/CaloriesSummary.vue'
import MacroBreakdown from '../components/MacroBreakdown.vue'
import { useUserStore } from '@/store/userStore'

export default {
  name: 'Dashboard',
  components: { DailyIntake, CaloriesSummary, MacroBreakdown },
  setup() {
    const intakeStore = useIntakeStore()
    const userStore = useUserStore()
    const userId = userStore.user?._id

    onMounted(() => {
    //  userStore.fetchUser(userId)
      intakeStore.fetchDailyIntake(userId)
    })

    return { dailyIntake: intakeStore.dailyIntake }
  },
}
</script>
