import deezerService from './deezer';

// Free cover art service using Deezer (primary) and iTunes (fallback)
class CoverArtService {
    constructor() {
        this.queue = [];
        this.processing = false;
        this.minDelay = 300; // 300ms delay between requests
    }

    async getCoverArt(trackName, artistName) {
        return new Promise((resolve) => {
            this.queue.push({ trackName, artistName, resolve });
            this.processQueue();
        });
    }

    clearQueue() {
        this.queue = [];
    }

    async processQueue() {
        if (this.processing || this.queue.length === 0) return;
        this.processing = true;

        while (this.queue.length > 0) {
            const { trackName, artistName, resolve } = this.queue.shift();
            
            try {
                const result = await this._fetchCoverArt(trackName, artistName);
                resolve(result);
            } catch (error) {
                console.error('Error in cover art queue:', error);
                resolve(null);
            }

            // Wait before next request
            await new Promise(r => setTimeout(r, this.minDelay));
        }

        this.processing = false;
    }

    async _fetchCoverArt(trackName, artistName) {
        try {
            // 1. Try Deezer first (Better rate limits)
            const deezerTrack = await deezerService.searchTrack(trackName, artistName);
            if (deezerTrack && deezerTrack.album) {
                const art = deezerTrack.album.cover_xl || deezerTrack.album.cover_big || deezerTrack.album.cover_medium;
                if (art) return art;
            }

            // 2. Fallback to iTunes
            const query = `${trackName} ${artistName}`;
            const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=1`;

            const response = await fetch(url);
            if (!response.ok) return null;
            
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const result = data.results[0];
                // iTunes returns 100x100 by default, upgrade to 600x600
                const artwork = result.artworkUrl100?.replace('100x100', '600x600');
                return artwork || null;
            }

            return null;
        } catch (error) {
            console.error('Error fetching cover art:', error);
            return null;
        }
    }
}

export default new CoverArtService();
