/**
 * Database-agnostic playlist utilities
 * Works with both SQLite (tracks as String) and PostgreSQL (tracks as Json)
 */

/**
 * Normalize tracks data when reading from database
 * SQLite: tracks is a stringified JSON → parse it
 * PostgreSQL: tracks is already a JSON object → return as-is
 */
export const normalizeTracks = (tracks) => {
    // If it's already an object/array, return as-is (PostgreSQL)
    if (typeof tracks === 'object') {
        return tracks;
    }

    // If it's a string, parse it (SQLite)
    if (typeof tracks === 'string') {
        try {
            return JSON.parse(tracks);
        } catch (e) {
            console.error('Failed to parse tracks:', e);
            return [];
        }
    }

    // Fallback
    return [];
};

/**
 * Prepare tracks data for saving to database
 * SQLite: convert to JSON string
 * PostgreSQL: keep as object
 * 
 * Note: When using PostgreSQL with Json type, Prisma handles the conversion automatically.
 * This helper is for explicit SQLite handling if needed.
 */
export const prepareTracks = (tracks) => {
    // For SQLite compatibility (tracks is a String column): Always stringify
    if (typeof tracks === 'object') {
        return JSON.stringify(tracks);
    }
    return tracks;
};

/**
 * Normalize a single playlist object
 */
export const normalizePlaylist = (playlist) => {
    if (!playlist) return null;

    return {
        ...playlist,
        tracks: normalizeTracks(playlist.tracks)
    };
};

/**
 * Normalize an array of playlist objects
 */
export const normalizePlaylists = (playlists) => {
    if (!Array.isArray(playlists)) return [];

    return playlists.map(normalizePlaylist);
};
