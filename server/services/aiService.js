import genAI from '../config/genai.js';

const buildError = (message, status = 400) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

export const generateRecommendations = async ({ prompt, limit = 20, context = {} }) => {
    if (!genAI) throw buildError('AI Service not configured', 503);
    if (!prompt || typeof prompt !== 'string') throw buildError('Valid prompt is required', 400);

    prompt = prompt.trim().substring(0, 500);
    limit = Math.min(Math.max(parseInt(limit, 10) || 20, 5), 50);

    const { genres = [], albums = [], recentSongs = [] } = context;
    const safeGenres = Array.isArray(genres) ? genres.slice(0, 5).map((s) => String(s).substring(0, 50)) : [];
    const safeAlbums = Array.isArray(albums) ? albums.slice(0, 5).map((s) => String(s).substring(0, 100)) : [];
    const safeRecent = Array.isArray(recentSongs) ? recentSongs.slice(0, 5).map((s) => String(s).substring(0, 100)) : [];

    let contextPrompt = '';
    if (safeGenres.length || safeAlbums.length || safeRecent.length) {
        contextPrompt = `\n\nUser Context (Musical History):
            ${safeGenres.length ? `- Top Genres: ${safeGenres.join(', ')}` : ''}
            ${safeAlbums.length ? `- Recent/Top Albums: ${safeAlbums.join(', ')}` : ''}
            ${safeRecent.length ? `- Recently Played: ${safeRecent.join(', ')}` : ''}
            \n            Use this context to influence the vibe of the recommendations while strictly following the user's prompt.`;
    }

    const response = await genAI.models.generateContent({
        model: 'gemini-flash-lite-latest',
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: 'ARRAY',
                items: {
                    type: 'OBJECT',
                    properties: {
                        name: { type: 'STRING' },
                        artist: { type: 'STRING' },
                        reason: { type: 'STRING' },
                    },
                },
            },
        },
        contents: [
            {
                role: 'user',
                parts: [
                    {
                        text: `Act as a music expert DJ. Based on the following prompt, suggest ${limit} song recommendations: "${prompt}".${contextPrompt}

Rules:
1. For the 'reason' field, describe the song's actual sound, mood, or instrumentals (e.g., "Sintetizadores sonhadores", "Riffs de guitarra agressivos", "Ritmo funk animado").
2. Do NOT say "Because you liked..." or "Similar to...". Focus on the music itself.
3. Keep the reason under 6 words.
4. The reason MUST be in Portuguese.`,
                    },
                ],
            },
        ],
    });

    const candidates = response.response?.candidates || response.candidates;
    if (!candidates || !candidates[0] || !candidates[0].content) {
        throw buildError('Invalid response from Gemini API', 500);
    }

    const text = candidates[0].content.parts[0].text.replace(/```json|```/g, '').trim();
    return JSON.parse(text);
};

export const analyzeTaste = async ({ topArtists = [], topTracks = [] }) => {
    if (!genAI) throw buildError('AI Service not configured', 503);

    const artistsStr = topArtists.slice(0, 15).map((a) => a.name).join(', ');

    const response = await genAI.models.generateContent({
        model: 'gemini-flash-lite-latest',
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: 'OBJECT',
                properties: {
                    mainGenres: { type: 'ARRAY', items: { type: 'STRING' } },
                    vibe: { type: 'STRING' },
                    era: { type: 'STRING' },
                },
            },
        },
        contents: [
            {
                role: 'user',
                parts: [{ text: `Analyze the musical taste of a user who listens to these artists: ${artistsStr}.` }],
            },
        ],
    });

    const candidates = response.response?.candidates || response.candidates;
    if (!candidates || !candidates[0] || !candidates[0].content) {
        throw buildError('Invalid response from Gemini API', 500);
    }

    let text = candidates[0].content.parts[0].text;
    text = text.replace(/```json|```/g, '').trim();
    return JSON.parse(text);
};

export const describePlaylist = async ({ name, tracks = [] }) => {
    if (!genAI) throw buildError('AI Service not configured', 503);

    const trackList = tracks.slice(0, 5).map((t) => `${t.name} - ${t.artist}`).join(', ');

    const response = await genAI.models.generateContent({
        model: 'gemini-flash-lite-latest',
        contents: [
            {
                role: 'user',
                parts: [{ text: `Write a short, catchy, 1-sentence description for a playlist named "${name}" containing songs like: ${trackList}. Language: Portuguese.` }],
            },
        ],
    });

    const candidates = response.response?.candidates || response.candidates;
    if (!candidates || !candidates[0] || !candidates[0].content) {
        throw buildError('Invalid response from Gemini API', 500);
    }

    return { description: candidates[0].content.parts[0].text.trim() };
};