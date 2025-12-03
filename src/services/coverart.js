// Free cover art service using iTunes Search API
class CoverArtService {
    constructor() {
        this.lastCallTime = 0;
        this.minDelay = 100; // 100ms entre chamadas
    }

    async getCoverArt(trackName, artistName) {
        try {
            // Rate limiting: aguardar mínimo entre chamadas
            const now = Date.now();
            const timeSinceLastCall = now - this.lastCallTime;
            if (timeSinceLastCall < this.minDelay) {
                await new Promise(resolve => setTimeout(resolve, this.minDelay - timeSinceLastCall));
            }
            this.lastCallTime = Date.now();

            const query = `${trackName} ${artistName}`;
            const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=1`;

            const response = await fetch(url);
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
