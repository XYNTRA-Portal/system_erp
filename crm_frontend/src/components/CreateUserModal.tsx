import { User, Mail, Lock, Eye, EyeOff, X, UserPlus } from "lucide-react";
import type { UserCreate } from "../types/user.types";
import { useAuth } from "../context/AuthContext";
import React, { useState } from "react";
import { UsersService } from "../services/users.service";

interface CreateUSerModalProps {
    setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    onUserCreated: () => Promise<void>;
}

const CreateUSerModal = ({ setIsModalVisible, onUserCreated }: CreateUSerModalProps) => {

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formData, setFormData] = useState<Omit<UserCreate, "company_id">>({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
    });

    const { companyId } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "confirm_password") {
            setConfirmPassword(value);
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.password !== confirmPassword) {
            setError("Password does not match..");
            return;
        }

        if (!companyId) {
            setError("The companie is not valid.. :(");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const userData: UserCreate = {
                ...formData,
                company_id: companyId,
            };

            await UsersService.create(userData);
            await onUserCreated();
            
            setIsModalVisible(false);
        } catch (err) {
            setError("The user was not added. Verify data and try again..");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all duration-300 animate-in fade-in">
            <div className="relative w-full max-w-lg overflow-hidden bg-slate-900 bg-productos-bg rounded-2xl border border-slate-800 shadow-2xl transition-all transform scale-100">

                <div className="relative px-6 pt-6 pb-4 border-b border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            <UserPlus className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-wide">
                                Create User
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Insert data for register a new user
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsModalVisible(false)}
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

                        {/* First Name */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-300">First Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <User className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    name="first_name"
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                                    placeholder="Chris"
                                />
                            </div>
                        </div>

                        {/* Last Name */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-300">Last Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <User className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    name="last_name"
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                                    placeholder="Rose"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-300">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                                    placeholder="chris.rose@gmail.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-300">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    onChange={handleChange}
                                    value={formData.password}
                                    required
                                    className="w-full pl-9 pr-10 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-300">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirm_password"
                                    value={confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-9 pr-10 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-800/80 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsModalVisible(false)}
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
    )
}

export default CreateUSerModal;