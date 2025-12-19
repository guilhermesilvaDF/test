import { describePlaylist } from '../../server/services/aiService.js';
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
        const description = await describePlaylist(req.body);
        res.json(description);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || 'Error generating description' });
    }
}
