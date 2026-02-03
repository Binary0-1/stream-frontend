/**
 * Static authentication utilities.
 * Note: Access tokens are stored in memory (React state)
 * Refresh tokens are handled via HttpOnly cookies by the browser.
 */

export const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// These functions are mostly for debugging or local UI state now
// since the actual security is handled by memory and cookies.
export const isUserLoggedIn = (user: string | null) => !!user;
