
class ItunesService {
    constructor() {
        this.baseUrl = 'https://itunes.apple.com/search';
    }

    async searchTrack(trackName, artistName) {
        try {
            // iTunes search is very forgiving. We just combine artist and track.
            const term = `${artistName} ${trackName}`;
            const params = new URLSearchParams({
                term: term,
                media: 'music',
                entity: 'song',
                limit: 1
            });

            const response = await fetch(`${this.baseUrl}?${params.toString()}`);
            if (!response.ok) return null;

            const data = await response.json();
            if (data.resultCount === 0 || !data.results[0]) return null;

            const track = data.results[0];

            // Basic validation to ensure we didn't get a completely random song
            // iTunes fuzzy match is GOOD, but sometimes too loose.
            const itunesArtist = track.artistName.toLowerCase();
            const searchArtist = artistName.toLowerCase();

            // Check if artist name is somewhat similar (includes or is included)
            if (!itunesArtist.includes(searchArtist) && !searchArtist.includes(itunesArtist)) {
                return null;
            }

            return {
                previewUrl: track.previewUrl,
                album: track.collectionName,
                imageUrl: track.artworkUrl100.replace('100x100', '600x600'), // Get higher res
                externalUrl: track.trackViewUrl
            };

        } catch (error) {
            console.error('iTunes API Error:', error);
            return null;
        }
    }

    async searchArtist(artistName) {
        try {
            const params = new URLSearchParams({
                term: artistName,
                media: 'music',
                entity: 'musicArtist',
                limit: 1
            });

            const response = await fetch(`${this.baseUrl}?${params.toString()}`);
            if (!response.ok) return null;

            const data = await response.json();
            if (data.resultCount === 0 || !data.results[0]) return null;

            const artist = data.results[0];
            // iTunes doesn't always give artist images directly in search, 
            // but sometimes we can get it from their top album.
            // Let's try to get the top album for the artist to get a cover.
            return {
                name: artist.artistName,
                id: artist.artistId,
                externalUrl: artist.artistLinkUrl
            };
        } catch (error) {
            console.error('iTunes Artist Search Error:', error);
            return null;
        }
    }
}

export default new ItunesService();
