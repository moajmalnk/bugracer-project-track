import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:80/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
}); 