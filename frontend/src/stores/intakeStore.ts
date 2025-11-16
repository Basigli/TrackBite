import { defineStore } from 'pinia';
import { reactive } from 'vue';
import axios from 'axios';

export const useIntakeStore = defineStore('intake', () => {
  const dailyIntake = reactive({ meals: [], totalCalories: 0, macros: { protein: 0, fat: 0, carbs: 0 } });

  const fetchDailyIntake = async (userId) => {
    try {
      const res = await axios.get(`/daily-intakes/history/user/${userId}`);
      if (res.data && res.data.length > 0) {
        const today = res.data.find(d => new Date(d.date).toDateString() === new Date().toDateString());
        Object.assign(dailyIntake, today || { meals: [], totalCalories: 0, macros: { protein: 0, fat: 0, carbs: 0 } });
      }
    } catch (err) {
      console.error('Error fetching daily intake:', err);
    }
  };

  const addFoodItem = async (dailyIntakeId, foodItem) => {
    try {
      const res = await axios.post(`/daily-intakes/${dailyIntakeId}/food-items`, foodItem);
      dailyIntake.meals.push(res.data);
    } catch (err) {
      console.error('Error adding food item:', err);
    }
  };

  return { dailyIntake, fetchDailyIntake, addFoodItem };
});
