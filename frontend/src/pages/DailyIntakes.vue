<template>
  <div class="daily-intakes p-4">
    <h1 class="text-2xl font-bold mb-4">Daily Intakes History</h1>
    
    <div v-if="history.length === 0" class="text-gray-500">
      No daily intakes recorded yet.
    </div>

    <ul class="space-y-2">
      <li v-for="day in history" :key="day.id" class="border p-3 rounded hover:bg-gray-50 cursor-pointer"
          @click="selectDay(day)">
        <div class="flex justify-between">
          <span class="font-semibold">{{ formatDate(day.date) }}</span>
          <span class="text-green-600 font-bold">{{ day.totalCalories || 0 }} kcal</span>
        </div>
        <div class="text-sm text-gray-600 mt-1">
          {{ summarizeMeals(day.meals) }}
        </div>
      </li>
    </ul>

    <!-- show detailed view -->
    <DailyIntake v-if="selectedDay" :meals="selectedDay.meals" class="mt-6"/>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useIntakeStore } from '../store/intakeStore';
import DailyIntake from '../components/DailyIntake.vue';

export default {
  name: 'DailyIntakes',
  components: { DailyIntake },
  setup() {
    const intakeStore = useIntakeStore();
    const userId = 1; // replace with logged-in user ID
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
