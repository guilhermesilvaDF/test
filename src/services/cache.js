/**
 * Simple cache service with TTL (Time To Live)
 * Stores API responses in memory to avoid duplicate requests
 */

class CacheService {
    constructor() {
        this.cache = new Map();
        this.defaultTTL = 5 * 60 * 1000; // 5 minutes in milliseconds
    }

    /**
     * Generate cache key from multiple parameters
     */
    generateKey(...params) {
        return params.join(':').toLowerCase();
    }

    /**
     * Get cached value if it exists and is not expired
     */
    get(key) {
        const cached = this.cache.get(key);

        if (!cached) {
            console.log('[Cache] MISS:', key);
            return null;
        }

        const now = Date.now();
        if (now > cached.expiry) {
            console.log('[Cache] EXPIRED:', key);
            this.cache.delete(key);
            return null;
        }

        console.log('[Cache] HIT:', key);
        return cached.value;
    }

    /**
     * Set cache value with optional custom TTL
     */
    set(key, value, ttl = this.defaultTTL) {
        const expiry = Date.now() + ttl;
        this.cache.set(key, { value, expiry });
        console.log('[Cache] SET:', key, 'expires in', ttl / 1000, 'seconds');
    }

    /**
     * Delete specific cache entry
     */
    delete(key) {
        this.cache.delete(key);
        console.log('[Cache] DELETE:', key);
    }

    /**
     * Clear all cache
     */
    clear() {
        this.cache.clear();
        console.log('[Cache] CLEARED');
    }

    /**
     * Get cache statistics
     */
    getStats() {
        const now = Date.now();
        const entries = Array.from(this.cache.entries());
        const valid = entries.filter(([, { expiry }]) => now <= expiry).length;

        return {
            total: this.cache.size,
            valid,
            expired: this.cache.size - valid
        };
    }

    /**
     * Clean expired entries
     */
    cleanup() {
        const now = Date.now();
        const keysToDelete = [];

        for (const [key, { expiry }] of this.cache.entries()) {
            if (now > expiry) {
                keysToDelete.push(key);
            }
        }

        keysToDelete.forEach(key => this.cache.delete(key));
        console.log('[Cache] Cleaned up', keysToDelete.length, 'expired entries');

        return keysToDelete.length;
    }
}

// Create singleton instance
const cacheService = new CacheService();

// Clean up expired entries every 10 minutes
setInterval(() => {
    cacheService.cleanup();
}, 10 * 60 * 1000);

export default cacheService;
