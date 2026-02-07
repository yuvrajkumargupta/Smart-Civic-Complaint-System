import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import API from '../api/axios';
import { Users, Mail, Shield, Calendar } from 'lucide-react';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await API.get('/auth/users');
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
                <p className="text-slate-500 mt-1">View and manage registered citizens.</p>
            </div>

            <div className="bg-white rounded-xl shadow-soft border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase font-semibold">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map(user => (
                            <tr key={user._id} className="hover:bg-slate-50/50">
                                <td className="p-4 font-medium text-slate-800 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    {user.name}
                                </td>
                                <td className="p-4 text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-3 h-3 text-slate-400" />
                                        {user.email}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize border ${user.role === 'admin'
                                            ? 'bg-purple-50 text-purple-600 border-purple-100'
                                            : 'bg-blue-50 text-blue-600 border-blue-100'
                                        }`}>
                                        <Shield className="w-3 h-3 mr-1" />
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-500 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3 h-3 text-slate-400" />
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && users.length === 0 && (
                    <div className="p-8 text-center text-slate-400">No users found.</div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminUsers;
