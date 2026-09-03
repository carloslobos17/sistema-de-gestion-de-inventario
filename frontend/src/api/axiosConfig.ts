import axios from 'axios';

export const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Aquí irán los interceptores más adelante (para inyectar el token de autenticación)
apiClient.interceptors.request.use(
    (config) => {
        // const token = localStorage.getItem('token');
        // if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);