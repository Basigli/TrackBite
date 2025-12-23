import axios from 'axios';
import { useUserStore } from './store/userStore';
const baseURL = import.meta.env.DEV 
  ? 'https://localhost:3000'  // HTTPS in dev
  : import.meta.env.VITE_API_URL || 'https://your-domain.com';

const api = axios.create({
    baseURL
});

api.interceptors.request.use(
    (config) => {
        if (config.url && config.url.endsWith('/login')) {
            return config;
        }

        const userStore = useUserStore();
        userStore.isTokenExpired();
        config.headers.Authorization = `Bearer ${userStore.authToken.value}`;
        return config;
    }
)

export default api;