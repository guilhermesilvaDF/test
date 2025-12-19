import signParams from '../../server/utils/signParams.js';

const LASTFM_API_KEY = process.env.VITE_LASTFM_API_KEY;
const LASTFM_API_BASE = 'https://ws.audioscrobbler.com/2.0/';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

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
}
