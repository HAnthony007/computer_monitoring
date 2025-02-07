import { useAuthStore } from '@/stores/AuthStore';
import axios from 'axios';

export const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
})

axiosInstance.interceptors.request.use(
    (config) => {
        const { token } = useAuthStore.getState();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    response => response,

    error => {
        if (error.response && error.response.status === 401) {
            useAuthStore.getState().logout();

            window.location.href= '/';
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;