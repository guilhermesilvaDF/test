import { create } from 'zustand';
import spotifyService from '../services/spotify';
import useListeningHistoryStore from './listeningHistoryStore';

const usePlayerStore = create((set, get) => ({
    player: null,
    deviceId: null,
    currentTrack: null,
    isPlaying: false,
    position: 0,
    duration: 0,
    volume: 50,
    lastTrackStartTime: null,

    // Initialize player
    initPlayer: async (token) => {
        try {
            const player = await spotifyService.initializePlayer(
                token,
                (deviceId) => {
                    set({ deviceId });
                },
                (state) => {
                    if (!state) return;

                    const track = state.track_window?.current_track;
                    const { currentTrack, lastTrackStartTime } = get();

                    // Check if track changed to record history
                    if (currentTrack && track && currentTrack.id !== track.id) {
                        const duration = Date.now() - (lastTrackStartTime || 0);
                        if (duration > 30000) { // 30 seconds threshold
                            useListeningHistoryStore.getState().trackPlay(currentTrack, duration / 1000);
                        }
                        set({ lastTrackStartTime: Date.now() });
                    } else if (!lastTrackStartTime && track) {
                        set({ lastTrackStartTime: Date.now() });
                    }

                    set({
                        currentTrack: track ? {
                            id: track.id,
                            name: track.name,
                            artist: track.artists?.map(a => a.name).join(', '),
                            album: track.album?.name,
                            image: track.album?.images?.[0]?.url,
                            uri: track.uri
                        } : null,
                        isPlaying: !state.paused,
                        position: state.position,
                        duration: state.duration
                    });
                }
            );

            set({ player });
        } catch (error) {
            console.error('Failed to initialize player:', error);
        }
    },

    // Play single track
    playTrack: async (track) => {
        const { deviceId } = get();
        const trackUri = track.uri || track.spotifyUri;

        if (!deviceId || !trackUri) {
            console.error('No device ID or Spotify URI', { deviceId, trackUri });
            return;
        }

        try {
            await spotifyService.play(deviceId, { uris: [trackUri] });
            set({ currentTrack: track, isPlaying: true, lastTrackStartTime: Date.now() });
        } catch (error) {
            console.error('Error playing track:', error);
        }
    },

    // Play list of tracks
    playTracks: async (tracks, startIndex = 0) => {
        const { deviceId } = get();
        if (!deviceId || !tracks.length) return;

        // Filter tracks with valid URIs
        const validTracks = tracks.filter(t => t.uri || t.spotifyUri);
        const uris = validTracks.map(t => t.uri || t.spotifyUri);

        if (uris.length === 0) return;

        // Adjust startIndex if we filtered out some tracks
        const startTrack = tracks[startIndex];
        const startUri = startTrack?.uri || startTrack?.spotifyUri;

        // If the start track is valid, find its index in the filtered list
        // Otherwise default to 0
        let offsetIndex = 0;
        if (startUri) {
            offsetIndex = uris.indexOf(startUri);
            if (offsetIndex === -1) offsetIndex = 0;
        }

        try {
            await spotifyService.play(deviceId, { uris, offset: { position: offsetIndex } });
            set({ currentTrack: tracks[startIndex], isPlaying: true, lastTrackStartTime: Date.now() });
        } catch (error) {
            console.error('Error playing tracks:', error);
        }
    },

    // Toggle play/pause
    togglePlayPause: async () => {
        const { isPlaying } = get();
        try {
            if (isPlaying) {
                await spotifyService.pause();
            } else {
                await spotifyService.resume();
            }
            set({ isPlaying: !isPlaying });
        } catch (error) {
            console.error('Error toggling playback:', error);
        }
    },

    // Next track
    nextTrack: async () => {
        try {
            await spotifyService.next();
        } catch (error) {
            console.error('Error skipping track:', error);
        }
    },

    // Previous track
    previousTrack: async () => {
        try {
            await spotifyService.previous();
        } catch (error) {
            console.error('Error going to previous track:', error);
        }
    },

    // Seek to position
    seek: async (position) => {
        try {
            await spotifyService.seek(position);
            set({ position });
        } catch (error) {
            console.error('Error seeking:', error);
        }
    },

    // Set volume
    setVolume: (volume) => {
        const { player } = get();
        if (player) {
            player.setVolume(volume / 100);
            set({ volume });
        }
    }
}));

export default usePlayerStore;
