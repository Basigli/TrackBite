import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import axios from 'axios';

export const useIntakeStore = defineStore('intake', () => {
  const dailyIntake = reactive({ meals: [], totalCalories: 0, macros: { protein: 0, fat: 0, carbs: 0 } });
  const history = ref([]); // past daily intakes

  const fetchDailyIntake = async (userId) => {
    try {
      const res = await axios.get(`/daily-intakes/history/user/${userId}`);
      const today = res.data.find(d => new Date(d.date).toDateString() === new Date().toDateString());
      if (today) Object.assign(dailyIntake, today);
    } catch (err) {
      console.error('Error fetching daily intake:', err);
    }
  };

  const fetchDailyIntakeHistory = async (userId) => {
    try {
      const res = await axios.get(`/daily-intakes/history/user/${userId}`);
      history.value = res.data;
    } catch (err) {
      console.error('Error fetching daily intake history:', err);
    }
  };

  return { dailyIntake, history, fetchDailyIntake, fetchDailyIntakeHistory };
});
