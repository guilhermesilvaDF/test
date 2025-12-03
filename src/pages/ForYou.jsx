import spotifyService from '../services/spotify';

// ... (imports)

// ... (components)

export default function ForYou() {
    // ... (state)

    const loadData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            if (lastfmUser) {
                // Load from Last.fm
                // 1. Get User Info & Stats (Parallel)
                const [fmRecent, fmTop7Days, fmTopOverall] = await Promise.all([
                    lastfmService.getRecentTracks(lastfmUser, 5),
                    lastfmService.getTopArtists(lastfmUser, 10, '7day'),
                    lastfmService.getTopArtists(lastfmUser, 1, 'overall')
                ]);

                // Normalize Last.fm data
                setRecentTracks(fmRecent.map(t => ({
                    id: t.mbid || t.name,
                    name: t.name,
                    artist: t.artist['#text'],
                    image: t.image?.[2]?.['#text']
                })));

                // Enhance Top Artists with Spotify Images (using robust service)
                const initialArtists = fmTop7Days.map(a => ({
                    name: a.name,
                    count: parseInt(a.playcount),
                    image: a.image?.[2]?.['#text']
                }));

                let enhancedTopArtists = [];
                try {
                    enhancedTopArtists = await recommendationService.enrichArtists(initialArtists);
                } catch (err) {
                    console.error('Error enhancing top artists:', err);
                    enhancedTopArtists = initialArtists;
                }

                setTopArtists(enhancedTopArtists);

                setStats({
                    totalTracks: parseInt(fmTopOverall[0]?.playcount || 0),
                    topArtist: fmTopOverall[0]?.name || '-',
                    totalListeningTime: 0
                });

                // 2. Get Recommendations based on Top 5 (7 Day)
                const recs = await recommendationService.getRecommendationsBasedOnRecentTopArtists(lastfmUser, 50);
                setRecommendations(recs);

            } else {
                // ... (local history logic)
            }
        } catch (err) {
            // ... (error handling)
        } finally {
            setIsLoading(false);
        }
    };

    // ... (rest of the file)

    useEffect(() => {
        loadData();
    }, [lastfmUser, hasHistory]);

    // Format listening time
    const formatTime = (seconds) => {
        if (!seconds) return '-';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    // --- Empty State ---
    if (!hasHistory && !lastfmUser) {
        return (
            <>
                <Header title="Para Você" />
                <div className="p-8 flex-1 flex items-center justify-center min-h-[80vh]">
                    <div className="text-center max-w-md">
                        <div className="w-24 h-24 bg-gradient-to-br from-accent-blue to-accent-purple rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-accent-purple/20">
                            <i className="ph-fill ph-headphones text-4xl text-white"></i>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Descubra Novas Músicas</h2>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            Conecte seu Last.fm ou comece a ouvir músicas para receber recomendações personalizadas baseadas no seu gosto.
                        </p>
                        <div className="flex flex-col gap-4">
                            <button onClick={loginLastFM} className="btn-primary bg-[#ba0000] hover:bg-[#d51007] border-none text-white w-full py-4 text-lg shadow-lg shadow-red-900/20">
                                <i className="ph-fill ph-lastfm-logo mr-3 text-xl"></i>
                                Conectar com Last.fm
                            </button>
                            <a href="/search" className="btn-secondary w-full py-4 text-lg">
                                <i className="ph ph-magnifying-glass mr-3 text-xl"></i>
                                Buscar Músicas
                            </a>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header title="Para Você" />
            <div className="p-8 flex-1 space-y-12 pb-20">

                {/* Hero Section */}
                <section className="relative rounded-3xl overflow-hidden p-10 min-h-[300px] flex flex-col justify-center">
                    {/* Dynamic Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-black opacity-90 z-0"></div>
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 z-0 mix-blend-overlay"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent-blue/30 rounded-full blur-3xl z-0"></div>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent-purple/30 rounded-full blur-3xl z-0"></div>

                    <div className="relative z-10 flex justify-between items-end">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-white mb-4 backdrop-blur-md">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                {lastfmUser ? 'Sincronizado com Last.fm' : 'Histórico Local'}
                            </div>
                            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
                                Olá, {user?.name?.split(' ')[0] || 'Ouvinte'}
                            </h1>
                            <p className="text-xl text-gray-300 max-w-2xl font-light">
                                {lastfmUser
                                    ? `Selecionamos recomendações baseadas nos seus artistas favoritos desta semana.`
                                    : 'Aqui estão algumas sugestões baseadas no que você tem ouvido recentemente.'
                                }
                            </p>
                        </div>

                        <div className="flex gap-3">
                            {!lastfmUser ? (
                                <button onClick={loginLastFM} className="btn-primary bg-[#ba0000] hover:bg-[#d51007] border-none text-white shadow-lg shadow-red-900/20">
                                    <i className="ph-fill ph-lastfm-logo mr-2"></i>
                                    Conectar Last.fm
                                </button>
                            ) : (
                                <button onClick={disconnectLastFM} className="btn-secondary hover:bg-red-500/10 hover:text-red-400 border-white/10 text-white/70">
                                    <i className="ph ph-sign-out mr-2"></i>
                                    Desconectar
                                </button>
                            )}
                            <button onClick={loadData} disabled={isLoading} className="btn-secondary bg-white/10 border-white/10 text-white hover:bg-white/20 backdrop-blur-md">
                                <i className={`ph ph-arrows-clockwise mr-2 ${isLoading ? 'animate-spin' : ''}`}></i>
                                Atualizar
                            </button>
                        </div>
                    </div>
                </section>

                {/* Stats Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        icon="ph-music-notes"
                        value={stats.totalTracks}
                        label={lastfmUser ? "Scrobbles Totais" : "Músicas Únicas"}
                        color="text-accent-blue"
                    />
                    <StatCard
                        icon="ph-crown"
                        value={stats.topArtist}
                        label="Artista Favorito"
                        color="text-accent-purple"
                    />
                    <StatCard
                        icon="ph-clock"
                        value={lastfmUser ? "N/A" : formatTime(stats.totalListeningTime)}
                        label="Tempo Ouvindo"
                        color="text-accent-green"
                    />
                </section>

                {/* Top Artists (Horizontal Scroll) */}
                {topArtists.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                <i className="ph-fill ph-chart-bar text-accent-purple"></i>
                                Top Artistas <span className="text-sm font-normal text-gray-500 ml-2">(Últimos 7 dias)</span>
                            </h3>
                        </div>
                        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide mask-linear-fade">
                            {topArtists.map((artist, i) => (
                                <ArtistCard key={`${artist.name}-${i}`} artist={artist} rank={i + 1} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Recommendations & Recent Split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Recommendations (Main Column) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                Recomendado Para Você
                            </h3>
                            {recommendations.length > 0 && (
                                <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-gray-400 border border-white/5">
                                    {recommendations.length} músicas
                                </span>
                            )}
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                <div className="loader w-12 h-12 border-4 border-accent-purple border-t-transparent"></div>
                                <p className="text-gray-400 animate-pulse">Curando sua playlist...</p>
                            </div>
                        ) : error ? (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                                <p className="text-red-400 mb-2">{error}</p>
                                <button onClick={loadData} className="text-sm text-white underline">Tentar novamente</button>
                            </div>
                        ) : recommendations.length > 0 ? (
                            <div className="space-y-2">
                                {recommendations.map((track, index) => {
                                    if (!track || !track.name || !track.artist) return null;
                                    return <TrackListItem key={`rec-${track.id}-${index}`} track={track} index={index} />;
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-gray-500">
                                Nenhuma recomendação encontrada. Tente ouvir mais músicas!
                            </div>
                        )}
                    </div>

                    {/* Recently Played (Sidebar) */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                            <i className="ph-fill ph-clock-counter-clockwise text-accent-blue"></i>
                            Recentes
                        </h3>
                        <div className="bg-dark-card/50 border border-white/5 rounded-2xl p-4 space-y-2 backdrop-blur-sm">
                            {recentTracks.length > 0 ? (
                                recentTracks.map((track, index) => (
                                    <TrackListItem key={`recent-${track.id}-${index}`} track={track} index={index} />
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-8">Nada ouvido recentemente</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
