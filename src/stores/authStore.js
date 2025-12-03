import { create } from 'zustand';
import spotifyService from '../services/spotify';
import lastfmService from '../services/lastfm';
import * as localAuth from '../services/localAuth';
import useGamificationStore from './gamificationStore';

const useAuthStore = create((set, get) => ({
    // Auth state
    token: null,
    user: null,
    isAuthenticated: false,
    isLoading: true,
    authType: null, // 'local' | 'spotify' | null
    spotifyConnected: false,
    spotifyUserId: null, // Store Spotify User ID explicitly

    // Last.fm state
    lastfmSessionKey: null,
    lastfmUser: null,

    // Initialize auth from storage
    init: () => {
        // Check for local user first
        const localUser = localAuth.getCurrentUser();
        const storedSpotifyUserId = localStorage.getItem('spotify_user_id');
        const storedLastFmSession = localStorage.getItem('lastfm_session_key');
        const storedLastFmUser = localStorage.getItem('lastfm_user');

        if (localUser) {
            set({
                user: localUser,
                isAuthenticated: true,
                authType: 'local',
                isLoading: false,
                spotifyUserId: storedSpotifyUserId,
                lastfmSessionKey: storedLastFmSession,
                lastfmUser: storedLastFmUser ? JSON.parse(storedLastFmUser) : null
            });

            // Check if Spotify is also connected
            const token = spotifyService.getToken();
            if (token) {
                set({ token, spotifyConnected: true });
                // Refresh user profile in background to ensure ID is valid
                get().fetchSpotifyUser();
            }
        } else {
            // Check for Spotify only auth (legacy)
            const token = spotifyService.getToken();
            if (token) {
                set({
                    token,
                    isAuthenticated: true,
                    authType: 'spotify',
                    spotifyConnected: true,
                    spotifyUserId: storedSpotifyUserId,
                    lastfmSessionKey: storedLastFmSession,
                    lastfmUser: storedLastFmUser ? JSON.parse(storedLastFmUser) : null
                });
                get().fetchSpotifyUser();
            } else {
                set({ isLoading: false });
            }
        }
    },

    // ... (existing local/spotify actions) ...

    // Last.fm Login
    loginLastFM: () => {
        const apiKey = import.meta.env.VITE_LASTFM_API_KEY;
        const callbackUrl = `${window.location.origin}/lastfm/callback`;
        window.location.href = `http://www.last.fm/api/auth/?api_key=${apiKey}&cb=${encodeURIComponent(callbackUrl)}`;
    },

    // Handle Last.fm Callback
    handleLastFMCallback: async (token) => {
        try {
            const session = await lastfmService.getSession(token);
            if (session) {
                localStorage.setItem('lastfm_session_key', session.key);
                localStorage.setItem('lastfm_user', JSON.stringify(session.name)); // Session usually has name/key

                set({
                    lastfmSessionKey: session.key,
                    lastfmUser: session.name
                });
                return { success: true };
            }
        } catch (error) {
            console.error('Last.fm auth error:', error);
            return { success: false, error: error.message };
        }
    },

    // Disconnect Last.fm
    disconnectLastFM: () => {
        localStorage.removeItem('lastfm_session_key');
        localStorage.removeItem('lastfm_user');
        set({
            lastfmSessionKey: null,
            lastfmUser: null
        });
    },

    // Local signup
    signupLocal: (name, email) => {
        const user = localAuth.signup(name, email);
        set({
            user,
            isAuthenticated: true,
            authType: 'local',
            isLoading: false
        });
        return user;
    },

    // Local login
    loginLocal: (email) => {
        const user = localAuth.login(email);
        if (user) {
            set({
                user,
                isAuthenticated: true,
                authType: 'local',
                isLoading: false
            });
            return true;
        }
        return false;
    },

    // Spotify login (can be initial login or connecting to existing local account)
    loginSpotify: async () => {
        const authUrl = await spotifyService.getAuthUrl();
        window.location.href = authUrl;
    },

    // Connect Spotify to existing local account
    connectSpotify: () => {
        get().loginSpotify();
    },

    // Disconnect Spotify (keep local account)
    disconnectSpotify: () => {
        spotifyService.logout();
        localStorage.removeItem('spotify_user_id'); // Clear storage
        set({
            token: null,
            spotifyConnected: false,
            spotifyUserId: null
        });
        // Keep local user data
    },

    // Handle Spotify callback
    handleCallback: async () => {
        console.log('[AuthStore] Handling Spotify callback...');
        const token = await spotifyService.handleCallback();

        if (token) {
            console.log('[AuthStore] Token received, updating state...');
            set({ token, spotifyConnected: true });

            // Track Spotify connection for gamification
            useGamificationStore.getState().trackSpotifyConnected();

            // If no local user exists, create one from Spotify data
            if (!get().user) {
                console.log('[AuthStore] No local user, creating from Spotify data...');
                await get().fetchSpotifyUser(true);
            } else {
                console.log('[AuthStore] Local user exists, just updating Spotify connection...');
                await get().fetchSpotifyUser(false);
            }

            return {
                success: true,
                message: 'Spotify conectado com sucesso!'
            };
        }

        console.error('[AuthStore] Failed to get token from callback URL');
        return {
            success: false,
            error: 'token_missing',
            message: 'Não foi possível obter o token de autenticação. Tente novamente.'
        };
    },

    // Fetch Spotify user profile
    fetchSpotifyUser: async (createLocalUser = false) => {
        try {
            const spotifyUser = await spotifyService.getUserProfile();

            // Always set the Spotify User ID and persist it
            localStorage.setItem('spotify_user_id', spotifyUser.id);
            set({ spotifyUserId: spotifyUser.id });

            if (createLocalUser) {
                // Create local user from Spotify data
                const user = localAuth.signup(spotifyUser.display_name, spotifyUser.email);
                set({
                    user,
                    isAuthenticated: true,
                    authType: 'spotify',
                    spotifyConnected: true,
                    isLoading: false
                });
            } else {
                // Just mark Spotify as connected
                set({ isLoading: false });
            }
        } catch (error) {
            console.error('Error fetching Spotify user:', error);
            // Don't disconnect immediately on error, might be just a network blip
            // get().disconnectSpotify(); 
        }
    },

    // Logout
    logout: () => {
        localAuth.logout();
        spotifyService.logout();
        localStorage.removeItem('spotify_user_id'); // Clear storage
        set({
            token: null,
            user: null,
            isAuthenticated: false,
            authType: null,
            spotifyConnected: false,
            spotifyUserId: null
        });
    }
}));

export default useAuthStore;
