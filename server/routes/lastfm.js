import express from 'express';
import { LASTFM_API_BASE, LASTFM_API_KEY } from '../config/env.js';
import signParams from '../utils/signParams.js';

const router = express.Router();

// Route: Get Session
router.post('/session', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        const params = {
            api_key: LASTFM_API_KEY,
            method: 'auth.getSession',
            token: token
        };

        const api_sig = signParams(params);
        
        const url = new URL(LASTFM_API_BASE);
        Object.entries({ ...params, api_sig, format: 'json' }).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        const response = await fetch(url.toString());
        const data = await response.json();

        if (data.error) {
            return res.status(400).json({ message: data.message });
        }

        res.json(data);
    } catch (error) {
        console.error('Last.fm Auth Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;
