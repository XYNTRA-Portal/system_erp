import CreateUSerModal from '../components/CreateUserModal';
import EditUserModal from '../components/EditUserModal';
import { UsersService } from '../services/users.service';
import { useAuth } from '../context/AuthContext';
import type { User } from '../types/user.types';
import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, ShieldCheck } from 'lucide-react';
import { RoleService } from '../services/roles.service';
import type { Role } from '../types/role.types';
import ManageUserRolesModal from '../components/ManageUserRolesModal';

const UsersPage = () => {
    const [deactivatingId, setDeactivatingId] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [rolesByUser, setRolesByUser] = useState<Record<string, Role[]>>({});
    const [rolesModalUser, setRolesModalUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const { companyId, authReady } = useAuth();

    useEffect(() => {
        let cancelled = false;

        const loadUsers = async () => {
            if (!authReady) return;

            if (!companyId) {
                setUsers([]);
                setLoading(false);
                setError("There is not a company.. .(");
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const data = await UsersService.getByCompany();

                if (!cancelled) {
                    setUsers(data);
                }
            } catch {
                if (!cancelled) {
                    setError("It's not possible get the users.. :(")
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void loadUsers();

        return () => {
            cancelled = true;
        };

    }, [companyId, authReady]);

    useEffect(() => {
        let cancelled = false;

        const loadUserRoles = async () => {
            if (!authReady || users.length === 0) {
                setRolesByUser({});
                return;
            }

            const entries = await Promise.all(
                users.map(async (user) => {
                    try {
                        const roles = await RoleService.getByUser(user.id);
                        return [user.id, roles] as const;
                    } catch {
                        return [user.id, [] as Role[]] as const;
                    }
                })
            );

            if (!cancelled) {
                setRolesByUser(Object.fromEntries(entries));
            }
        };

        void loadUserRoles();

        return () => {
            cancelled = true;
        };
    }, [users, authReady]);

    const handleDesactivate = async (user: User) => {
        if (!window.confirm(`¿You wanna remove the user ${user.first_name} ${user.last_name}?`)) {
            return;
        }

        setDeactivatingId(user.id);
        setError(null);

        try {
            await UsersService.deactivate(user.id);

            setUsers((current) => current.map((item) =>
                item.id === user.id ? { ...item, is_active: false } : item
            ));
        } catch {
            setError("It's not possible remove the user.. :(");
        } finally {
            setDeactivatingId(null);
        }
    };

    const fetchUsers = async () => {
        setError(null);

        try {
            const data = await UsersService.getByCompany();
            setUsers(data);
        } catch {
            setError("It's not possible to load the users..");
            throw new Error("Failed to refresh users");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white">Users Module</h2>
                    <p className="text-xs text-slate-400">Users with access management</p>
                </div>
                <button onClick={() => { setIsModalVisible(true) }} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 flex items-center space-x-2 cursor-pointer">
                    <Plus className="w-4 h-4" />
                    <span>New User</span>
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-800/50 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800">
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-4">Acces</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">State</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-400">
                                        Loading users ...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-400">
                                        There are not users for this company
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-slate-800/30 transition-colors"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-full bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold text-xs">
                                                    {user.first_name.charAt(0).toUpperCase()}
                                                    {user.last_name.charAt(0).toUpperCase()}
                                                </div>

                                                <div>
                                                    <div className="font-semibold text-slate-100">
                                                        {user.first_name}
                                                    </div>
                                                    <div className="text-xs text-slate-400">
                                                        {user.last_name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <div className='flex flex-wrap gap-1.5'>
                                                {(rolesByUser[user.id] ?? []).length > 0 ? (
                                                    rolesByUser[user.id].map((role) => (
                                                        <span key={role.id} className='px-2.5 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-lg text-xs font-medium'>
                                                            {role.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-slate-500">No Roles</span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="p-4 text-xs text-slate-400">
                                            {user.email}
                                        </td>

                                        <td className="p-4">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.is_active
                                                    ? "bg-emerald-500/10 text-emerald-400"
                                                    : "bg-rose-500/10 text-rose-400"
                                                    }`}
                                            >
                                                {user.is_active ? "Activo" : "Inactivo"}
                                            </span>
                                        </td>

                                        <td className="p-4 text-right">
                                            <button
                                                type="button"
                                                title="Administrar roles"
                                                onClick={() => setRolesModalUser(user)}
                                                className="p-1.5 text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer"
                                            >
                                                <ShieldCheck className="w-4 h-4" />
                                            </button>
                                            <button
                                                type='button'
                                                title='Edit User'
                                                onClick={() => setEditingUser(user)}
                                                className='p-1.5 text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer'
                                            >
                                                <Pencil className='w-4 h-4' />
                                            </button>
                                            <button
                                                type="button"
                                                title="Desactivar usuario"
                                                disabled={!user.is_active || deactivatingId === user.id}
                                                onClick={() => void handleDesactivate(user)}
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
            {isModalVisible && (
                <CreateUSerModal setIsModalVisible={setIsModalVisible} onUserCreated={fetchUsers} />
            )}
            {editingUser && (
                <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} onUserUpdated={fetchUsers} />
            )}
            {rolesModalUser && (
                <ManageUserRolesModal 
                    user={rolesModalUser} 
                    onClose={() => setRolesModalUser(null)} 
                    onRolesChanged={async () => { 
                        const data = await UsersService.getByCompany(); 
                        setUsers(data); 
                    }} 
                />
            )}
        </div>
    )
}

export default UsersPage;