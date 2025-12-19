import { loginWithLastfm } from '../../server/services/authService.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { user, jwtToken, sessionKey } = await loginWithLastfm(req.body.token);
        res.json({
            user: {
                id: user.id,
                name: user.name,
                lastfmUsername: user.lastfmUsername,
                spotifyId: user.spotifyId,
                image: user.image,
            },
            token: jwtToken,
            lastfmSessionKey: sessionKey,
        });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || 'Error during authentication' });
    }
}
