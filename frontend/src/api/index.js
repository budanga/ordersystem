import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: '/api', // Proxied to http://localhost:8080 by Vite during development
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT Auth token if available
api.interceptors.request.use(
    (config) => {
        // In the future: const token = localStorage.getItem('token');
        // if (token) { config.headers.Authorization = `Bearer ${token}` }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
api.interceptors.response.use(
    (response) => response.data, // Simply return the data payload
    (error) => {
        if (error.response?.status === 401) {
            // Future: handled token expiration or unauthorized access
            console.warn("Unauthorized access - might need to login.");
        }
        return Promise.reject(error);
    }
);

export default api;
