import usePlayerStore from '../../stores/playerStore';
import useAuthStore from '../../stores/authStore';

function TrackCard({ track, onPlay }) {
    const playTrack = usePlayerStore(state => state.playTrack);
    const spotifyConnected = useAuthStore(state => state.spotifyConnected);

    const handlePlay = () => {
        if (!spotifyConnected) {
            alert('Conecte o Spotify para reproduzir músicas');
            return;
        }

        if (track.uri || track.spotifyUri) {
            if (onPlay) {
                onPlay();
            } else {
                playTrack(track);
            }
        } else {
            alert('Esta música não está disponível no Spotify para reprodução');
        }
    };

    const canPlay = spotifyConnected && (track.uri || track.spotifyUri);

    // Generate a consistent color based on track name
    const getGradientColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = hash % 360;
        return `linear-gradient(135deg, hsl(${hue}, 70%, 50%), hsl(${(hue + 60) % 360}, 70%, 40%))`;
    };

    const imageSrc = track.imageUrl || track.image;
    const hasImage = imageSrc && imageSrc !== '' && imageSrc !== 'undefined' && imageSrc !== '/default-album.png';

    return (
        <div className="bg-gray-800 p-4 rounded-lg card-hover-effect cursor-pointer group">
            <div className="relative mb-4">
                {hasImage ? (
                    <img
                        src={imageSrc}
                        alt={track.name}
                        className="w-full rounded-md aspect-square object-cover"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                <div
                    className="w-full rounded-md aspect-square flex items-center justify-center"
                    style={{
                        background: getGradientColor(track.name),
                        display: hasImage ? 'none' : 'flex'
                    }}
                >
                    <i className="ph-fill ph-music-note text-white text-6xl opacity-50"></i>
                </div>
                <button
                    onClick={handlePlay}
                    className={`absolute bottom-2 right-2 w-12 h-12 rounded-full flex items-center justify-center transition-all ${canPlay
                        ? 'bg-green-500 hover:bg-green-400 opacity-0 group-hover:opacity-100'
                        : 'bg-gray-600 cursor-not-allowed opacity-50'
                        }`}
                    disabled={!canPlay}
                    title={!spotifyConnected ? 'Conecte o Spotify para reproduzir' : !(track.uri || track.spotifyUri) ? 'Não disponível no Spotify' : 'Reproduzir'}
                >
                    <i className="ph-fill ph-play text-white text-xl"></i>
                </button>
            </div>
            <h4 className="text-lg font-bold text-white truncate">{track.name}</h4>
            <p className="text-sm text-gray-400 truncate">{track.artist}</p>
            {track.reason && (
                <div className="mt-2 flex items-start gap-1.5">
                    <i className="ph-fill ph-lightbulb text-yellow-500 mt-0.5 flex-shrink-0"></i>
                    <p className="text-xs text-gray-400 italic leading-tight">{track.reason}</p>
                </div>
            )}
            {track.album && !track.reason && (
                <p className="text-xs text-gray-500 truncate mt-1">{track.album}</p>
            )}
        </div>
    );
}

export default TrackCard;
