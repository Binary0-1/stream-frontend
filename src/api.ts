import { getMemoryToken, setMemoryToken } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = getMemoryToken();

    const headers = new Headers(options.headers);
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        // 401 Unauthorized - Token might be expired
        if (response.status === 401) {
            if (isRefreshing) {
                // If already refreshing, wait for it to finish
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((newToken) => {
                        const nextHeaders = new Headers(options.headers);
                        nextHeaders.set('Authorization', `Bearer ${newToken}`);
                        return fetch(`${API_URL}${endpoint}`, { ...options, headers: nextHeaders });
                    })
                    .then((res) => res.json());
            }

            isRefreshing = true;

            try {
                // Attempt to get a new token via HttpOnly Cookie (credentials: 'include')
                const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });

                if (refreshResponse.ok) {
                    const { accessToken } = await refreshResponse.json();

                    // Update the memory store
                    setMemoryToken(accessToken);
                    processQueue(null, accessToken);

                    // Retry original request with new token
                    const nextHeaders = new Headers(options.headers);
                    nextHeaders.set('Authorization', `Bearer ${accessToken}`);
                    const retryResponse = await fetch(`${API_URL}${endpoint}`, { ...options, headers: nextHeaders });
                    return retryResponse.json();
                } else {
                    throw new Error('Refresh failed');
                }
            } catch (authError) {
                processQueue(authError, null);
                // Redirect to login if refresh fails
                window.location.href = '/login';
                throw authError;
            } finally {
                isRefreshing = false;
            }
        }

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
            throw new Error(error.message || 'API request failed');
        }

        return response.json();
    } catch (error) {
        throw error;
    }
}
