import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminComplaintTable from '../components/AdminComplaintTable';
import DepartmentPerformanceChart from '../components/DepartmentPerformanceChart';
import API from '../api/axios';
import {
  LayoutDashboard,
  FileText,
  CheckCircle,
  Activity,
  Loader2
} from 'lucide-react';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0, rate: 0 });
  const [deptStats, setDeptStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      // Parallel fetch for complaints and analytics
      const [complaintsRes, analyticsRes] = await Promise.all([
        API.get('/complaints'),
        API.get('/complaints/analytics')
      ]);

      setComplaints(complaintsRes.data.complaints || []);

      const { totalComplaints, resolvedCount, pendingCount, resolutionRate, resolutionTimeByCategory } = analyticsRes.data;

      setStats({
        total: totalComplaints,
        resolved: resolvedCount,
        pending: pendingCount,
        rate: resolutionRate
      });
      setDeptStats(resolutionTimeByCategory || []);

    } catch (error) {
      console.error("Admin Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const KPICard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500`}>
        <Icon className="w-24 h-24" />
      </div>
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl shadow-lg ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="h-[80vh] flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-brand-indigo animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">City Overview</h1>
        <p className="text-slate-500 mt-1">System-wide performance metrics and complaint management.</p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <KPICard
          title="Total Reports"
          value={stats.total}
          icon={LayoutDashboard}
          color="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-indigo-200"
        />
        <KPICard
          title="Pending Action"
          value={stats.pending}
          icon={Activity}
          color="bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-amber-200"
        />
        <KPICard
          title="Resolved Issues"
          value={stats.resolved}
          icon={CheckCircle}
          color="bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-emerald-200"
        />
        <KPICard
          title="Resolution Rate"
          value={`${stats.rate}%`}
          icon={FileText}
          color="bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-blue-200"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 mb-8 fade-in-up" style={{ animationDelay: '0.05s' }}>
        <DepartmentPerformanceChart data={deptStats} />
      </div>

      {/* Main Table Section */}
      <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
        <AdminComplaintTable
          complaints={complaints}
          onStatusUpdate={fetchAllData}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
