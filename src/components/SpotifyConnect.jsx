import useAuthStore from '../stores/authStore';

export default function SpotifyConnect({ variant = 'card' }) {
    const connectSpotify = useAuthStore(state => state.connectSpotify);
    const spotifyConnected = useAuthStore(state => state.spotifyConnected);

    if (spotifyConnected) {
        return (
            <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                    <i className="ph-fill ph-check-circle text-2xl text-green-400"></i>
                    <div>
                        <h3 className="text-green-400 font-semibold">Spotify Conectado</h3>
                        <p className="text-sm text-dark-text-muted">
                            Você pode reproduzir músicas e exportar playlists
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (variant === 'button') {
        return (
            <button
                onClick={connectSpotify}
                className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded-full transition-all transform hover:scale-105 flex items-center space-x-2"
            >
                <i className="ph-fill ph-spotify-logo text-xl"></i>
                <span>Conectar Spotify</span>
            </button>
        );
    }

    return (
        <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                    <i className="ph-fill ph-spotify-logo text-5xl text-green-500"></i>
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                        Conecte o Spotify
                    </h3>
                    <p className="text-dark-text-muted mb-4">
                        Desbloqueie recursos premium conectando sua conta do Spotify:
                    </p>

                    <ul className="space-y-2 mb-6">
                        <li className="flex items-center text-dark-text">
                            <i className="ph-fill ph-play-circle text-accent-blue mr-2"></i>
                            <span>Reproduzir músicas diretamente no navegador</span>
                        </li>
                        <li className="flex items-center text-dark-text">
                            <i className="ph-fill ph-upload-simple text-accent-blue mr-2"></i>
                            <span>Exportar playlists para sua biblioteca do Spotify</span>
                        </li>
                        <li className="flex items-center text-dark-text">
                            <i className="ph-fill ph-music-notes text-accent-blue mr-2"></i>
                            <span>Sincronizar suas descobertas musicais</span>
                        </li>
                    </ul>

                    <button
                        onClick={connectSpotify}
                        className="bg-green-500 hover:bg-green-400 text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 flex items-center space-x-2"
                    >
                        <i className="ph-fill ph-spotify-logo text-xl"></i>
                        <span>Conectar com Spotify</span>
                    </button>

                    <p className="text-xs text-dark-text-muted mt-4">
                        * Spotify Premium necessário para reprodução de músicas
                    </p>
                </div>
            </div>
        </div>
    );
}
