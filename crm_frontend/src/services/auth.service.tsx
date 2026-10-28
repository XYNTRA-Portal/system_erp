import { api } from "../api/axios";
import type { User } from "../types/user.types";

interface LoginRequest {
    email: string;
    password: string;
}

interface TokenResponse {
    access_token: string;
    token_type: string;
}

let refreshPromise: Promise<TokenResponse> | null = null;

export const authService = {
    async login(data: LoginRequest): Promise<TokenResponse> {
        const response = await api.post<TokenResponse>("auth/login", data);
        return response.data;
    },
    async me(): Promise<User> {
        const response = await api.get<User>("auth/me");
        return response.data;
    },
    async refresh(): Promise<TokenResponse> {
        if (!refreshPromise) {
            refreshPromise = api
                .post<TokenResponse>("auth/refresh")
                .then((response) => response.data)
                .finally(() => {
                    refreshPromise = null;
                });
        }
        return refreshPromise;
    },
    async logout(): Promise<void> {
        await api.post("auth/logout");
    },
};