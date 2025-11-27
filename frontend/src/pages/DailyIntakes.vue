<template>
  <div class="daily-intakes max-w-3xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Daily Intakes History</h1>
    
    <div v-if="history.length === 0" class="text-gray-500 text-center py-6">
      No daily intakes recorded yet.
    </div>

    <ul class="space-y-3">
      <li
        v-for="day in history"
        :key="day.id"
        @click="selectDay(day)"
        class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      >
        <div class="flex justify-between items-center">
          <span class="font-semibold text-gray-800">{{ formatDate(day.date) }}</span>
          <span class="text-green-600 font-bold">{{ day.totalCalories || 0 }} kcal</span>
        </div>
        <div class="text-sm text-gray-600 mt-1">
          {{ summarizeMeals(day.meals) }}
        </div>
      </li>
    </ul>

    <DailyIntake
      v-if="selectedDay"
      :meals="selectedDay.meals"
      class="mt-8"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useIntakeStore } from '../store/intakeStore';
import DailyIntake from '../components/DailyIntake.vue';
import { useUserStore } from '@/store/userStore';

export default {
  name: 'DailyIntakes',
  components: { DailyIntake },
  setup() {
    const intakeStore = useIntakeStore();
    const userStore = useUserStore();
    const userId = userStore.user?._id;
    const selectedDay = ref(null);

    const selectDay = (day) => {
      selectedDay.value = day;
    };

    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    };

    const summarizeMeals = (meals) => {
      if (!meals || meals.length === 0) return 'No meals logged';
      return meals.map(m => `${m.name}: ${m.foods.reduce((sum,f)=>sum+f.calories,0)} kcal`).join(' | ');
    };

    onMounted(() => {
      intakeStore.fetchDailyIntakeHistory(userId);
    });

    return { history: intakeStore.history, selectedDay, selectDay, formatDate, summarizeMeals };
  }
};
</script>

<style scoped>
li:hover {
  background-color: #f9fafb;
}
</style>
