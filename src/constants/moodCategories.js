/**
 * Mood Categories for Playlist Generation
 * Organized by category for easy selection and guaranteed Last.fm compatibility
 */

export const MOOD_CATEGORIES = {
    emotions: {
        id: 'emotions',
        label: 'Emoções',
        icon: '❤',
        color: '#3B82F6',
        moods: [
            { id: 'sad', label: 'Triste', icon: '☁', keywords: ['triste', 'melancólica', 'tristeza'] },
            { id: 'happy', label: 'Alegre', icon: '☺', keywords: ['alegre', 'feliz', 'animada'] },
            { id: 'calm', label: 'Calma', icon: '🍃', keywords: ['calma', 'tranquila', 'paz'] },
            { id: 'romantic', label: 'Romântica', icon: '💖', keywords: ['romântica', 'amor'] },
            { id: 'energetic', label: 'Energética', icon: '⚡', keywords: ['energética', 'eufórica'] },
            { id: 'relaxing', label: 'Relaxante', icon: '🧘', keywords: ['relaxante', 'yoga', 'zen'] },
            { id: 'nostalgic', label: 'Nostálgica', icon: '🌅', keywords: ['nostálgica', 'saudade'] },
            { id: 'angry', label: 'Raiva', icon: '😠', keywords: ['raiva', 'agressiva'] },
            { id: 'motivational', label: 'Motivacional', icon: '💪', keywords: ['motivacional', 'superação'] },
            { id: 'dark', label: 'Sombria', icon: '🌑', keywords: ['sombria', 'dark'] },
            { id: 'sensual', label: 'Sensual', icon: '🔥', keywords: ['sensual', 'sexy'] },
        ]
    },

    activities: {
        id: 'activities',
        label: 'Atividades',
        icon: '🏃',
        color: '#8B5CF6',
        moods: [
            { id: 'workout', label: 'Treino', icon: '💪', keywords: ['treino', 'academia', 'corrida', 'fitness'] },
            { id: 'study', label: 'Estudo', icon: '📚', keywords: ['estudo', 'trabalho', 'foco', 'leitura'] },
            { id: 'party', label: 'Festa', icon: '🎊', keywords: ['festa', 'balada', 'churrasco', 'dançar'] },
            { id: 'sleep', label: 'Dormir', icon: '😴', keywords: ['dormir', 'sono'] },
            { id: 'driving', label: 'Dirigir', icon: '🚗', keywords: ['dirigir', 'viagem', 'estrada'] },
        ]
    },

    contexts: {
        id: 'contexts',
        label: 'Contextos',
        icon: '🌙',
        color: '#10B981',
        moods: [
            { id: 'night', label: 'Noite', icon: '🌙', keywords: ['noite', 'madrugada'] },
            { id: 'morning', label: 'Manhã', icon: '🌅', keywords: ['manhã', 'café'] },
            { id: 'sunset', label: 'Pôr do Sol', icon: '🌇', keywords: ['pôr do sol', 'entardecer', 'tarde'] },
            { id: 'summer', label: 'Verão', icon: '☀', keywords: ['verão', 'praia', 'sol'] },
            { id: 'rainy', label: 'Chuva', icon: '🌧', keywords: ['chuva', 'tempestade'] },
            { id: 'winter', label: 'Inverno', icon: '❄', keywords: ['inverno', 'frio'] },
            { id: 'christmas', label: 'Natal', icon: '🎄', keywords: ['natal'] },
        ]
    },

    genres: {
        id: 'genres',
        label: 'Gêneros',
        icon: '🎵',
        color: '#F59E0B',
        moods: [
            { id: 'sertanejo', label: 'Sertanejo', icon: '🤠', keywords: ['sertanejo'] },
            { id: 'pagode', label: 'Pagode', icon: '🥁', keywords: ['pagode', 'samba'] },
            { id: 'rock', label: 'Rock', icon: '🎸', keywords: ['rock'] },
            { id: 'pop', label: 'Pop', icon: '🎤', keywords: ['pop'] },
            { id: 'rap', label: 'Rap/Trap', icon: '🧢', keywords: ['rap', 'trap', 'hip hop'] },
            { id: 'electronic', label: 'Eletrônica', icon: '🎛', keywords: ['eletrônica', 'techno', 'house'] },
            { id: 'mpb', label: 'MPB', icon: '🎶', keywords: ['mpb', 'bossa nova'] },
            { id: 'gospel', label: 'Gospel', icon: '🙏', keywords: ['gospel'] },
            { id: 'classical', label: 'Clássica', icon: '🎻', keywords: ['clássica'] },
        ]
    },

    intensity: {
        id: 'intensity',
        label: 'Vibe',
        icon: '🎚',
        color: '#EC4899',
        moods: [
            { id: 'soft', label: 'Suave', icon: '🪶', keywords: ['suave', 'acústica'] },
            { id: 'heavy', label: 'Pesada', icon: '🔨', keywords: ['pesada', 'intensa'] },
            { id: 'instrumental', label: 'Instrumental', icon: '🎹', keywords: ['instrumental'] },
        ]
    }
};

/**
 * Get the Last.fm-compatible keyword for a selected mood
 */
export const getMoodKeyword = (categoryId, moodId) => {
    const category = MOOD_CATEGORIES[categoryId];
    if (!category) return null;

    const mood = category.moods.find(m => m.id === moodId);
    return mood ? mood.keywords[0] : null;
};

/**
 * Format a prompt for a selected mood
 */
export const formatMoodPrompt = (categoryId, moodId) => {
    const keyword = getMoodKeyword(categoryId, moodId);
    if (!keyword) return '';

    // Fix: Return keyword directly without prefix to ensure valid genre seeds (e.g. "Rock" instead of "músicas Rock")
    return keyword.charAt(0).toUpperCase() + keyword.slice(1);
};

/**
 * Find mood from text (reverse lookup)
 */
export const findMoodFromText = (text) => {
    const lowerText = text.toLowerCase();

    for (const [categoryId, category] of Object.entries(MOOD_CATEGORIES)) {
        for (const mood of category.moods) {
            if (mood.keywords.some(keyword => lowerText.includes(keyword))) {
                return { categoryId, moodId: mood.id, mood };
            }
        }
    }

    return null;
};

/**
 * Get quick suggestions (most popular moods)
 */
export const getQuickSuggestions = () => [
    { categoryId: 'activities', moodId: 'workout', label: 'Treino', icon: '💪' },
    { categoryId: 'emotions', moodId: 'sad', label: 'Triste', icon: '☁' },
    { categoryId: 'activities', moodId: 'party', label: 'Festa', icon: '🎊' },
    { categoryId: 'activities', moodId: 'sleep', label: 'Dormir', icon: '😴' },
    { categoryId: 'emotions', moodId: 'happy', label: 'Alegre', icon: '☺' },
];
