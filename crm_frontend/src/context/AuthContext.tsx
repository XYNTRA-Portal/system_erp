import { createContext, useCallback, useEffect, useContext, useState, type ReactNode } from "react";;
import { authService } from "../services/auth.service";
import { setApiAccessToken } from "../api/axios";
import type { User } from "../types/user.types";

type AuthContextType = {
    accessToken: string | null;
    user: User | null;
    companyId: string | null;
    authReady: boolean;
    setAccessToken: (token: string | null) => void;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [accessToken, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [authReady, setAuthready] = useState(false);

    const setAccessToken = useCallback((token: string | null) => {
        setApiAccessToken(token);
        setToken(token);

        if (!token) {
            setUser(null);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        const restoreSession = async () => {
            try {
                const response = await authService.refresh();

                if (!cancelled) {
                    setAccessToken(response.access_token);
                }
            } catch {
                if (!cancelled) {
                    setAccessToken(null);
                    setAuthready(true);
                }
            }
        };

        void restoreSession();

        return () => {
            cancelled = true;
        };
    }, [setAccessToken]);

    useEffect(() => {
        if (!accessToken) return;

        let cancelled = false;

        const loadUser = async () => {
            setAuthready(false);
            setUser(null);

            try {
                const data = await authService.me()

                if (!cancelled) {
                    setUser(data);
                }
            } catch {
                if (!cancelled) {
                    setAccessToken(null);
                }
            } finally {
                if (!cancelled) {
                    setAuthready(true);
                }
            }
        };

        void loadUser();

        return () => {
            cancelled = true;
        };
    }, [accessToken, setAccessToken]);

    const logout = async () => {
        try {
            await authService.logout();
        } finally {
            setAccessToken(null);
        }
    };

    return (
        <AuthContext.Provider value={{
            accessToken,
            user,
            companyId: user?.company_id ?? null,
            authReady,
            setAccessToken,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider")
    }

    return context;
};