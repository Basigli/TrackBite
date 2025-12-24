import { defineStore } from 'pinia';
import { ref, type Ref, reactive, type Reactive, watch } from 'vue';
import api from '../api';
import { jwtDecode } from 'jwt-decode';
import type { User } from '../models/User';
import { notifyWarning } from '../utils/Notifications';
import { useSocket } from '../useSocket';

export const useUserStore = defineStore('user', () => {
  const user: Reactive<User | null> = reactive({} as User);
  const authToken = reactive({ value: '' });
  const { emit } = useSocket();

  // Initialize token from localStorage on store creation
  const initializeAuth = () => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken) {
      authToken.value = storedToken;
    }
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        Object.assign(user, parsedUser);
      } catch (e) {
        console.error('Error parsing stored user:', e);
        localStorage.removeItem('user');
      }
    }
  };

  // Watch for token changes and persist to localStorage
  watch(
    () => authToken.value,
    (newToken) => {
      if (newToken) {
        localStorage.setItem('authToken', newToken);
      } else {
        localStorage.removeItem('authToken');
      }
    }
  );

  // Watch for user changes and persist to localStorage
  watch(
    () => ({ ...user }),
    (newUser) => {
      if (newUser && newUser._id) {
        localStorage.setItem('user', JSON.stringify(newUser));
      } else {
        localStorage.removeItem('user');
      }
    },
    { deep: true }
  );

  const login = async (nickname: string, password: string) => {
    try {
      const res = await api.post('/users/login', { nickname, passwordHash: password });
      if (!res.data.token) {
        throw new Error('No token received');
      }
      const token = res.data.token;
      Object.assign(authToken, { value: token });
      
      // Fetch and store user data
      if (res.data.user) {
        Object.assign(user, res.data.user);
      }
      
      emit('register', res.data.user._id);
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    }
  };

  const fetchUser = async (userId: string) => {
    try {
      const res = await api.get<User>(`/users/${userId}`);
      Object.assign(user, res.data);
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  const updateUser = async (updatedData: Partial<User>): Promise<boolean> => {
    if (!user?._id) return false;
    try {
      const fullUserData = { ...user, ...updatedData };
      const res = await api.put<User>(`/users/${user._id}`, fullUserData);
      Object.assign(user, res.data);
      return true;
    } catch (err) {
      console.error('Error updating user:', err);
      return false;
    }
  };

  const addSavedScannedItem = async (itemId: string): Promise<boolean> => {
    if (!user?._id) return false;
    try {
      await api.post(`/users/${user._id}/saved-scanned-items/${itemId}`);
      if (!user.savedScannedItemsIds) {
        user.savedScannedItemsIds = [];
      }
      user.savedScannedItemsIds.push(itemId);
      return true;
    } catch (err) {
      console.error('Error adding saved scanned item:', err);
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user?._id) return false;
    try {
      await api.put(`/users/${user._id}/password`, { currentPassword, newPassword });
      return true;
    } catch (err) {
      console.error('Error changing password:', err);
      return false;
    }
  };

  const deleteAccount = async (): Promise<boolean> => {
    if (!user?._id) return false;
    try {
      await api.delete(`/users/${user._id}`);
      logout();
      return true;
    } catch (err) {
      console.error('Error deleting account:', err);
      return false;
    }
  };

  const decodeToken = () => {
    if (!authToken.value) return null;
    try {
      return jwtDecode(authToken.value);
    } catch (e) {
      return null;
    }
  };

  const isTokenExpired = () => {
    const decoded = decodeToken();
    if (!decoded || !decoded.exp) return true;
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      notifyWarning('Session has expired. Please log in again.');
      return true;
    }
    return false;
  };

  const logout = () => {
    Object.assign(user, {} as User);
    Object.assign(authToken, { value: '' });
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  // Initialize on store creation
  initializeAuth();

  return { 
    user, 
    authToken, 
    isTokenExpired, 
    login, 
    fetchUser, 
    updateUser, 
    changePassword, 
    deleteAccount,
    decodeToken, 
    logout, 
    addSavedScannedItem 
  };
});