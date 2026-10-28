import { api } from "../api/axios";
import type { User, UserCreate, UserUpdate, ResponseMessage } from "../types/user.types";

export const UsersService = {
    async getById(id: string): Promise<User> {
        
        const response = await api.get<User>("users/by_id", {
            params: { id },
        });

        return response.data;
    },
    async getByCompany(): Promise<User[]> {

        const response = await api.get<User[]>("users/by_companies");

        return response.data;
    },
    async create(data: UserCreate): Promise<ResponseMessage> {
       
        const response = await api.post<ResponseMessage>(
            "users/add",
            data
        );

        return response.data;
    },
    async update(data: UserUpdate): Promise<ResponseMessage> {
        
        const response = await api.put<ResponseMessage>(
            "users/edit",
            data
        );

        return response.data;
    },
    async deactivate(id: string): Promise<ResponseMessage> {
        
        const response = await api.delete<ResponseMessage>(
            "users/desactivate",
            { params: { id } }
        );

        return response.data;
    }
};