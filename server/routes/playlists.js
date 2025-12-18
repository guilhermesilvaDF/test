import express from 'express';
import authenticateToken from '../middleware/authenticateToken.js';
import { createPlaylist, deletePlaylist, getUserPlaylists, updatePlaylist } from '../services/playlistService.js';

const router = express.Router();

router.get('/playlists', authenticateToken, async (req, res) => {
    try {
        const playlists = await getUserPlaylists(req.user.id);
        res.json(playlists);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || 'Error fetching playlists' });
    }
});

router.post('/playlists', authenticateToken, async (req, res) => {
    try {
        const playlist = await createPlaylist(req.user.id, req.body);
        res.json(playlist);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || 'Error creating playlist' });
    }
});

router.put('/playlists/:id', authenticateToken, async (req, res) => {
    try {
        const playlist = await updatePlaylist(req.user.id, req.params.id, req.body);
        res.json(playlist);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || 'Error updating playlist' });
    }
});

router.delete('/playlists/:id', authenticateToken, async (req, res) => {
    try {
        const result = await deletePlaylist(req.user.id, req.params.id);
        res.json(result);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || 'Error deleting playlist' });
    }
});

export default router;