import { api } from "../api/axios";
import type { Role, RoleAssigmentResponse } from "../types/role.types";

export const RoleService = {
    async getByCompany(companyId: string): Promise<Role[]> {
        const response = await api.get<Role[]>("roles/by_companies", {
            params: { company_id: companyId },
        });

        return response.data;
    },
    async getByUser(userId: string): Promise<Role[]> {
        const response = await api.get<Role[]>(`roles/users/${userId}`);

        return response.data;
    },
    async assign(userId: string, roleId: string): Promise<RoleAssigmentResponse> {
        const response = await api.post<RoleAssigmentResponse>(`roles/users/${userId}/assign/${roleId}`);

        return response.data
    },
    async remove(userId: string, roleId: string): Promise<RoleAssigmentResponse> {
        const response = await api.delete<RoleAssigmentResponse>(`roles/users/${userId}/remove/${roleId}`);

        return response.data;
    },
}