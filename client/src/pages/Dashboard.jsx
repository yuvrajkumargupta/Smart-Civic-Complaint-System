import React, { useEffect, useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import KPICard from '../components/KPICard';
import RecentComplaintsTable from '../components/RecentComplaintsTable';
import ComplaintForm from '../components/ComplaintForm';
import ComplaintTrendsChart from '../components/ComplaintTrendsChart';
import { FileText, CheckCircle, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import API from "../api/axios";

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [announcement, setAnnouncement] = useState('');

  const fetchComplaints = async () => {
    try {
      const { data } = await API.get('/complaints/my');
      setComplaints(data.complaints || []);
    } catch (error) {
      console.error("Failed to fetch complaints", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const { data } = await API.get('/settings');
      if (data.system_announcement) {
        setAnnouncement(data.system_announcement);
      }
    } catch (error) {
      console.error("Failed to fetch settings");
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchSettings();
  }, []);

  // Calculate KPIs dynamically
  const kpiData = useMemo(() => {
    const total = complaints.length;
    const resolved = complaints.filter(c => c.status === 'resolved').length;
    const inProgress = complaints.filter(c => c.status === 'in_progress').length;
    const pending = complaints.filter(c => c.status === 'pending').length;

    return [
      { title: 'Total Complaints', value: total, icon: FileText, color: 'indigo' },
      { title: 'Resolved', value: resolved, icon: CheckCircle, color: 'emerald' },
      { title: 'In Progress', value: inProgress, icon: Clock, color: 'blue' },
      { title: 'Pending', value: pending, icon: AlertTriangle, color: 'warning' },
    ];
  }, [complaints]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-indigo animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative font-sans text-slate-800">
      <Navbar />

      {/* Main Content Wrapper */}
      <main className="container mx-auto px-4 pt-24 pb-12">

        {/* System Announcement Banner */}
        {announcement && (
          <div className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-4 text-white shadow-lg flex items-center animate-fade-in-up">
            <span className="bg-white/20 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>
            </span>
            <div>
              <p className="font-bold text-sm uppercase tracking-wider opacity-90 mb-0.5">System Announcement</p>
              <p className="font-medium">{announcement}</p>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8 fade-in-up">
          <h1 className="text-3xl font-bold text-brand-slate tracking-tight">City Dashboard</h1>
          <p className="text-brand-muted mt-2 text-lg">Overview of civic issues and resolution status.</p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stagger-1">
          {kpiData.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>

        {/* Middle Section: Chart and Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 stagger-2">
          <div className="lg:col-span-2">
            <ComplaintTrendsChart complaints={complaints} />
          </div>
          <div>
            <ComplaintForm onComplaintAdded={fetchComplaints} />
          </div>
        </div>

        {/* Bottom Section: Table */}
        <div className="stagger-3">
          <RecentComplaintsTable complaints={complaints} />
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
