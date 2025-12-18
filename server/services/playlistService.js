import prisma from '../config/prisma.js';

const buildError = (message, status = 400) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

export const getUserPlaylists = async (userId) => {
    const playlists = await prisma.playlist.findMany({ where: { userId } });
    return playlists.map((p) => ({ ...p, tracks: JSON.parse(p.tracks || '[]') }));
};

export const createPlaylist = async (userId, payload) => {
    const { name, description, tracks, isPublic } = payload;

    const playlist = await prisma.playlist.create({
        data: {
            name,
            description,
            tracks: JSON.stringify(tracks || []),
            isPublic: !!isPublic,
            userId,
        },
    });

    return { ...playlist, tracks: tracks || [] };
};

export const updatePlaylist = async (userId, id, updates) => {
    const data = { ...updates };
    if (data.tracks) data.tracks = JSON.stringify(data.tracks);

    const playlist = await prisma.playlist.update({
        where: { id: parseInt(id, 10), userId },
        data,
    });

    return { ...playlist, tracks: JSON.parse(playlist.tracks) };
};

export const deletePlaylist = async (userId, id) => {
    await prisma.playlist.delete({ where: { id: parseInt(id, 10), userId } });
    return { success: true };
};