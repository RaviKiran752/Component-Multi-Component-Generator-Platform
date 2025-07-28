import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
});

// Auth
export const signup = (email: string, password: string) =>
  api.post('/auth/signup', { email, password });
export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

// Sessions
export const getSessions = (token: string) =>
  api.get('/sessions', { headers: { Authorization: `Bearer ${token}` } });
export const createSession = (data: Record<string, unknown>, token: string) =>
  api.post('/sessions', data, { headers: { Authorization: `Bearer ${token}` } });
export const getSessionById = (id: string, token: string) =>
  api.get(`/sessions/${id}`, { headers: { Authorization: `Bearer ${token}` } });

// AI
export const aiGenerate = (prompt: string, token: string, image?: string) =>
  api.post('/ai/generate', { prompt, image }, { headers: { Authorization: `Bearer ${token}` } });

// Export
export const exportSession = (id: string, token: string) =>
  api.get(`/export/${id}`, { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' });

export default api; 