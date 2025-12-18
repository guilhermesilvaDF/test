import express from 'express';
import authenticateToken from '../middleware/authenticateToken.js';
import { getCurrentUser, linkSpotify, loginWithLastfm } from '../services/authService.js';

const router = express.Router();

router.post('/auth/lastfm-login', async (req, res) => {
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
});

router.post('/auth/spotify', authenticateToken, async (req, res) => {
    try {
        const updatedUser = await linkSpotify(req.user.id, req.body.accessToken);
        res.json({
            success: true,
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                image: updatedUser.image,
                lastfmUsername: updatedUser.lastfmUsername,
                spotifyId: updatedUser.spotifyId,
            },
        });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || 'Error linking Spotify account' });
    }
});

router.get('/auth/me', authenticateToken, async (req, res) => {
    try {
        const user = await getCurrentUser(req.user.id);
        res.json({ id: user.id, name: user.name, email: user.email });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || 'Error fetching user' });
    }
});

export default router;