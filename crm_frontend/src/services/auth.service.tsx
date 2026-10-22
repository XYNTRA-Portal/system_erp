import { api } from "../api/axios";
import type { User } from "../types/user.types";

interface TokenResponse {
    access_token: string;
    token_type: string;
}

export const authService = {
    async me(): Promise<User> {
        const response = await api.get<User>("auth/me");
        return response.data;
    },
    async refresh(): Promise<TokenResponse> {
        const response = await api.post<TokenResponse>("auth/refresh");
        return response.data;
    },
    async logout(): Promise<void> {
        await api.post("auth/logout");
    },
};