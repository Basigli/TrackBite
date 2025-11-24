import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import api from '../api';
import type { User } from '../models/User';

export const useUserStore = defineStore('user', () => {
  const user: Ref<User | null> = ref(null);

  const fetchUser = async (userId: string) => {
    try {
      const res = await api.get<User>(`/users/${userId}`);
      user.value = res.data;
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  const updateUser = async (updatedData: Partial<User>): Promise<boolean> => {
    if (!user.value?._id) return false;
    try {
      const res = await api.put<User>(`/users/${user.value._id}`, updatedData);
      user.value = res.data;
      return true;
    } catch (err) {
      console.error('Error updating user:', err);
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user.value?._id) return false;
    try {
      await api.put(`/users/${user.value._id}/password`, { currentPassword, newPassword });
      return true;
    } catch (err) {
      console.error('Error changing password:', err);
      return false;
    }
  };

  return {
    user,
    fetchUser,
    updateUser,
    changePassword
  };
});
