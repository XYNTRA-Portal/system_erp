import { api } from "../api/axios";
import type { Warehouse, WarehouseCreate, WarehouseUpdate, ResponseMessage } from "../types/warehouse.type";

export const WarehousesService = {
    async getById(id: string): Promise<Warehouse> {
        const response = await api.get<Warehouse>("warehouses/by_id", { params: { id } });

        return response.data;
    },
    async getByCompany(): Promise<Warehouse[]> {
        const response = await api.get<Warehouse[]>("warehouses/by_company");

        return response.data;
    },
    async create(data: WarehouseCreate): Promise<ResponseMessage> {
        const response = await api.post<ResponseMessage>("warehouses/add", data);

        return response.data;
    },
    async update(data: WarehouseUpdate): Promise<ResponseMessage> {
        const response = await api.put<ResponseMessage>("warehouses/edit", data);

        return response.data;
    },
    async deactivate(id: string): Promise<ResponseMessage> {
        const response = await api.delete<ResponseMessage>("warehouses/desactivate", { params: { id } });

        return response.data;
    }
}