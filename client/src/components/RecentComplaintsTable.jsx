import React from 'react';
import { MoreHorizontal, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const RecentComplaintsTable = ({ complaints = [] }) => {

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return 'bg-warning/10 text-warning border-warning/20';
            case 'in_progress': return 'bg-blue-50 text-brand-blue border-blue-100';
            case 'resolved': return 'bg-secondary/10 text-secondary border-secondary/20';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <AlertCircle className="w-3 h-3 mr-1" />;
            case 'in_progress': return <Clock className="w-3 h-3 mr-1" />;
            case 'resolved': return <CheckCircle className="w-3 h-3 mr-1" />;
            default: return null;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-soft border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-brand-slate">Recent Complaints</h3>
                <button className="text-brand-indigo text-sm font-medium hover:text-brand-blue transition-colors">View All</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-brand-muted text-xs uppercase tracking-wider font-semibold">
                        <tr>
                            <th className="p-4">Complaint ID</th>
                            <th className="p-4">Title</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Location</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {complaints.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="p-8 text-center text-brand-muted">
                                    No recent complaints found. File a new one above!
                                </td>
                            </tr>
                        ) : (
                            complaints.map((complaint) => (
                                <tr
                                    key={complaint._id}
                                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                                    onClick={() => window.location.href = `/complaint/${complaint._id}`}
                                >
                                    <td className="p-4 font-medium text-brand-indigo text-xs">#{complaint._id.slice(-6).toUpperCase()}</td>
                                    <td className="p-4 text-brand-slate font-medium flex items-center gap-2">
                                        {complaint.title}
                                        {(complaint.priority === 'high' || complaint.priority === 'urgent') && (
                                            <span className="flex h-2 w-2 relative">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-brand-slate capitalize">{complaint.category}</td>
                                    <td className="p-4 text-brand-muted truncate max-w-[150px]">{complaint.location || 'N/A'}</td>
                                    <td className="p-4 text-brand-muted text-sm">{formatDate(complaint.createdAt)}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${getStatusStyle(complaint.status)}`}>
                                            {getStatusIcon(complaint.status)}
                                            {complaint.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button className="p-2 text-slate-400 hover:text-brand-indigo rounded-full hover:bg-indigo-50 transition-colors">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentComplaintsTable;
