import axios from 'axios';

// Make sure it ends in /api
let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (baseURL && !baseURL.endsWith('/api')) {
    baseURL = baseURL.replace(/\/$/, '') + '/api';
}

const api = axios.create({
    baseURL,
    headers: {
        'ngrok-skip-browser-warning': 'true' // bypasses the ngrok free tier HTML warning
    }
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
