import express from 'express';
import healthRoutes from './health.js';
import authRoutes from './auth.js';
import playlistRoutes from './playlists.js';
import aiRoutes from './ai.js';
import lastfmRoutes from './lastfm.js';

const router = express.Router();

router.use(healthRoutes);
router.use(authRoutes);
router.use(playlistRoutes);
router.use(aiRoutes);
router.use('/lastfm', lastfmRoutes);

export default router;