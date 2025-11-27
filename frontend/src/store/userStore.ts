import { defineStore } from 'pinia';
import { ref, type Ref, reactive } from 'vue';
import api from '../api';
import { jwtDecode } from 'jwt-decode';
import type { User } from '../models/User';

export const useUserStore = defineStore('user', () => {
  const user: Ref<User | null> = ref(null);
  const authToken = reactive({ value: '' });

  const login = async (nickname: string, password: string) => {
    try {
      const res = await api.post('/users/login', { nickname, passwordHash: password });
      if (!res.data.token) {
        throw new Error('No token received');
      }
      const token = res.data.token;
      Object.assign(authToken, { value: token }); 
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    }
  };

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

  const decodeToken = () => {
    if (!authToken.value) return null;
    try {
      return jwtDecode(authToken.value);
    } catch (e) {
      // console.error('Invalid token decode:', e);
      return null;
    }
  };

  const isTokenExpired = () => {
    const decoded = decodeToken();
    if (!decoded || !decoded.exp) return;
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime)
      alert('Session has expired. Please log in again.');
  };

  return { user, authToken, isTokenExpired, login, fetchUser, updateUser, changePassword };
});
