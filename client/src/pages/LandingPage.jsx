import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import API from '../api/axios';
import {
    ShieldCheck, ArrowRight, Zap, CheckCircle, MapPin,
    Activity, Droplets, Lightbulb, Truck
} from 'lucide-react';

// Fix Leaflet Icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const LandingPage = () => {
    const [stats, setStats] = useState({ total: 0, resolved: 0, rate: 0 });
    const [mapComplaints, setMapComplaints] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, mapRes] = await Promise.all([
                    API.get('/public/stats'),
                    API.get('/public/map-data')
                ]);

                setStats({
                    total: statsRes.data.stats.total,
                    resolved: statsRes.data.stats.resolved,
                    rate: ((statsRes.data.stats.resolved / statsRes.data.stats.total) * 100).toFixed(0) || 0
                });
                setRecentActivity(statsRes.data.stats.recent || []);
                setMapComplaints(mapRes.data.complaints || []);
            } catch (error) {
                console.error("Landing Page Data Error:", error);
            }
        };
        fetchData();
    }, []);



    return (
        <div className="font-sans text-slate-900 bg-white">

            {/* HEROME SECTION WITH MAP BACKGROUND */}
            <div id="live-map" className="relative h-screen w-full overflow-hidden">
                {/* Background Map - dimmed */}
                <div className="absolute inset-0 z-0">
                    <MapContainer
                        center={[20.5937, 78.9629]} // Center of India
                        zoom={5}
                        zoomControl={false}
                        scrollWheelZoom={false}
                        dragging={false}
                        style={{ height: "100%", width: "100%", filter: "grayscale(100%) contrast(1.2) brightness(0.6)" }}
                    >
                        <TileLayer
                            url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=KNcj69eh2nNRFjKoavX3`}
                            attribution="© MapTiler © OpenStreetMap contributors"
                        />

                        {/* Show a few clusters or heatmap points if possible, or just static for vibe */}
                        {mapComplaints.slice(0, 20).map(c => (
                            <Marker key={c._id} position={[c.coordinates.lat, c.coordinates.lng]} />
                        ))}
                    </MapContainer>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center items-start text-white">
                    <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-6 animate-fade-in-up">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        <span className="text-sm font-medium tracking-wide">System Online • Resolving Issues Live</span>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6 max-w-4xl tracking-tight drop-shadow-lg">
                        Your Voice. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Your City.</span> <br />
                        Your Change.
                    </h1>

                    <p className="text-xl text-slate-300 mb-10 max-w-2xl font-light">
                        Join thousands of citizens transforming our city one report at a time.
                        Real-time tracking, transparent resolutions, and direct impact.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link
                            to="/dashboard"
                            className="group flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/30"
                        >
                            <Zap className="w-5 h-5 mr-2 fill-current" />
                            Report Issue Now
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/map"
                            className="flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold text-lg border border-white/20 transition-all"
                        >
                            <MapPin className="w-5 h-5 mr-2" />
                            Explore Live Map
                        </Link>
                    </div>
                </div>

                {/* Live Activity Ticker (Bottom) */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md border-t border-white/10 py-4 z-20 overflow-hidden">
                    <div className="container mx-auto flex items-center space-x-8 animate-marquee whitespace-nowrap">
                        {recentActivity.concat(recentActivity).map((item, idx) => (
                            <div key={idx} className="flex items-center space-x-3 text-sm text-slate-300 px-4 border-r border-white/10">
                                <span className={`w-2 h-2 rounded-full ${item.status === 'resolved' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                                <span className="font-semibold text-white">{item.category}</span>
                                <span className="opacity-75 truncate max-w-[200px]">{item.title}</span>
                                <span className="text-xs opacity-50">{new Date(item.createdAt).toLocaleDateString()}</span>
                            </div>
                        ))}
                        {recentActivity.length === 0 && (
                            <div className="text-slate-400 italic"> waiting for live updates...</div>
                        )}
                    </div>
                </div>
            </div>

            {/* IMPACT COUNTERS SECTION */}
            <div className="py-20 bg-slate-50 border-b border-slate-200">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="text-center p-8 bg-white rounded-2xl shadow-soft hover:shadow-lg transition-shadow border-b-4 border-emerald-500">
                            <div className="text-5xl font-black text-slate-800 mb-2">{stats.resolved}+</div>
                            <div className="text-emerald-600 font-bold uppercase tracking-wider text-sm mb-4">Issues Resolved</div>
                            <p className="text-slate-500 text-sm">Communities reclaimed and infrastructure fixed.</p>
                        </div>
                        <div className="text-center p-8 bg-white rounded-2xl shadow-soft hover:shadow-lg transition-shadow border-b-4 border-indigo-500">
                            {/* Mocking citizens heard based on total * multiplier or just total complaints for now */}
                            <div className="text-5xl font-black text-slate-800 mb-2">{stats.total * 3}+</div>
                            <div className="text-indigo-600 font-bold uppercase tracking-wider text-sm mb-4">Citizens Heard</div>
                            <p className="text-slate-500 text-sm">Active participants making a difference today.</p>
                        </div>
                        <div className="text-center p-8 bg-white rounded-2xl shadow-soft hover:shadow-lg transition-shadow border-b-4 border-amber-500">
                            <div className="text-5xl font-black text-slate-800 mb-2">{stats.rate}%</div>
                            <div className="text-amber-600 font-bold uppercase tracking-wider text-sm mb-4">Response Rate</div>
                            <p className="text-slate-500 text-sm">Commitment to rapid and effective governance.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* PROBLEM / SOLUTION SHOWCASE */}
            <div className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">Real Problems. Real Solutions.</h2>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto">See how your reports translate into tangible improvements in your neighborhood.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Interactive Card */}
                        <div className="relative group cursor-pointer perspective-1000">
                            <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                            <div className="relative bg-white rounded-2xl p-6 shadow-xl border border-slate-100 overflow-hidden">
                                <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center z-10">
                                    <CheckCircle className="w-3 h-3 mr-1" /> Fixed
                                </div>
                                <div className="h-64 bg-slate-200 rounded-xl mb-6 relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                                    {/* Placeholder for Before/After */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-white/50 text-xl font-bold">
                                        BEFORE
                                    </div>
                                    <div className="absolute inset-0 bg-emerald-500/90 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        AFTER (Resolved)
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Dangerous Pothole on Main St.</h3>
                                <p className="text-slate-500 mb-4">Reported on Monday. Verified by AI. Fixed by Wednesday.</p>
                                <div className="flex items-center text-sm font-medium text-emerald-600">
                                    <Clock className="w-4 h-4 mr-2" />
                                    Resolved in 48 Hours
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-8">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Detailed Tracking</h3>
                                    <p className="text-slate-500">Watch your complaint move from "Submitted" to "In Progress" to "Resolved" with real-time notifications.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 shrink-0">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">AI-Powered Routing</h3>
                                    <p className="text-slate-500">Our smart system automatically detects the issue type and routes it to the correct department instantly.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CATEGORY GRID */}
            <div className="py-20 bg-slate-900 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-12">What can you report?</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: Truck, label: "Roads & Traffic", color: "text-amber-400" },
                            { icon: Droplets, label: "Water Supply", color: "text-cyan-400" },
                            { icon: Lightbulb, label: "Electricity", color: "text-yellow-400" },
                            { icon: ShieldCheck, label: "Sanitation", color: "text-emerald-400" },
                        ].map((item, idx) => (
                            <div key={idx} className="p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/5 cursor-pointer group">
                                <item.icon className={`w-10 h-10 mx-auto mb-4 ${item.color} group-hover:scale-110 transition-transform`} />
                                <h3 className="font-semibold">{item.label}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FOOTER CTA */}
            <div className="py-20 bg-emerald-600 text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-white mb-6">Ready to make a difference?</h2>
                    <p className="text-emerald-100 text-lg mb-10 max-w-2xl mx-auto">It only takes 60 seconds to report an issue and start the change.</p>
                    <Link
                        to="/register"
                        className="inline-flex items-center bg-white text-emerald-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-50 transition-colors shadow-2xl"
                    >
                        Create Account
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                    <div className="mt-8 text-sm text-emerald-200">
                        Already have an account? <Link to="/login" className="underline hover:text-white">Sign In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Simple Clock Icon component since it wasn't imported
const Clock = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);

export default LandingPage;
