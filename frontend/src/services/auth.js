/* global process */
const API_BASE = process.env.NODE_ENV === 'production' 
    ? 'https://your-app.railway.app/api' 
    : 'http://localhost:8080/api';

export const login = async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data;
};

export const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    return fetch(`${API_BASE}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
        },
        ...options
    });
};
