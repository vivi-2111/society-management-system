import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', // adjust if backend runs on a different port
});

// Interceptor to attach the token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthenticated
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Assuming App handles redirect if not logged in
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
