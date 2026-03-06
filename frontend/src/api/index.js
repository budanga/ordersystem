import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    // Use an environment variable if available, otherwise default to '/api' for proxying
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
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
