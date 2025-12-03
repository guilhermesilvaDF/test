import cacheService from './cache';
import md5 from '../utils/md5';

const LASTFM_API_BASE = 'https://ws.audioscrobbler.com/2.0/';

class LastFMService {
    constructor() {
        this.apiKey = import.meta.env.VITE_LASTFM_API_KEY;
        this.sharedSecret = (import.meta.env.VITE_LASTFM_SHARED_SECRET || '').trim();

        // Test MD5
        console.log('[LastFM] MD5 Test "hello":', md5('hello')); // Should be 5d41402abc4b2a76b9719d911017c592
    }

    // Generate API signature
    generateSignature(params) {
        const keys = Object.keys(params).sort();
        let stringToSign = '';

        keys.forEach(key => {
            if (key !== 'format' && key !== 'callback') {
                stringToSign += key + params[key];
            }
        });

        console.log('[LastFM] String to sign (without secret):', stringToSign);
        stringToSign += this.sharedSecret;
        const signature = md5(stringToSign);
        console.log('[LastFM] Generated Signature:', signature);

        return signature;
    }

    // Make API request to Last.fm with caching
    async apiRequest(method, params = {}, signed = false) {
        // Generate cache key from method and params
        const cacheKey = cacheService.generateKey('lastfm', method, JSON.stringify(params));

        // Check cache first (only for non-signed/read-only requests)
        if (!signed) {
            const cached = cacheService.get(cacheKey);
            if (cached) {
                return cached;
            }
        }

        const url = new URL(LASTFM_API_BASE);
        const requestParams = {
            method,
            api_key: this.apiKey,
            ...params
        };

        if (signed) {
            if (!this.sharedSecret) {
                console.error('Last.fm Shared Secret is missing! Check .env file.');
                throw new Error('Configuration Error: Shared Secret missing');
            }
            requestParams.api_sig = this.generateSignature(requestParams);
            console.log('[LastFM] Signing params:', requestParams);
        }

        requestParams.format = 'json';

        Object.entries(requestParams).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        console.log(`[LastFM] Requesting: ${method}`, url.toString());

        const response = await fetch(url.toString());
        const data = await response.json();

        if (!response.ok) {
            console.error('[LastFM] API Error Response:', data);
            throw new Error(data.message || `Last.fm API Error: ${response.status} ${response.statusText}`);
        }

        if (data.error) {
            console.error('[LastFM] API Error Data:', data);
            throw new Error(data.message);
        }

        // Cache the result (5 minutes TTL) for read-only requests
        if (!signed) {
            cacheService.set(cacheKey, data);
        }

        return data;
    }

    // Get session from token
    async getSession(token) {
        const data = await this.apiRequest('auth.getSession', { token }, true);
        return data.session;
    }

    // Get user's recent tracks
    async getRecentTracks(user, limit = 20) {
        const data = await this.apiRequest('user.getrecenttracks', {
            user,
            limit,
            extended: 1
        });
        return data.recenttracks?.track || [];
    }

    // Get user's top artists
    async getTopArtists(user, limit = 20, period = 'overall') {
        const data = await this.apiRequest('user.gettopartists', {
            user,
            limit,
            period
        });
        return data.topartists?.artist || [];
    }

    // Search for artist
    async searchArtist(artistName, limit = 10) {
        const data = await this.apiRequest('artist.search', {
            artist: artistName,
            limit
        });
        return data.results?.artistmatches?.artist || [];
    }

    // Search for track
    async searchTrack(trackName, limit = 10) {
        const data = await this.apiRequest('track.search', {
            track: trackName,
            limit
        });
        return data.results?.trackmatches?.track || [];
    }

    // Get similar artists
    async getSimilarArtists(artistName, limit = 20) {
        const data = await this.apiRequest('artist.getsimilar', {
            artist: artistName,
            limit
        });
        return data.similarartists?.artist || [];
    }

    // Get similar tracks
    async getSimilarTracks(trackName, artistName, limit = 20) {
        const data = await this.apiRequest('track.getsimilar', {
            track: trackName,
            artist: artistName,
            limit
        });
        return data.similartracks?.track || [];
    }

    // Get top tracks by artist
    async getTopTracksByArtist(artistName, limit = 20, page = 1) {
        const data = await this.apiRequest('artist.gettoptracks', {
            artist: artistName,
            limit,
            page
        });
        return data.toptracks?.track || [];
    }

    // Get artist info
    async getArtistInfo(artistName) {
        const data = await this.apiRequest('artist.getinfo', {
            artist: artistName
        });
        return data.artist || null;
    }

    // Get track info
    async getTrackInfo(trackName, artistName) {
        const data = await this.apiRequest('track.getinfo', {
            track: trackName,
            artist: artistName
        });
        return data.track || null;
    }

    // Get top tags for artist (genres)
    async getArtistTags(artistName) {
        const data = await this.apiRequest('artist.gettoptags', {
            artist: artistName
        });
        return data.toptags?.tag || [];
    }

    // Search by tag/genre
    async searchByTag(tag, limit = 20, page = 1) {
        const data = await this.apiRequest('tag.gettopartists', {
            tag: tag,
            limit,
            page
        });
        return data.topartists?.artist || [];
    }

    // Get top tracks by tag/genre
    async getTopTracksByTag(tag, limit = 20, page = 1) {
        const data = await this.apiRequest('tag.gettoptracks', {
            tag: tag,
            limit,
            page
        });
        return data.tracks?.track || [];
    }
}

export default new LastFMService();
