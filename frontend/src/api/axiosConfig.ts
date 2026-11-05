import axios from 'axios';

// Toma la IP o dominio actual del navegador y le apunta al puerto 3000
const API_URL = `http://${window.location.hostname}:3000/api`;

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const isLogin = error.config?.url?.includes("/auth/login");
        if (error.response?.status === 401 && !isLogin) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);