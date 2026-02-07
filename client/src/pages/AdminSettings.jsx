import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import API from '../api/axios';
import { Globe, Save, Loader2, Megaphone } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        system_announcement: '',
        maintenance_mode: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await API.get('/settings');
            setSettings(prev => ({ ...prev, ...data }));
        } catch (error) {
            console.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (key, value) => {
        setSaving(true);
        try {
            await API.put('/settings', { key, value });
            setSettings(prev => ({ ...prev, [key]: value }));
            toast.success('Settings updated successfully');
        } catch (error) {
            toast.error('Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <AdminLayout>Loading...</AdminLayout>;

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">System Settings</h1>
                <p className="text-slate-500 mt-1">Configure global application preferences.</p>
            </div>

            <div className="grid gap-6 max-w-3xl">
                {/* System Announcement */}
                <div className="bg-white rounded-xl shadow-soft border border-slate-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                            <Megaphone className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h3 className="font-bold text-slate-800">System Announcement</h3>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">Broadcast a message to all users on their dashboard.</p>

                    <div className="flex gap-4">
                        <input
                            type="text"
                            className="flex-1 p-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g., Scheduled maintenance tonight at 10 PM. / Heavy rain alert."
                            value={settings.system_announcement || ''}
                            onChange={(e) => setSettings({ ...settings, system_announcement: e.target.value })}
                        />
                        <button
                            onClick={() => handleSave('system_announcement', settings.system_announcement)}
                            disabled={saving}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save
                        </button>
                    </div>
                </div>

                {/* General Settings */}
                <div className="bg-white rounded-xl shadow-soft border border-slate-100 p-6 opacity-75 pointer-events-none">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-lg">
                                <Globe className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Maintenance Mode</h3>
                                <p className="text-sm text-slate-500">Disable access for non-admins (Coming Soon)</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={settings.maintenance_mode || false} disabled />
                            <div className="w-11 h-6 bg-slate-200 rounded-full peer"></div>
                        </label>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
};

export default AdminSettings;
