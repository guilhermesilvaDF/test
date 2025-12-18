import Header from '../components/Layout/Header';
import SpotifyConnect from '../components/SpotifyConnect';
import LevelBadge from '../components/Gamification/LevelBadge';
import ProgressBar from '../components/Gamification/ProgressBar';
import BadgeCard from '../components/Gamification/BadgeCard';
import useAuthStore from '../stores/authStore';
import usePlaylistStore from '../stores/playlistStore';
import useGamificationStore from '../stores/gamificationStore';

export default function Profile() {
    const user = useAuthStore(state => state.user);
    const spotifyConnected = useAuthStore(state => state.spotifyConnected);
    const disconnectSpotify = useAuthStore(state => state.disconnectSpotify);
    const lastfmUser = useAuthStore(state => state.lastfmUser);
    const loginLastFM = useAuthStore(state => state.loginLastFM);
    const disconnectLastFM = useAuthStore(state => state.disconnectLastFM);
    const playlists = usePlaylistStore(state => state.playlists);

    const { points, getLevelInfo, getAllBadges } = useGamificationStore();
    const levelInfo = getLevelInfo();
    const allBadges = getAllBadges();
    const unlockedCount = allBadges.filter(b => b.unlocked).length;

    const stats = {
        playlists: playlists.length,
        tracks: playlists.reduce((sum, p) => sum + p.tracks.length, 0),
        exported: playlists.filter(p => p.exported).length
    };

    return (
        <>
            <Header title="Perfil" />
            <div className="p-8 flex-1">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* User Info */}
                    <section className="bg-dark-card border border-dark-border p-8 rounded-lg">
                        <div className="flex items-center space-x-6">
                            <div className="w-24 h-24 rounded-full bg-dark-bg flex items-center justify-center">
                                <i className="ph-fill ph-user text-5xl text-accent-blue"></i>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold text-white">{user?.name || user?.display_name}</h2>
                                <p className="text-dark-text-muted">{user?.email}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-dark-text-muted text-sm">Total de Pontos</p>
                                <p className="text-4xl font-extrabold text-accent-blue">{points}</p>
                            </div>
                        </div>
                    </section>

                    {/* Gamification Dashboard */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-6">🎮 Progresso</h2>
                        <div className="bg-dark-card border border-dark-border p-8 rounded-lg">
                            <div className="flex items-center space-x-8">
                                {/* Level Badge */}
                                <LevelBadge
                                    level={levelInfo.level}
                                    name={levelInfo.name}
                                    color={levelInfo.color}
                                />

                                {/* Progress Info */}
                                <div className="flex-1">
                                    <div className="mb-4">
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h3 className="text-xl font-bold text-white">
                                                {levelInfo.nextLevel ? `Caminho para Nível ${levelInfo.nextLevel}` : 'Nível Máximo Alcançado!'}
                                            </h3>
                                            {levelInfo.nextLevel && (
                                                <span className="text-sm text-dark-text-muted">
                                                    {levelInfo.pointsToNextLevel} pontos restantes
                                                </span>
                                            )}
                                        </div>
                                        <ProgressBar
                                            current={levelInfo.currentPoints}
                                            max={levelInfo.nextLevel ? levelInfo.maxPoints + 1 : levelInfo.currentPoints}
                                            percentage={levelInfo.progressPercentage}
                                        />
                                    </div>

                                    {levelInfo.nextLevel && (
                                        <p className="text-dark-text-muted text-sm">
                                            Próximo nível: <span className="text-white font-semibold">{levelInfo.nextLevelName}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Connected Accounts */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">Contas Conectadas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Spotify Card */}
                            {spotifyConnected ? (
                                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 flex flex-col justify-between">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <i className="ph-fill ph-spotify-logo text-4xl text-green-400"></i>
                                        <div>
                                            <h3 className="text-white font-bold text-lg">Spotify</h3>
                                            <p className="text-green-400 text-sm">Conectado</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-xs text-gray-400">Permite reprodução e exportação</p>
                                        <button
                                            onClick={disconnectSpotify}
                                            className="text-sm text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            Desconectar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-dark-card border border-dark-border rounded-lg p-6 flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <i className="ph-fill ph-spotify-logo text-4xl text-gray-500"></i>
                                        <div>
                                            <h3 className="text-white font-bold text-lg">Spotify</h3>
                                            <p className="text-gray-500 text-sm">Não conectado</p>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <SpotifyConnect />
                                    </div>
                                </div>
                            )}

                            {/* Last.fm Card */}
                            {lastfmUser ? (
                                <div className="bg-[#ba0000]/10 border border-[#ba0000]/30 rounded-lg p-6 flex flex-col justify-between">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <i className="ph-fill ph-lastfm-logo text-4xl text-[#ba0000]"></i>
                                        <div>
                                            <h3 className="text-white font-bold text-lg">Last.fm</h3>
                                            <p className="text-[#ba0000] text-sm">Conectado como {lastfmUser}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-xs text-gray-400">Sincroniza histórico e recomendações</p>
                                        <button
                                            onClick={disconnectLastFM}
                                            className="text-sm text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            Desconectar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-dark-card border border-dark-border rounded-lg p-6 flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <i className="ph-fill ph-lastfm-logo text-4xl text-gray-500"></i>
                                        <div>
                                            <h3 className="text-white font-bold text-lg">Last.fm</h3>
                                            <p className="text-gray-500 text-sm">Não conectado</p>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <button 
                                            onClick={loginLastFM}
                                            className="w-full btn-primary bg-[#d51007] hover:bg-[#ba0000] border-none text-white text-sm py-2"
                                        >
                                            Conectar Last.fm
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Badges/Conquistas */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-6">📊 Estatísticas</h2>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="bg-dark-card border border-dark-border p-6 rounded-lg text-center">
                                <div className="text-5xl font-extrabold text-accent-blue">{stats.playlists}</div>
                                <div className="text-dark-text-muted mt-2">Playlists Criadas</div>
                            </div>
                            <div className="bg-dark-card border border-dark-border p-6 rounded-lg text-center">
                                <div className="text-5xl font-extrabold text-accent-blue">{stats.tracks}</div>
                                <div className="text-dark-text-muted mt-2">Músicas Descobertas</div>
                            </div>
                            <div className="bg-dark-card border border-dark-border p-6 rounded-lg text-center">
                                <div className="text-5xl font-extrabold text-accent-blue">{stats.exported}</div>
                                <div className="text-dark-text-muted mt-2">Exportadas</div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
