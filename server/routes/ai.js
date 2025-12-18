import express from 'express';
import authenticateToken from '../middleware/authenticateToken.js';
import { analyzeTaste, describePlaylist, generateRecommendations } from '../services/aiService.js';

const router = express.Router();

router.post('/recommendations/generate', authenticateToken, async (req, res) => {
    try {
        const recommendations = await generateRecommendations(req.body);
        res.json(recommendations);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || 'Error generating recommendations' });
    }
});

router.post('/ai/analyze', authenticateToken, async (req, res) => {
    try {
        const analysis = await analyzeTaste(req.body);
        res.json(analysis);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || 'Error analyzing musical taste' });
    }
});

router.post('/ai/describe-playlist', authenticateToken, async (req, res) => {
    try {
        const description = await describePlaylist(req.body);
        res.json(description);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || 'Error generating description' });
    }
});

export default router;