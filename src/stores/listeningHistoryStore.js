import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useListeningHistoryStore = create(
    persist(
        (set, get) => ({
            // State
            plays: [], // Array of play objects: { track, timestamp, duration }
            stats: {
                topArtists: new Map(), // artist -> play count
                topGenres: new Map(), // genre -> play count (will need to fetch from API)
                totalListeningTime: 0, // in seconds
                uniqueTracks: new Set(),
            },

            // Track a play event
            trackPlay: (track, duration = 0) => {
                const plays = get().plays;
                const stats = get().stats;

                const playEvent = {
                    track: {
                        id: track.id,
                        name: track.name,
                        artist: track.artist,
                        album: track.album,
                        image: track.image,
                    },
                    timestamp: new Date().toISOString(),
                    duration,
                };

                // Update plays (keep last 100)
                const updatedPlays = [playEvent, ...plays].slice(0, 100);

                // Update top artists
                const topArtists = new Map(stats.topArtists);
                const artistCount = topArtists.get(track.artist) || 0;
                topArtists.set(track.artist, artistCount + 1);

                // Update unique tracks
                const uniqueTracks = new Set(stats.uniqueTracks);
                uniqueTracks.add(track.id);

                // Update total listening time
                const totalListeningTime = stats.totalListeningTime + duration;

                set({
                    plays: updatedPlays,
                    stats: {
                        ...stats,
                        topArtists,
                        uniqueTracks,
                        totalListeningTime,
                    },
                });
            },

            // Get top artists
            getTopArtists: (limit = 5) => {
                const topArtists = get().stats.topArtists;
                return Array.from(topArtists.entries())
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, limit)
                    .map(([artist, count]) => ({ artist, count }));
            },

            // Get recent tracks
            getRecentTracks: (limit = 20) => {
                return get().plays.slice(0, limit).map(play => play.track);
            },

            // Get listening stats
            getListeningStats: () => {
                const stats = get().stats;
                const topArtists = get().getTopArtists(1);

                return {
                    totalTracks: stats.uniqueTracks.size,
                    totalPlays: get().plays.length,
                    totalListeningTime: stats.totalListeningTime,
                    topArtist: topArtists[0]?.artist || null,
                    topArtistCount: topArtists[0]?.count || 0,
                };
            },

            // Check if user has listening history
            hasHistory: () => {
                return get().plays.length > 0;
            },

            // Clear history
            clearHistory: () => {
                set({
                    plays: [],
                    stats: {
                        topArtists: new Map(),
                        topGenres: new Map(),
                        totalListeningTime: 0,
                        uniqueTracks: new Set(),
                    },
                });
            },
        }),
        {
            name: 'music-horizon-listening-history',
            // Custom serializer to handle Map and Set
            serialize: (state) => {
                const serialized = {
                    ...state,
                    state: {
                        ...state.state,
                        stats: {
                            ...state.state.stats,
                            topArtists: Array.from(state.state.stats.topArtists.entries()),
                            topGenres: Array.from(state.state.stats.topGenres.entries()),
                            uniqueTracks: Array.from(state.state.stats.uniqueTracks),
                        },
                    },
                };
                return JSON.stringify(serialized);
            },
            deserialize: (str) => {
                const parsed = JSON.parse(str);
                return {
                    ...parsed,
                    state: {
                        ...parsed.state,
                        stats: {
                            ...parsed.state.stats,
                            topArtists: new Map(parsed.state.stats.topArtists),
                            topGenres: new Map(parsed.state.stats.topGenres),
                            uniqueTracks: new Set(parsed.state.stats.uniqueTracks),
                        },
                    },
                };
            },
        }
    )
);

export default useListeningHistoryStore;
