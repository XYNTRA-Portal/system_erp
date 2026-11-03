import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import type { Warehouse } from "../types/warehouse.type";
import { WarehousesService } from "../services/warehouses.service";
import { Plus, Trash2, Pencil } from "lucide-react";

const WarehousesPage = () => {
    const [addingUser, setAddingUser] = useState<string | null>(null);
    const [editingUser, setEditingUser] = useState<Warehouse | null>(null);
    const [deactivatingId, setDeactivatingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [loading, setLoading] = useState(true);
    const { companyId, authReady } = useAuth();

    useEffect(() => {
        let cancelled = false;

        const loadWarehouses = async () => {
            if (!authReady) return;

            if (!companyId) {
                setWarehouses([]);
                setLoading(false);
                setError("There is not a company.. :(");
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const data = await WarehousesService.getByCompany();

                if (!cancelled) {
                    setWarehouses(data);
                }
            } catch {
                if (!cancelled) {
                    setError("It's not possible to get warehouses..")
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void loadWarehouses();

        return () => {
            cancelled = true;
        };
    }, [companyId, authReady]);

    const handleDesactivate = async (warehouse: Warehouse) => {
        if (!window.confirm(`¿You wanna remove the warehouse ${warehouse.name}?`)) {
            return;
        }

        setDeactivatingId(warehouse.id);
        setError(null);

        try {
            await WarehousesService.deactivate(warehouse.id)

            setWarehouses((current) => current.map((item) =>
                item.id === warehouse.id ? { ...item, is_active: false } : item
            ));
        } catch {
            setError("It's not possible remove the warehouse.. ");
        } finally {
            setDeactivatingId(null);
        }
    };

    const fetchUsers = async () => {
        setError(null);

        try {
            const data = await WarehousesService.getByCompany();
            setWarehouses(data);
        } catch {
            setError("It's not possible to load the users..");
            throw new Error("Failed to refresh warehouses")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white">Warehouses Module</h2>
                    <p className="text-xs text-slate-400">Registered warehouses by the company</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 flex items-center space-x-2 cursor-pointer">
                    <Plus className="w-4 h-4" />
                    <span>New Warehouse</span>
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-800/50 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Address</th>
                                <th className="p-4">Code</th>
                                <th className="p-4">State</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-400">
                                        Loading warehouses ...
                                    </td>
                                </tr>
                            ) : warehouses.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-400">
                                        There are not warehouses for this company
                                    </td>
                                </tr>
                            ) : (
                                warehouses.map((warehouse) => (
                                    <tr
                                        key={warehouse.id}
                                        className="hover:bg-slate-800/30 transition-colors"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                {/* <div className="w-9 h-9 rounded-full bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold text-xs">
                                                    {warehouse.name.charAt(0).toUpperCase()}
                                                </div> */}
                                                <div>
                                                    <div className="font-semibold text-slate-100">
                                                        {warehouse.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4 text-xs text-slate-400">
                                            {warehouse.address}
                                        </td>

                                        <td className="p-4 text-xs text-slate-400">
                                            {warehouse.code}
                                        </td>

                                        <td className="p-4">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${warehouse.is_active
                                                    ? "bg-emerald-500/10 text-emerald-400"
                                                    : "bg-rose-500/10 text-rose-400"
                                                    }`}
                                            >
                                                {warehouse.is_active ? "Activo" : "Inactivo"}
                                            </span>
                                        </td>

                                        <td className="p-4 text-right">
                                            <button
                                                type='button'
                                                title='Edit User'
                                                onClick={() => setEditingUser(warehouse)}
                                                className='p-1.5 text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer'
                                            >
                                                <Pencil className='w-4 h-4' />
                                            </button>
                                            <button
                                                type="button"
                                                title="Desactivar usuario"
                                                disabled={!warehouse.is_active || deactivatingId === warehouse.id}
                                                onClick={() => void handleDesactivate(warehouse)}
                                                className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default WarehousesPage;