import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import spotifyService from '../services/spotify';

const usePlaylistStore = create(
    persist(
        (set, get) => ({
            playlists: [],

            // Add playlist
            addPlaylist: (playlist) => {
                set(state => ({
                    playlists: [...state.playlists, { ...playlist, id: Date.now() }]
                }));
            },

            // Remove playlist
            removePlaylist: (id) => {
                set(state => ({
                    playlists: state.playlists.filter(p => p.id !== id)
                }));
            },

            // Export playlist to Spotify
            exportToSpotify: async (playlistId, userId) => {
                const playlist = get().playlists.find(p => p.id === playlistId);
                if (!playlist) {
                    throw new Error('Playlist not found');
                }

                try {
                    // Create playlist on Spotify
                    const spotifyPlaylist = await spotifyService.createPlaylist(
                        userId,
                        playlist.name,
                        `Created by Music Horizon - ${playlist.tracks.length} tracks`,
                        true
                    );

                    // Get Spotify URIs for tracks
                    const trackUris = playlist.tracks
                        .filter(track => track.uri || track.spotifyUri)
                        .map(track => track.uri || track.spotifyUri);

                    if (trackUris.length > 0) {
                        // Add tracks to playlist
                        await spotifyService.addTracksToPlaylist(spotifyPlaylist.id, trackUris);
                    }

                    // Update local playlist with Spotify ID
                    set(state => ({
                        playlists: state.playlists.map(p =>
                            p.id === playlistId
                                ? { ...p, spotifyId: spotifyPlaylist.id, exported: true }
                                : p
                        )
                    }));

                    return spotifyPlaylist;
                } catch (error) {
                    console.error('Error exporting playlist:', error);
                    throw error;
                }
            },

            // Remove playlist from Spotify (Unfollow)
            removePlaylistFromSpotify: async (playlistId) => {
                const playlist = get().playlists.find(p => p.id === playlistId);
                if (!playlist || !playlist.spotifyId) {
                    throw new Error('Playlist not found or not exported');
                }

                try {
                    await spotifyService.unfollowPlaylist(playlist.spotifyId);

                    // Update local state to reflect removal
                    set(state => ({
                        playlists: state.playlists.map(p =>
                            p.id === playlistId
                                ? { ...p, spotifyId: null, exported: false }
                                : p
                        )
                    }));
                } catch (error) {
                    console.error('Error removing playlist from Spotify:', error);
                    throw error;
                }
            }
        }),
        {
            name: 'music-horizon-playlists'
        }
    )
);

export default usePlaylistStore;
