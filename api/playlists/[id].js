import { updatePlaylist, deletePlaylist } from '../../server/services/playlistService.js';
import { verifyToken } from '../../server/middleware/verifyToken.js';

export default async function handler(req, res) {
    const user = verifyToken(req);
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.query;

    try {
        if (req.method === 'PUT') {
            const playlist = await updatePlaylist(user.id, id, req.body);
            return res.json(playlist);
        }

        if (req.method === 'DELETE') {
            const result = await deletePlaylist(user.id, id);
            return res.json(result);
        }

        return res.status(405).json({ message: 'Method not allowed' });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || 'Error processing playlist request' });
    }
}
