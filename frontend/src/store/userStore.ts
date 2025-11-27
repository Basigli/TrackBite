import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import axios from 'axios';
import api from '../api';
import { jwtDecode } from 'jwt-decode';

export const useUserStore = defineStore('user', () => {
  const user = reactive({
    id: null,
    name: '',
    email: '',
    preferences: {}
  });

  const authToken = reactive({ value: '' });
  

  const login = async (nickname, password) => {
    try {
      const res = await api.post('/users/login', { nickname, passwordHash: password });
      if (!res.data.token) {
        throw new Error('No token received');
      }
      try {
        const decoded = jwtDecode(res.data.token);
        Object.assign(authToken, { value: decoded.nickname });
      } catch (e) {
          console.error('Invalid token:', e)
        }
      
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    }
  };

  const fetchUser = async (userId) => {
    try {
      const res = await api.get(`/users/${userId}`);
      Object.assign(user, res.data);
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  const updateUser = async (updatedData) => {
    try {
      const res = await api.put(`/users/${user.id}`, updatedData);
      Object.assign(user, res.data);
      return true;
    } catch (err) {
      console.error('Error updating user:', err);
      return false;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api.put(`/users/${user.id}/password`, { currentPassword, newPassword });
      return true;
    } catch (err) {
      console.error('Error changing password:', err);
      return false;
    }
  };

  return { user, authToken, login, fetchUser, updateUser, changePassword };
});
