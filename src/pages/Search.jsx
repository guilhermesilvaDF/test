import { useState } from 'react';
import Header from '../components/Layout/Header';
import TrackListItem from '../components/Player/TrackListItem';
import Toast from '../components/Toast';
import AchievementToast from '../components/Gamification/AchievementToast';
import lastfmService from '../services/lastfm';
import usePlaylistStore from '../stores/playlistStore';
import useGamificationStore from '../stores/gamificationStore';

// Convert Last.fm track to app format
function normalizeLastFmTrack(track) {
    const image = track.image?.find(img => img.size === 'large')?.['#text'] || 
                  track.image?.find(img => img.size === 'medium')?.['#text'];
    
    return {
        id: track.mbid || `${track.artist}-${track.name}`.replace(/\s/g, '-'),
        name: track.name,
        artist: track.artist || '',
        album: '',
        imageUrl: image || null,
        spotifyUri: null,
        previewUrl: track.url,
        duration: null,
        popularity: track.listeners ? parseInt(track.listeners) : 0
    };
}

function Search() {
    const [searchQuery, setSearchQuery] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [playlistName, setPlaylistName] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [newBadges, setNewBadges] = useState([]);
    
    const addPlaylist = usePlaylistStore(state => state.addPlaylist);
    const { trackSearch, trackTracksDiscovered, trackPlaylistCreated } = useGamificationStore();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            // Search for tracks using Last.fm
            const result = await lastfmService.searchTrack(searchQuery, 25, 1);
            const tracks = Array.isArray(result.tracks) ? result.tracks.map(normalizeLastFmTrack) : [];
            
            setRecommendations(tracks);

            // Track gamification
            trackSearch(searchQuery);
            trackTracksDiscovered(tracks.length);

            // Check for new badges
            const badges = useGamificationStore.getState().checkAndUnlockBadges();
            if (badges.length > 0) {
                setNewBadges(badges);
            }
        } catch (err) {
            setError('Erro ao buscar recomendações. Tente novamente.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreatePlaylist = () => {
        if (!playlistName.trim() || recommendations.length === 0) return;

        addPlaylist({
            name: playlistName,
            tracks: recommendations,
            created: new Date().toISOString()
        });

        // Track gamification
        trackPlaylistCreated();
        const badges = useGamificationStore.getState().checkAndUnlockBadges();
        if (badges.length > 0) {
            setNewBadges(badges);
        }

        setPlaylistName('');
        setShowPlaylistModal(false);
        setShowToast(true);
    };


    return (
        <>
            <Header title="Buscar Música" />
            <div className="p-8 flex-1">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Search Bar */}
                    <section>
                        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Busque por artista, música ou gênero... ex: Arctic Monkeys, Rock, Indie"
                                    className="flex-1 bg-gray-800 border-gray-700 rounded-md p-4 text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn-primary px-8"
                                >
                                    {isLoading ? (
                                        <div className="loader w-6 h-6"></div>
                                    ) : (
                                        <>
                                            <i className="ph ph-magnifying-glass mr-2"></i>
                                            Buscar
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg max-w-2xl mx-auto">
                            {error}
                        </div>
                    )}

                    {/* Results */}
                    {recommendations.length > 0 && (
                        <section>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-white">
                                    {recommendations.length} recomendações encontradas
                                </h2>
                                <button
                                    onClick={() => setShowPlaylistModal(true)}
                                    className="btn-primary"
                                >
                                    <i className="ph ph-plus mr-2"></i>
                                    Criar Playlist
                                </button>
                            </div>

                            {/* Vertical list of tracks */}
                            <div className="space-y-2">
                                {recommendations.map((track, index) => (
                                    <TrackListItem key={`${track.id}-${index}`} track={track} index={index} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Empty State */}
                    {!isLoading && recommendations.length === 0 && !error && (
                        <div className="text-center py-16">
                            <i className="ph ph-music-notes-simple text-8xl text-gray-700 mb-4"></i>
                            <h3 className="text-2xl font-bold text-gray-400">
                                Busque para começar
                            </h3>
                            <p className="text-gray-500 mt-2">
                                Digite um artista, música ou gênero para descobrir novas músicas
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Playlist Modal */}
            {showPlaylistModal && (
                <>
                    <div
                        className="fixed inset-0 bg-black/70 z-40"
                        onClick={() => setShowPlaylistModal(false)}
                    ></div>
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-gray-800 rounded-lg p-8 shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-4">Criar Playlist</h2>
                        <input
                            type="text"
                            value={playlistName}
                            onChange={(e) => setPlaylistName(e.target.value)}
                            placeholder="Nome da playlist..."
                            className="w-full bg-gray-900 border-gray-700 rounded-md p-3 text-white mb-6"
                            autoFocus
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowPlaylistModal(false)}
                                className="flex-1 btn-secondary"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCreatePlaylist}
                                disabled={!playlistName.trim()}
                                className="flex-1 btn-primary"
                            >
                                Criar
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Toast Notification */}
            {showToast && (
                <Toast
                    message="Playlist criada com sucesso!"
                    type="success"
                    onClose={() => setShowToast(false)}
                />
            )}

            {/* Achievement Toasts */}
            {newBadges.map((badge, index) => (
                <AchievementToast
                    key={badge.id}
                    badge={badge}
                    onClose={() => setNewBadges(prev => prev.filter(b => b.id !== badge.id))}
                    duration={5000 + (index * 1000)}
                />
            ))}
        </>
    );
}

export default Search;
