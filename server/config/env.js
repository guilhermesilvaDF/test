import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3001;
export const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-123';
export const LASTFM_API_KEY = process.env.VITE_LASTFM_API_KEY;
export const LASTFM_SHARED_SECRET = process.env.VITE_LASTFM_SHARED_SECRET || '';
export const LASTFM_API_BASE = 'https://ws.audioscrobbler.com/2.0/';
export const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;