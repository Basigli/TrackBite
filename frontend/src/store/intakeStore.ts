import { defineStore } from 'pinia';
import { ref, reactive, type Ref } from 'vue';
import api from '../api';
import type { DailyIntake } from '../models/DailyIntake';

const emptyDailyIntake: DailyIntake = {
  _id: '',
  totalCalories: 0,
  totalMacros: [],
  foodItems: [],
  date: new Date().toISOString(),
  userId: '',
};

export const useIntakeStore = defineStore('intake', () => {
  const dailyIntake = reactive<DailyIntake>({ ...emptyDailyIntake });
  const history: Ref<DailyIntake[]> = ref([]);
  const selectedDate = ref(new Date().toISOString().substr(0, 10)); // Add this

  const fetchDailyIntake = async (userId: string) => {
    try {
      const res = await api.get<DailyIntake[]>(`/daily-intakes/history/user/${userId}`);

      // Find intake for the selected date
      const targetDate = res.data.find(
        d =>
          new Date(d.date).toDateString() ===
          new Date(selectedDate.value).toDateString() // Use selectedDate instead of today
      );

      if (targetDate) {
        Object.assign(dailyIntake, targetDate);
      } else {
        Object.assign(dailyIntake, emptyDailyIntake);
      }

    } catch (err) {
      console.error('Error fetching daily intake:', err);
    }
  };

  const fetchDailyIntakeHistory = async (userId: string) => {
    try {
      const res = await api.get<DailyIntake[]>(`/daily-intakes/history/user/${userId}`);
      history.value = res.data;
    } catch (err) {
      console.error('Error fetching daily intake history:', err);
    }
  };

  const setSelectedDate = (date: string) => {
    selectedDate.value = date;
  };

  return {
    dailyIntake,
    history,
    selectedDate,
    fetchDailyIntake,
    fetchDailyIntakeHistory,
    setSelectedDate,
  };
});