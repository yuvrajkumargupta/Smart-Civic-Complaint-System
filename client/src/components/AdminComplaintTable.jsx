import React, { useState } from 'react';
import {
    FileText,
    Filter,
    MoreHorizontal,
    AlertCircle,
    CheckCircle,
    Clock,
    Search,
    ChevronDown,
    Eye,
    Zap
} from 'lucide-react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AdminComplaintTable = ({ complaints = [], onStatusUpdate }) => {
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [updatingId, setUpdatingId] = useState(null);
    const navigate = useNavigate();

    const filteredComplaints = complaints.filter(c => {
        const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
        const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c._id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleStatusChange = async (id, newStatus) => {
        setUpdatingId(id);
        try {
            await API.patch(`/complaints/${id}/status`, { status: newStatus });
            if (onStatusUpdate) onStatusUpdate(); // Refresh parent data
        } catch (error) {
            alert("Failed to update status");
        } finally {
            setUpdatingId(null);
        }
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            pending: 'bg-amber-100 text-amber-700 border-amber-200 shadow-sm shadow-amber-100',
            in_progress: 'bg-blue-100 text-blue-700 border-blue-200 shadow-sm shadow-blue-100',
            resolved: 'bg-emerald-100 text-emerald-700 border-emerald-200 shadow-sm shadow-emerald-100'
        };

        const icons = {
            pending: AlertCircle,
            in_progress: Clock,
            resolved: CheckCircle
        };

        const Icon = icons[status] || AlertCircle;

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${styles[status]} transition-transform hover:scale-105`}>
                <Icon className="w-3 h-3 mr-1.5" />
                {status.replace('_', ' ')}
            </span>
        );
    };

    return (

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[600px] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Header Section */}
            <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                    <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Recent Complaints</h2>
                        <p className="text-xs text-slate-400 font-medium">Manage and track reported issues</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search ID or Title..."
                            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-full sm:w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            className="pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer text-slate-600 font-medium"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="overflow-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/80 text-slate-500 text-[11px] uppercase tracking-wider font-semibold sticky top-0 z-10 backdrop-blur-sm border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4">Complaint ID</th>
                            <th className="px-6 py-4">Priority</th>
                            <th className="px-6 py-4">Details</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Timeline</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredComplaints.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="p-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                        <div className="bg-slate-50 p-4 rounded-full mb-3">
                                            <Search className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <p className="font-medium">No complaints found</p>
                                        <p className="text-xs mt-1">Try adjusting your filters</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredComplaints.map((c) => (
                                <tr key={c._id} className="hover:bg-indigo-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                                            #{c._id.slice(-6).toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {c.priority && c.priority !== 'medium' ? (
                                            <div className={`px-2 py-1 inline-flex rounded-lg text-[10px] font-bold uppercase tracking-wider items-center shadow-sm
                                                ${c.priority === 'urgent' || c.priority === 'high' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-slate-50 text-slate-500 border border-slate-100'}
                                            `}>
                                                <Zap className="w-3 h-3 mr-1" />
                                                {c.priority}
                                            </div>
                                        ) : (
                                            <span className="text-slate-300 text-xs font-medium pl-2">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <div className="font-semibold text-slate-800 truncate cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => navigate(`/complaint/${c._id}`)} title={c.title}>
                                            {c.title}
                                        </div>
                                        <div className="text-xs text-slate-500 truncate mt-1 pr-4">{c.description}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 text-slate-600 capitalize border border-slate-100">
                                            {c.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col text-xs">
                                            <span className="text-slate-700 font-medium whitespace-nowrap">
                                                {new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                            <span className="text-slate-400 mt-0.5 whitespace-nowrap flex items-center">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {c.expectedResolutionTime}h SLA
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={c.status} />
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center space-x-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => navigate(`/complaint/${c._id}`)}
                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>

                                            <div className="relative inline-block text-left">
                                                {updatingId === c._id ? (
                                                    <span className="text-xs text-indigo-600 animate-pulse font-medium px-2">Updating...</span>
                                                ) : (
                                                    <div className="relative group/select">
                                                        <select
                                                            className="appearance-none bg-white border border-slate-200 text-slate-600 py-1.5 pl-3 pr-8 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer shadow-sm hover:border-indigo-400 transition-all uppercase tracking-wide"
                                                            value={c.status}
                                                            onChange={(e) => handleStatusChange(c._id, e.target.value)}
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="in_progress">In Progress</option>
                                                            <option value="resolved">Resolved</option>
                                                        </select>
                                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                            <MoreHorizontal className="w-3 h-3" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer Pagination (Visual Only for now) */}
            <div className="p-4 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between text-xs text-slate-400">
                <span>Showing {filteredComplaints.length} entries</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 rounded-md bg-white border border-slate-200 shadow-sm disabled:opacity-50" disabled>Prev</button>
                    <button className="px-3 py-1 rounded-md bg-white border border-slate-200 shadow-sm disabled:opacity-50" disabled>Next</button>
                </div>
            </div>
        </div>
    );
};

export default AdminComplaintTable;
