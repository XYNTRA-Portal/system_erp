import { api } from "../api/axios";
import type { User } from "../types/user.types";

interface TokenResponse {
    access_token: string;
    token_type: string;
}

let refreshPromise: Promise<TokenResponse> | null = null;

export const authService = {
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