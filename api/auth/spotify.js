import { linkSpotify } from '../../server/services/authService.js';
import { verifyToken } from '../../server/middleware/verifyToken.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const user = verifyToken(req);
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const updatedUser = await linkSpotify(user.id, req.body.accessToken);
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
}
