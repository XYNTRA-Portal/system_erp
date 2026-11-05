import { Warehouse, X, Save, Road, QrCode } from "lucide-react";
import type { WarehouseCreate } from "../types/warehouse.type";
import { useAuth } from "../context/AuthContext";
import React, { useState } from "react";
import { WarehousesService } from "../services/warehouses.service";

interface CreateWarehouseModalProps {
    onClose: () => void;
    onWarehouseCreated: () => Promise<void>;
}

const CreateWarehouseModal = ({ onClose, onWarehouseCreated }: CreateWarehouseModalProps) => {
    const [formData, setFormData] = useState<Omit<WarehouseCreate, "company_id">>({
        name: "",
        address: "",
        code: ""
    })

    const { companyId } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!companyId) {
            setError("The company is not valid.. ");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const warehouseData: WarehouseCreate = {
                ...formData,
                company_id: companyId
            }

            console.log(warehouseData)

            await WarehousesService.create(warehouseData);
            await onWarehouseCreated();

            onClose();
        } catch (err) {
            setError("The warehouse was not added. Verify data.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all duration-300 animate-in fade-in">
            <div className="relative w-full max-w-lg overflow-hidden bg-slate-900 bg-productos-bg rounded-2xl border border-slate-800 shadow-2xl transition-all transform scale-100">

                <div className="relative px-6 pt-6 pb-4 border-b border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            <Warehouse className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-wide">
                                Create Warehouse
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Insert data for register a new warehouse
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => onClose()}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-full transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        aria-label="Cerrar modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {error && (
                    <p role="alert" className="text-sm text-red-500 mx-6 mt-4" >{error}</p>
                )}

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* Name */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-300">Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Warehouse className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                                    placeholder="Main warehouse"
                                />
                            </div>
                        </div>

                        {/* Code */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-300">Code</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <QrCode className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    name="code"
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                                    placeholder="010101"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-300">Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Road className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    name="address"
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                                    placeholder="Street #000 Town"
                                />
                            </div>
                        </div>

                        
                    </div>

                    {/* Botones de acción */}
                    <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-800/80 mt-6">
                        <button
                            type="button"
                            onClick={() => onClose()}
                            className="px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-all duration-200 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/35 transition-all duration-200 cursor-pointer flex items-center space-x-2"
                        >
                            <span>Accept</span>
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default CreateWarehouseModal;