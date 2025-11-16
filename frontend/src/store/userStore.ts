import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import axios from 'axios';

export const useUserStore = defineStore('user', () => {
  const user = reactive({
    id: null,
    name: '',
    email: '',
    preferences: {}
  });

  const fetchUser = async (userId) => {
    try {
      const res = await axios.get(`/users/${userId}`);
      Object.assign(user, res.data);
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  const updateUser = async (updatedData) => {
    try {
      const res = await axios.put(`/users/${user.id}`, updatedData);
      Object.assign(user, res.data);
      return true;
    } catch (err) {
      console.error('Error updating user:', err);
      return false;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await axios.put(`/users/${user.id}/password`, { currentPassword, newPassword });
      return true;
    } catch (err) {
      console.error('Error changing password:', err);
      return false;
    }
  };

  return { user, fetchUser, updateUser, changePassword };
});
