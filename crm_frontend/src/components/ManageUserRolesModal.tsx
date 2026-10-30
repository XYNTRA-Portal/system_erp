
import { useCallback, useEffect, useState } from "react";
import { ShieldCheck, X, Plus, Trash2 } from "lucide-react";
import { RoleService } from "../services/roles.service";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types/role.types";
import type { User } from "../types/user.types";

interface ManageUserRolesModalProps {
    user: User;
    onClose: () => void;
    onRolesChanged: () => void;
}

const ManageUserRolesModal = ({
    user,
    onClose,
    onRolesChanged,
}: ManageUserRolesModalProps) => {
    const { companyId } = useAuth();
    const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
    const [assignedRoles, setAssignedRoles] = useState<Role[]>([]);
    const [selectedRoleId, setSelectedRoleId] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const loadRoles = useCallback(async () => {
        if (!companyId) {
            setError("The company is not validate");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const [companyRoles, userRoles] = await Promise.all([
                RoleService.getByCompany(companyId),
                RoleService.getByUser(user.id),
            ]);

            setAvailableRoles(companyRoles);
            setAssignedRoles(userRoles);
            setSelectedRoleId("");
        } catch {
            setError("Can't get the roles, check your permissions");
        } finally {
            setLoading(false);
        }
    }, [companyId, user.id]);

    useEffect(() => {
        void loadRoles();
    }, [loadRoles]);

    const rolesToAssign = availableRoles.filter(
        (role) => !assignedRoles.some((assigned) => assigned.id === role.id)
    );

    const handleAssign = async () => {
        if (!selectedRoleId) return;

        setSaving(true);
        setError("");

        try {
            await RoleService.assign(user.id, selectedRoleId);
            await loadRoles();
            onRolesChanged();
        } catch {
            setError("You must be admministrator to assign roles");
        } finally {
            setSaving(false);
        }
    };

    const handleRemove = async (role: Role) => {
        if (!window.confirm(`¿Remove "${role.name}" role of ${user.first_name}?`)) {
            return;
        }

        setSaving(true);
        setError("");

        try {
            await RoleService.remove(user.id, role.id);
            await loadRoles();
            onRolesChanged();
        } catch {
            setError("You must be administrator to remove roles");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl">
                <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Manage Roles</h3>
                            <p className="text-xs text-slate-400 mt-1">
                                {user.first_name} {user.last_name}
                            </p>
                        </div>
                    </div>

                    <button type="button" onClick={onClose}
                        aria-label="Cerrar modal"
                        className="cursor-pointer p-2 text-slate-400 hover:text-white rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {error && (
                        <p role="alert" className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-300">
                            {error}
                        </p>
                    )}

                    {loading ? (
                        <p className="text-sm text-slate-400">Loading roles...</p>
                    ) : (
                        <>
                            <section className="space-y-3">
                                <h4 className="text-sm font-semibold text-slate-200">
                                    Assigned roles
                                </h4>

                                {assignedRoles.length === 0 ? (
                                    <p className="text-sm text-slate-500">
                                        This user is not assigned with any role.
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {assignedRoles.map((role) => (
                                            <div key={role.id}
                                                className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-100">{role.name}</p>
                                                    <p className="text-xs text-slate-500">{role.description}</p>
                                                </div>
                                                <button type="button"
                                                    title={`Remove rol ${role.name}`}
                                                    disabled={saving}
                                                    onClick={() => void handleRemove(role)}
                                                    className="cursor-pointer p-2 text-slate-500 hover:text-rose-400 disabled:opacity-40">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            <section className="space-y-3 border-t border-slate-800 pt-5">
                                <h4 className="text-sm font-semibold text-slate-200">
                                    Assign a role
                                </h4>

                                {rolesToAssign.length === 0 ? (
                                    <p className="text-sm text-slate-500">
                                        There are not roles to assign
                                    </p>
                                ) : (
                                    <div className="flex gap-2">
                                        <select value={selectedRoleId}
                                            onChange={(event) => setSelectedRoleId(event.target.value)}
                                            className="cursor-pointer min-w-0 flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500">
                                            <option value="">Choose a role</option>
                                            {rolesToAssign.map((role) => (
                                                <option key={role.id} value={role.id}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </select>

                                        <button type="button"
                                            onClick={() => void handleAssign()}
                                            disabled={!selectedRoleId || saving}
                                            className="cursor-pointer flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-40">
                                            <Plus className="w-4 h-4" />
                                            Assign
                                        </button>
                                    </div>
                                )}
                            </section>
                        </>
                    )}

                    <div className="flex justify-end border-t border-slate-800 pt-4">
                        <button type="button" onClick={onClose}
                            className="cursor-pointer rounded-xl bg-slate-800 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-700">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageUserRolesModal;
