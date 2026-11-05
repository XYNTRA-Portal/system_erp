export interface Warehouse {
    id: string;
    company_id: string;
    name: string;
    code: string;
    address: string;
    is_active: boolean;
}

export interface WarehouseCreate {
    company_id: string | null;
    name: string;
    code: string;
    address: string;
}

export interface WarehouseUpdate {
    id: string;
    name?: string | null;
    code?: string | null;
    address?: string | null;
    is_active?: boolean | null;
}

export interface ResponseMessage {
    code: number;
    description: string;
}