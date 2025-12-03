import usePlayerStore from '../../stores/playerStore';
import useAuthStore from '../../stores/authStore';
import SpotifyConnect from '../SpotifyConnect';

function Player() {
    const {
        currentTrack,
        isPlaying,
        togglePlayPause,
        nextTrack,
        previousTrack,
        seek,
        position,
        duration,
        volume,
        setVolume
    } = usePlayerStore();
    const spotifyConnected = useAuthStore(state => state.spotifyConnected);

    if (!currentTrack) {
        return null;
    }

    // Show Spotify connection prompt if not connected
    if (!spotifyConnected) {
        return (
            <div className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-dark-border px-6 py-4 z-50">
                <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
                    <div className="flex items-center space-x-4">
                        <i className="ph-fill ph-info text-3xl text-accent-blue"></i>
                        <div>
                            <h4 className="text-white font-semibold">Conecte o Spotify para reproduzir músicas</h4>
                            <p className="text-dark-text-muted text-sm">
                                Você precisa de uma conta Spotify Premium conectada
                            </p>
                        </div>
                    </div>
                    <SpotifyConnect variant="button" />
                </div>
            </div>
        );
    }

    const formatTime = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 px-4 md:px-6 py-2 md:py-3 z-50">
            {/* Mobile Progress Bar (Top) */}
            <div className="md:hidden absolute top-0 left-0 right-0 h-1 bg-gray-800">
                <div
                    className="h-full bg-white transition-all duration-300 ease-linear"
                    style={{ width: `${(position / duration) * 100}%` }}
                ></div>
            </div>

            <div className="flex items-center justify-between max-w-screen-2xl mx-auto h-16 md:h-20">
                {/* Track Info */}
                <div className="flex items-center space-x-3 md:space-x-4 flex-1 md:w-[30%] min-w-0">
                    {currentTrack.image && (
                        <img
                            src={currentTrack.image}
                            alt={currentTrack.name}
                            className="w-12 h-12 md:w-14 md:h-14 rounded shadow-lg"
                        />
                    )}
                    <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold truncate text-sm md:text-base">{currentTrack.name}</h4>
                        <p className="text-gray-400 text-xs md:text-sm truncate hover:text-white cursor-pointer transition-colors">
                            {currentTrack.artist}
                        </p>
                    </div>
                </div>

                {/* Playback Controls & Progress (Desktop) */}
                <div className="flex flex-col items-center md:w-[40%]">
                    <div className="flex items-center space-x-4 md:space-x-6 mb-0 md:mb-2">
                        <button
                            onClick={previousTrack}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <i className="ph-fill ph-skip-back text-xl md:text-2xl"></i>
                        </button>
                        <button
                            onClick={togglePlayPause}
                            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white hover:scale-105 transition-transform"
                        >
                            <i className={`ph-fill ${isPlaying ? 'ph-pause' : 'ph-play'} text-black text-xl md:text-2xl`}></i>
                        </button>
                        <button
                            onClick={nextTrack}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <i className="ph-fill ph-skip-forward text-xl md:text-2xl"></i>
                        </button>
                    </div>

                    {/* Desktop Progress Bar */}
                    <div className="hidden md:flex items-center space-x-2 w-full">
                        <span className="text-xs text-gray-400 w-10 text-right">{formatTime(position)}</span>
                        <input
                            type="range"
                            min="0"
                            max={duration || 100}
                            value={position}
                            onChange={(e) => seek(Number(e.target.value))}
                            className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                        />
                        <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Volume Controls (Desktop Only) */}
                <div className="hidden md:flex items-center justify-end space-x-3 w-[30%]">
                    <i className="ph ph-speaker-high text-gray-400 text-lg"></i>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                    />
                </div>
            </div>
        </div>
    );
}

export default Player;
