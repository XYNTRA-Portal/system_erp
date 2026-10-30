export interface Role {
    id: string;
    company_id: string;
    name: string;
    description: string;
}

export interface RoleAssigmentResponse {
    code: number;
    description: string;
}