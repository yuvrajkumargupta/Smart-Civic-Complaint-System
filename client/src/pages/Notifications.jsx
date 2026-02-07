
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/axios';
import { Bell, CheckCircle, Info, AlertTriangle, Trash2, Check } from 'lucide-react';
import { format } from 'date-fns';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const { data } = await API.get('/notifications');
            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            await API.patch(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const markAllRead = async () => {
        try {
            await API.patch('/notifications/mark-all-read');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success':
            case 'complaint_update':
                return <CheckCircle className="w-5 h-5 text-emerald-500" />;
            case 'alert':
                return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            case 'system':
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <Navbar />

            <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 flex items-center">
                            <Bell className="w-8 h-8 mr-3 text-brand-indigo" />
                            Notifications
                        </h1>
                        <p className="text-slate-500 mt-1">Stay updated with your complaint status and system alerts.</p>
                    </div>
                    {notifications.some(n => !n.isRead) && (
                        <button
                            onClick={markAllRead}
                            className="text-sm text-brand-indigo hover:text-brand-blue font-medium flex items-center hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors"
                        >
                            <Check className="w-4 h-4 mr-2" />
                            Mark all read
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <p className="text-center text-slate-500 py-8">Loading notifications...</p>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bell className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-700">No notifications yet</h3>
                            <p className="text-slate-400 mt-1">We'll notify you when there's an update on your complaints.</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className={`
                                    relative p-5 rounded-xl border transition-all duration-200 group
                                    ${notification.isRead ? 'bg-white border-slate-100' : 'bg-white border-brand-indigo/30 shadow-sm ring-1 ring-brand-indigo/5'}
                                `}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`mt-0.5 p-2 rounded-full ${notification.isRead ? 'bg-slate-100' : 'bg-indigo-50'}`}>
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className={`text-base font-semibold ${notification.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                                                {notification.title}
                                            </h4>
                                            <span className="text-xs text-slate-400 whitespace-nowrap ml-4">
                                                {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 mt-1 text-sm leading-relaxed">
                                            {notification.message}
                                        </p>
                                    </div>
                                </div>

                                {!notification.isRead && (
                                    <button
                                        onClick={() => markAsRead(notification._id)}
                                        className="absolute top-5 right-5 w-3 h-3 bg-brand-indigo rounded-full"
                                        title="Mark as read"
                                    ></button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default Notifications;
