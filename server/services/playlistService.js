import prisma from '../config/prisma.js';

const buildError = (message, status = 400) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

export const getUserPlaylists = async (userId) => {
    const playlists = await prisma.playlist.findMany({ where: { userId } });
    return playlists;
};

export const createPlaylist = async (userId, payload) => {
    const { name, description, tracks, isPublic } = payload;

    const playlist = await prisma.playlist.create({
        data: {
            name,
            description,
            tracks: tracks || [],
            isPublic: !!isPublic,
            userId,
        },
    });

    return playlist;
};

export const updatePlaylist = async (userId, id, updates) => {
    const playlist = await prisma.playlist.update({
        where: { id: parseInt(id, 10), userId },
        data: updates,
    });

    return playlist;
};

export const deletePlaylist = async (userId, id) => {
    await prisma.playlist.delete({ where: { id: parseInt(id, 10), userId } });
    return { success: true };
};