import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Loader2, TrendingUp, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const Transparency = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Determine if we are using the public/local network URL or standard localhost
                const { data } = await API.get('/public/stats');
                setStats(data.stats);
            } catch (error) {
                console.error("Failed to fetch public stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-brand-indigo animate-spin" />
        </div>
    );

    if (!stats) return <div className="text-center p-10">Failed to load data.</div>;

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <div className="bg-brand-indigo text-white py-20 mt-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">Civic Transparency Portal</h1>
                    <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
                        We believe in open governance. View real-time statistics on how we are handling civic issues in your community.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 pb-12 max-w-6xl">

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 flex items-center">
                        <div className="p-4 bg-indigo-50 rounded-full mr-4 text-brand-indigo">
                            <TrendingUp className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Complaints</p>
                            <h3 className="text-3xl font-bold text-slate-800">{stats.total}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 flex items-center">
                        <div className="p-4 bg-emerald-50 rounded-full mr-4 text-emerald-600">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Resolved</p>
                            <h3 className="text-3xl font-bold text-slate-800">{stats.resolved}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 flex items-center">
                        <div className="p-4 bg-amber-50 rounded-full mr-4 text-amber-600">
                            <Clock className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Pending / Active</p>
                            <h3 className="text-3xl font-bold text-slate-800">{stats.pending}</h3>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Chart */}
                    <div className="bg-white p-8 rounded-xl shadow-soft border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-800 mb-6">Issues by Category</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.categories}>
                                    <XAxis dataKey="_id" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={{ fill: '#f1f5f9' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                        {stats.categories.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Public Activity */}
                    <div className="bg-white p-8 rounded-xl shadow-soft border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-800 mb-6">Recent Activity</h3>
                        <div className="space-y-4">
                            {stats.recent.map((c) => (
                                <div key={c._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div className="flex items-center">
                                        <div className={`w-2 h-2 rounded-full mr-3
                                            ${c.status === 'resolved' ? 'bg-emerald-500' : 'bg-amber-500'}
                                        `}></div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-700">{c.title}</p>
                                            <p className="text-xs text-slate-500 capitalize">{c.category} • {c.location || 'Unknown Location'}</p>
                                        </div>
                                    </div>
                                    {c.status === 'resolved' ?
                                        <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">Resolved</span> :
                                        <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded">Active</span>
                                    }
                                </div>
                            ))}
                            {stats.recent.length === 0 && <p className="text-slate-500">No recent activity.</p>}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Transparency;
