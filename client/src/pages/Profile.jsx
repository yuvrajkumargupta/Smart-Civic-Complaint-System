import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/axios';
import { User, Lock, Mail, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const Profile = () => {
    // Get user from local storage initially
    const user = JSON.parse(localStorage.getItem('user')) || {};

    const [name, setName] = useState(user.name || '');
    const [email, setEmail] = useState(user.email || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (password && password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setLoading(true);
        try {
            const updateData = { name, email };
            if (password) updateData.password = password;

            const { data } = await API.put('/auth/profile', updateData);

            // Update local storage
            localStorage.setItem('user', JSON.stringify({ ...user, ...data.user }));

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error("Update Error:", error);
            setMessage({ type: 'error', text: error.response?.data?.message || "Failed to update profile" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
                <h1 className="text-3xl font-bold text-slate-800 mb-8 fade-in-up">Account Settings</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sidebar / User Card */}
                    <div className="md:col-span-1 fade-in-up delay-100">
                        <div className="bg-white rounded-xl shadow-soft border border-slate-100 p-6 text-center">
                            <div className="w-24 h-24 bg-brand-indigo text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                                {name.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">{name}</h2>
                            <p className="text-slate-500 text-sm mb-4">{user.role === 'admin' ? 'Administrator' : 'Citizen'}</p>
                            <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full">
                                Verified Account
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="md:col-span-2 fade-in-up delay-200">
                        <div className="bg-white rounded-xl shadow-soft border border-slate-100 p-8">
                            <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center">
                                <User className="w-5 h-5 mr-2 text-brand-indigo" />
                                Personal Details
                            </h3>

                            {message && (
                                <div className={`mb-6 p-4 rounded-lg flex items-center text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                    {message.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 focus:border-brand-indigo transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 focus:border-brand-indigo transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-6">
                                    <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center">
                                        <Lock className="w-5 h-5 mr-2 text-brand-indigo" />
                                        Security
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Leave blank to keep current"
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 focus:border-brand-indigo transition-all placeholder:text-slate-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Confirm new password"
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 focus:border-brand-indigo transition-all placeholder:text-slate-400"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-brand-indigo hover:bg-brand-blue text-white font-semibold py-2.5 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                        <span>Save Changes</span>
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
