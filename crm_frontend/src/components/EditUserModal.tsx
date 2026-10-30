
import { useState, type FormEvent } from "react";
import { User, Mail, X, Save } from "lucide-react";
import { UsersService } from "../services/users.service";
import type { User as UserType, UserUpdate } from "../types/user.types";

interface EditUserModalProps {
    user: UserType;
    onClose: () => void;
    onUserUpdated: () => Promise<void>;
}

const inputClass =
    "w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

const EditUserModal = ({ user, onClose, onUserUpdated }: EditUserModalProps) => {
    const [firstName, setFirstName] = useState(user.first_name);
    const [lastName, setLastName] = useState(user.last_name);
    const [email, setEmail] = useState(user.email);
    const [isActive, setIsActive] = useState(user.is_active);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        const data: UserUpdate = {
            id: user.id,
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            email: email.trim(),
            is_active: isActive,
            ...(password.trim() ? { password } : {}),
        };

        try {
            await UsersService.update(data);
            await onUserUpdated();
            onClose();
        } catch {
            setError("No fue posible actualizar el usuario. Verifica los datos y tus permisos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl">
                <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-white">Edit user</h3>
                        <p className="text-xs text-slate-400 mt-1">
                            Update data and account status.
                        </p>
                    </div>
                    <button type="button" onClick={onClose} aria-label="Cerrar modal"
                        className="p-2 text-slate-400 hover:text-white cursor-pointer rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {error && <p role="alert" className="text-sm text-red-400 px-6 pt-4">{error}</p>}

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <label className="block space-y-1.5">
                        <span className="text-xs font-medium text-slate-300">Name</span>
                        <span className="relative block">
                            <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                            <input className={`${inputClass} pl-9`} value={firstName}
                                onChange={(e) => setFirstName(e.target.value)} required />
                        </span>
                    </label>

                    <label className="block space-y-1.5">
                        <span className="text-xs font-medium text-slate-300">Last Name</span>
                        <input className={inputClass} value={lastName}
                            onChange={(e) => setLastName(e.target.value)} required />
                    </label>

                    <label className="block space-y-1.5">
                        <span className="text-xs font-medium text-slate-300">Email</span>
                        <span className="relative block">
                            <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                            <input className={`${inputClass} pl-9`} type="email" value={email}
                                onChange={(e) => setEmail(e.target.value)} required />
                        </span>
                    </label>

                    <label className="block space-y-1.5">
                        <span className="text-xs font-medium text-slate-300">New password (optional)</span>
                        <input className={inputClass} type="password" value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password" placeholder="Leave empty to save the actual password" />
                    </label>

                    <label className="flex items-center gap-3 rounded-xl border border-slate-800 p-3">
                        <input type="checkbox" checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="accent-indigo-500" />
                        <span className="text-sm text-slate-200">Active user</span>
                    </label>

                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2.5 text-sm text-slate-300 bg-slate-800 rounded-xl cursor-pointer hover:bg-slate-700 duration-300">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}
                            className="cursor-pointer px-5 py-2.5 text-sm text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl disabled:opacity-50 flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            {loading ? "Saving..." : "Save data"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
