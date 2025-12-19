import { getUserPlaylists, createPlaylist } from '../../server/services/playlistService.js';
import { verifyToken } from '../../server/middleware/verifyToken.js';

export default async function handler(req, res) {
    const user = verifyToken(req);
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        if (req.method === 'GET') {
            const playlists = await getUserPlaylists(user.id);
            return res.json(playlists);
        }

        if (req.method === 'POST') {
            const playlist = await createPlaylist(user.id, req.body);
            return res.json(playlist);
        }

        return res.status(405).json({ message: 'Method not allowed' });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || 'Error processing playlist request' });
    }
}
