class DeezerService {
    async searchTrack(trackName, artistName) {
        // Limpar nomes para melhorar busca
        const cleanTrack = trackName.replace(/\s*\(.*?\)\s*/g, '').trim(); // Remove (feat. X), (Remix), etc
        const cleanArtist = artistName.split(',')[0].trim(); // Pega apenas o primeiro artista se houver vários

        // Busca mais flexível sem aspas estritas
        const query = `${cleanArtist} ${cleanTrack}`;
        const url = `https://api.deezer.com/search?q=${encodeURIComponent(query)}`;

        return new Promise((resolve, reject) => {
            const callbackName = 'deezer_cb_' + Math.round(100000 * Math.random());

            // Timeout handling (3s)
            const timeoutId = setTimeout(() => {
                cleanup();
                resolve(null);
            }, 3000);

            window[callbackName] = (data) => {
                cleanup();
                if (data && data.data && data.data.length > 0) {
                    console.log(`[Deezer] Found: ${trackName} -> ${data.data[0].title}`);
                    resolve(data.data[0]);
                } else {
                    console.log(`[Deezer] Not found: ${trackName} (Query: ${query})`);
                    resolve(null);
                }
            };

            const cleanup = () => {
                clearTimeout(timeoutId);
                delete window[callbackName];
                if (script && document.body.contains(script)) {
                    document.body.removeChild(script);
                }
            };

            const script = document.createElement('script');
            script.src = `${url}&output=jsonp&callback=${callbackName}`;
            script.onerror = () => {
                console.error(`[Deezer] Script error for: ${trackName}`);
                cleanup();
                resolve(null);
            };
            document.body.appendChild(script);
        });
    }
}

export default new DeezerService();
