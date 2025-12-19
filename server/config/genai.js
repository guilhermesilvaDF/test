import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

export default genAI;