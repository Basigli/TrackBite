import { defineStore } from 'pinia';
import { ref, reactive, type Ref } from 'vue';
import api from '../api';
import type { DailyIntake } from '../models/DailyIntake';
import type { FoodItem } from '@/models/FoodItem';
import type { Nutrient } from '@/models/Nutrient';

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

  const createDailyIntake = async (userId: string, date: string): Promise<DailyIntake | null> => {
    try {
      const res = await api.post<DailyIntake>('/daily-intakes', {
        userId,
        date,
        totalCalories: 0,
        totalMacros: [],
        foodItems: [],
      });
      Object.assign(dailyIntake, res.data);
      return res.data;
    } catch (err) {
      console.error('Error creating daily intake:', err);
      return null;
    }
  };

  const addToDailyIntake = async (userId: string, foodItem: FoodItem, date: string): Promise<boolean> => {
    try {
      // Check if daily intake exists for this date
      if (!dailyIntake._id || dailyIntake.userId !== userId || dailyIntake.date !== date) {
        await fetchDailyIntake(userId);
        
        // If still no daily intake, create one
        if (!dailyIntake._id) {
          const newIntake = await createDailyIntake(userId, date);
          if (!newIntake) {
            console.error('Failed to create daily intake');
            return false;
          }
        }
      } 

      // Add food item locally
      dailyIntake.foodItems.push(foodItem);
      dailyIntake.totalCalories += foodItem.calories;


      foodItem.macros.forEach( macro => {
          if (!dailyIntake.totalMacros.find(m => m.name.toLowerCase() === macro.name.toLowerCase())) {
            dailyIntake.totalMacros.push({
              name: macro.name.charAt(0).toUpperCase() + macro.name.slice(1),
              unit: 'g',
              totalAmount: macro.totalAmount,
              amount100g: macro.amount100g,
              amountPerServing: macro.amountPerServing} as Nutrient);
          } else {
              let macroToUpdate = dailyIntake.totalMacros.find(m => m.name.toLowerCase() === macro.name.toLowerCase())!;
              macroToUpdate.totalAmount += macro.totalAmount;
          }
      });
      console.log('Updated daily intake locally:', dailyIntake);

      // Send PUT request with updated daily intake
      const res = await api.put<DailyIntake>(`/daily-intakes/${dailyIntake._id}`, {
        ...dailyIntake,
        foodItems: dailyIntake.foodItems
      });

      // Update local state with server response
      Object.assign(dailyIntake, res.data);
      console.log('Updated daily intake from server:', dailyIntake);
      
      return true;
    } catch (err) {
      console.error('Error adding to daily intake:', err);
      // Revert local change on error
      dailyIntake.foodItems.pop();
      return false;
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
    createDailyIntake,
    fetchDailyIntake,
    addToDailyIntake,
    fetchDailyIntakeHistory,
    setSelectedDate,
  };
});