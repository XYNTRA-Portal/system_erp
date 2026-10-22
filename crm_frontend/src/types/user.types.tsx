export interface User {
    id: string;
    company_id: string;
    first_name: string;
    last_name: string;
    email: string;
    is_active: boolean;
}

export interface UserCreate {
    company_id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

export interface UserUpdate {
    id: string;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    password?: string | null;
    is_active?: boolean | null;
}

export interface ResponseMessage {
    code: number;
    description: string;
}