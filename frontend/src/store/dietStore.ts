import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import api from '../api';

export const useDietStore = defineStore('diet', () => {
  const diets = ref([]);
  const selectedDiet = ref(null);

  const fetchDiets = async (userId) => {
    try {
      const res = await api.get(`/diets/user/${userId}`);
      diets.value = res.data;
      if (res.data.length > 0 && !selectedDiet.value) selectedDiet.value = res.data[0];
    } catch (err) {
      console.error('Error fetching diets:', err);
    }
  };

  const createDiet = async (diet) => {
    try {
      const res = await api.post('/diets', diet);
      diets.value.push(res.data);
    } catch (err) {
      console.error('Error creating diet:', err);
    }
  };

  const updateDiet = async (dietId, userId, data) => {
    try {
      const res = await api.put(`/diets/${dietId}/user/${userId}`, data);
      const index = diets.value.findIndex(d => d.id === dietId);
      if (index !== -1) diets.value[index] = res.data;
    } catch (err) {
      console.error('Error updating diet:', err);
    }
  };

  const deleteDiet = async (dietId, userId) => {
    try {
      await api.delete(`/diets/${dietId}/user/${userId}`);
      diets.value = diets.value.filter(d => d.id !== dietId);
      if (selectedDiet.value?.id === dietId) selectedDiet.value = diets.value[0] || null;
    } catch (err) {
      console.error('Error deleting diet:', err);
    }
  };

  const selectDiet = (diet) => {
    selectedDiet.value = diet;
  };

  return { diets, selectedDiet, fetchDiets, createDiet, updateDiet, deleteDiet, selectDiet };
});
