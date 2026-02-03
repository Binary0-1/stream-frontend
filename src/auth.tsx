import * as React from 'react';
import { useEffect, useMemo, useState, useCallback} from 'react';

export interface AuthContext {
    isAuthenticated: boolean;
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    user: string | null;
    setUser: (user: string | null) => void;
    logout: () => void;
}

const AuthContext = React.createContext<AuthContext | null>(null);

let memoryToken: string | null = null;
export const getMemoryToken = () => memoryToken;
export const setMemoryToken = (token: string | null) => {
    memoryToken = token;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [accessToken, _setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<string | null>(null);
    const isAuthenticated = !!accessToken;

    const setAccessToken = useCallback((token: string | null) => {
        setMemoryToken(token);
        _setAccessToken(token);
    }, []);

    const logout = useCallback(async () => {
        setAccessToken(null);
        setUser(null);
    }, [setAccessToken]);

    useEffect(() => {
        const initAuth = async () => {
            alert("not even being fired")
            try {
                const response = await fetch('/auth/refresh', { method: 'POST' });
                if (response.ok) {
                    const { accessToken, userEmail } = await response.json();
                    setAccessToken(accessToken);
                    setUser(userEmail);
                }
            } catch (e) {
                console.error('Initial silent refresh failed', e);
            }
        };
        initAuth();
    }, [setAccessToken]);

    const contextValue = useMemo(
        () => ({
            isAuthenticated,
            accessToken,
            setAccessToken,
            user,
            setUser,
            logout,
        }),
        [isAuthenticated, accessToken, setAccessToken, user, logout]
    );

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
