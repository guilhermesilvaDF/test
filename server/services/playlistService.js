import prisma from '../config/prisma.js';
import { normalizePlaylists, normalizePlaylist, prepareTracks } from '../utils/playlistUtils.js';

const buildError = (message, status = 400) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

export const getUserPlaylists = async (userId) => {
    const playlists = await prisma.playlist.findMany({ where: { userId } });
    // Normalize tracks for both SQLite (String) and PostgreSQL (Json)
    return normalizePlaylists(playlists);
};

export const createPlaylist = async (userId, payload) => {
    const { name, description, tracks, isPublic } = payload;

    const playlist = await prisma.playlist.create({
        data: {
            name,
            description,
            tracks: prepareTracks(tracks || []),
            isPublic: !!isPublic,
            userId,
        },
    });

    // Normalize for response (works with both SQLite and PostgreSQL)
    return normalizePlaylist(playlist);
};

export const updatePlaylist = async (userId, id, updates) => {
    const playlist = await prisma.playlist.update({
        where: { id: parseInt(id, 10), userId },
        data: {
            ...updates,
            ...(updates.tracks && { tracks: prepareTracks(updates.tracks) })
        },
    });

    // Normalize for response (works with both SQLite and PostgreSQL)
    return normalizePlaylist(playlist);
};

export const deletePlaylist = async (userId, id) => {
    await prisma.playlist.delete({ where: { id: parseInt(id, 10), userId } });
    return { success: true };
};