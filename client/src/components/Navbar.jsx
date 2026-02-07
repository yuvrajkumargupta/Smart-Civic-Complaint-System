import React, { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, ShieldCheck, LogOut, Bell, User, TrendingUp, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Increased z-index to 9999 to ensure it sits above Leaflet map layers (which go up to ~1000)
    return (
        <nav className="fixed top-0 left-0 right-0 z-[9999] bg-brand-indigo text-white shadow-lg h-16 transition-all duration-300">
            <div className="container mx-auto px-4 h-full flex items-center justify-between">
                {/* Logo Section - Now Redirects to Dashboard */}
                <Link to="/" className="flex items-center space-x-2 group cursor-pointer">
                    <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Smart Civic</span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link to="/transparency" className="text-white/90 hover:text-white font-medium transition-colors flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>Transparency</span>
                    </Link>
                    <Link to="/map" className="text-white/90 hover:text-white font-medium transition-colors flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>Live Map</span>
                    </Link>
                    <Link to="/dashboard" className="text-white/90 hover:text-white font-medium transition-colors flex items-center space-x-1">
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                    </Link>
                    {JSON.parse(localStorage.getItem('user'))?.role === 'admin' && (
                        <Link to="/admin" className="text-white/60 hover:text-white font-medium transition-colors">Admin Portal</Link>
                    )}
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-6">
                    {/* Notification Bell - now links to page */}
                    <div className="relative group">
                        <Link to="/notifications" className="relative p-2 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10 flex items-center justify-center">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full border-2 border-brand-indigo"></span>
                        </Link>
                        {/* Tooltip instead of dropdown since we have a full page now */}
                        <div className="absolute right-0 mt-2 w-max px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            View Notifications
                        </div>
                    </div>

                    <div className="h-8 w-px bg-white/20 mx-2"></div>

                    <div
                        className="relative"
                        ref={dropdownRef}
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                        <div
                            className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-colors"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium leading-none">{JSON.parse(localStorage.getItem('user'))?.name || 'User'}</p>
                                <p className="text-xs text-brand-light mt-1 capitalize">{JSON.parse(localStorage.getItem('user'))?.role || 'Citizen'}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                <User className="w-5 h-5" />
                            </div>
                        </div>

                        {/* Dropdown Menu - Controlled by State */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 top-full pt-2 w-48 z-[10000]">
                                <div className="bg-white rounded-lg shadow-lg py-1 border border-slate-100 animate-in fade-in slide-in-from-top-1">
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors flex items-center"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        <User className="w-4 h-4 mr-2 text-slate-400" />
                                        Your Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem('token');
                                            localStorage.removeItem('user');
                                            window.location.href = '/login';
                                        }}
                                        className="w-full text-left flex items-center px-4 py-2.5 text-rose-600 hover:bg-rose-50 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
