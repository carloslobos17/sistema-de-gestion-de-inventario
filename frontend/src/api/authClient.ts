// src/api/authClient.ts
// Cliente HTTP solo para /auth (login, refresh y logout). No tiene interceptores:
// así un 401 del login o del refresh nunca dispara otra renovación.
import axios from 'axios';
import { API_URL, REQUEST_TIMEOUT_MS } from './api.config';

export const authClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: REQUEST_TIMEOUT_MS,
    withCredentials: true, // envía y recibe la cookie httpOnly del refresh token
});
