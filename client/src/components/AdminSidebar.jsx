import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Users,
    Settings,
    LogOut,
    ShieldCheck,
    Menu,
    X,
} from 'lucide-react';

const AdminSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleSidebar = () => setIsOpen(!isOpen);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/complaints', icon: FileText, label: 'Complaints' },
        { path: '/admin/users', icon: Users, label: 'Users' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <>
            {/* Mobile Menu Button - Styled */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-slate-900/90 text-white rounded-xl shadow-lg backdrop-blur-sm border border-white/10"
                onClick={toggleSidebar}
            >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Sidebar Container - Gradient Background & refined shadow */}
            <aside className={`
                fixed top-0 left-0 h-full w-72 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white z-40 
                transform transition-all duration-300 ease-in-out shadow-2xl border-r border-white/5
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
            `}>
                <div className="flex flex-col h-full relative overflow-hidden">

                    {/* Decorative blurred blobs */}
                    <div className="absolute top-0 left-0 w-full h-40 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full pointer-events-none translate-y-1/3"></div>

                    {/* Brand */}
                    <div className="h-24 flex items-center px-8 relative z-10">
                        <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-tr from-indigo-500 to-violet-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-xl tracking-tight text-white">Admin Portal</h1>
                                <p className="text-xs text-indigo-200 font-medium tracking-wide opacity-80">Smart Civic System</p>
                            </div>
                        </div>
                    </div>

                    <div className="px-4 py-2">
                        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1.5 relative z-10">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end
                                className={({ isActive }) => `
                                    flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden
                                    ${isActive
                                        ? 'bg-white/10 text-white shadow-lg backdrop-blur-md border border-white/10'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-indigo-100 hover:pl-5'
                                    }
                                `}
                            >
                                <div className="flex items-center space-x-3 relative z-10">
                                    <item.icon className={`w-5 h-5 transition-colors ${location.pathname === item.path ? 'text-indigo-400' : 'group-hover:text-indigo-300'}`} />
                                    <span className="font-medium tracking-wide text-sm">{item.label}</span>
                                </div>
                                {location.pathname === item.path && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]"></div>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Profile & Logout */}
                    <div className="p-4 relative z-10">
                        <div className="bg-gradient-to-b from-white/5 to-white/0 rounded-2xl p-5 border border-white/5 backdrop-blur-sm">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-400 to-purple-400 flex items-center justify-center font-bold text-lg text-white shadow-inner ring-2 ring-white/10">
                                    A
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-semibold text-white">Administrator</p>
                                    <div className="flex items-center mt-0.5">
                                        <span className="relative flex h-2 w-2 mr-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>
                                        <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Online</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center space-x-2 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 rounded-xl transition-all duration-200 text-sm font-medium border border-rose-500/10 hover:border-rose-500/20"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
