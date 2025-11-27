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

  const fetchDailyIntake = async (userId: string) => {
    try {
      const res = await api.get<DailyIntake[]>(`/daily-intakes/history/user/${userId}`);

      // find today's intake
      const today = res.data.find(
        d =>
          new Date(d.date).toDateString() ===
          new Date().toDateString()
      );

      if (today) {
        Object.assign(dailyIntake, today);
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

  return {
    dailyIntake,
    history,
    fetchDailyIntake,
    fetchDailyIntakeHistory,
  };
});
