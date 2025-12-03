import { create } from 'zustand';

const usePreviewStore = create((set, get) => ({
    currentTrack: null,
    isPlaying: false,
    isLoading: false,
    audio: null,

    playPreview: (track) => {
        const { audio, currentTrack, isPlaying } = get();

        // Se já está tocando esta música, pausar
        if (currentTrack?.id === track.id && isPlaying) {
            if (audio) {
                audio.pause();
                set({ isPlaying: false, isLoading: false });
            }
            return;
        }

        // Parar preview anterior
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }

        // Se não há preview URL, não fazer nada
        if (!track.previewUrl) {
            return;
        }

        // Setar loading imediatamente
        set({ isLoading: true, currentTrack: track });

        // Criar novo áudio
        const newAudio = new Audio(track.previewUrl);
        newAudio.volume = 0.5;

        newAudio.addEventListener('ended', () => {
            set({ isPlaying: false, isLoading: false });
        });

        newAudio.addEventListener('error', () => {
            console.error('Error loading preview');
            set({ isPlaying: false, currentTrack: null, isLoading: false });
        });

        // Tentar tocar
        newAudio.play().then(() => {
            set({
                audio: newAudio,
                currentTrack: track,
                isPlaying: true,
                isLoading: false
            });
        }).catch((error) => {
            console.error('Error playing preview:', error);
            set({ isLoading: false });
        });
    },

    stopPreview: () => {
        const { audio } = get();
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
        set({ isPlaying: false, currentTrack: null, isLoading: false });
    },

    setVolume: (volume) => {
        const { audio } = get();
        if (audio) {
            audio.volume = volume;
        }
    }
}));

export default usePreviewStore;
