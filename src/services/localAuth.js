/**
 * Local Authentication Service
 * Manages user authentication using localStorage
 */

const USER_KEY = 'music_horizon_user';

/**
 * Create a new local account
 * @param {string} name - User's name
 * @param {string} email - User's email
 * @returns {Object} User object
 */
export const signup = (name, email) => {
    const user = {
        name,
        email,
        createdAt: new Date().toISOString(),
    };

    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
};

/**
 * Login with email (simplified - no password for MVP)
 * @param {string} email - User's email
 * @returns {Object|null} User object or null if not found
 */
export const login = (email) => {
    const user = getCurrentUser();

    if (user && user.email === email) {
        return user;
    }

    return null;
};

/**
 * Logout current user
 */
export const logout = () => {
    localStorage.removeItem(USER_KEY);
};

/**
 * Get current logged-in user
 * @returns {Object|null} User object or null
 */
export const getCurrentUser = () => {
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
    return getCurrentUser() !== null;
};

/**
 * Update user information
 * @param {Object} updates - Fields to update
 * @returns {Object|null} Updated user object
 */
export const updateUser = (updates) => {
    const user = getCurrentUser();

    if (!user) return null;

    const updatedUser = { ...user, ...updates };
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

    return updatedUser;
};
