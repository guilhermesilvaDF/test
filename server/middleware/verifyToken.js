import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-123';

export const verifyToken = (req) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return null;

    try {
        const user = jwt.verify(token, JWT_SECRET);
        return user;
    } catch (err) {
        return null;
    }
};
