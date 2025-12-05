import axios from 'axios';
import { useUserStore } from './store/userStore';
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000'
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