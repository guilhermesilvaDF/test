import { getCurrentUser } from '../../server/services/authService.js';
import { verifyToken } from '../../server/middleware/verifyToken.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const user = verifyToken(req);
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const userData = await getCurrentUser(user.id);
        res.json({ id: userData.id, name: userData.name, email: userData.email });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || 'Error fetching user' });
    }
}
