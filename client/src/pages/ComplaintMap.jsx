import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { Loader2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

// Fix Leaflet Icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const ComplaintMap = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMapData = async () => {
            try {
                const { data } = await API.get('/public/map-data');
                setComplaints(data.complaints);
            } catch (error) {
                console.error("Failed to load map data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMapData();
    }, []);

    const getMarkerIcon = (status) => {
        // You can customize icons based on status here if needed
        return new L.Icon({
            iconUrl: require('leaflet/dist/images/marker-icon.png'),
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-brand-indigo animate-spin" />
            </div>
        );
    }

    // Default center (can be dynamic based on first complaint)
    const defaultCenter = complaints.length > 0
        ? [complaints[0].coordinates.lat, complaints[0].coordinates.lng]
        : [20.5937, 78.9629]; // India Center

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <Navbar />

            <div className="flex-1 relative mt-16 z-0">
                <MapContainer
                    center={defaultCenter}
                    zoom={13}
                    style={{ height: "100%", width: "100%", position: "absolute", top: 0, left: 0 }}
                >
                    <TileLayer
                        url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=KNcj69eh2nNRFjKoavX3`}
                        attribution="© MapTiler © OpenStreetMap contributors"
                    />

                    {complaints.map(c => (
                        <Marker
                            key={c._id}
                            position={[c.coordinates.lat, c.coordinates.lng]}
                            icon={getMarkerIcon(c.status)}
                        >
                            <Popup>
                                <div className="min-w-[200px]">
                                    <h3 className="font-bold text-slate-800 text-sm mb-1">{c.title}</h3>
                                    <div className="flex items-center space-x-2 text-xs mb-2">
                                        <span className={`px-2 py-0.5 rounded-full capitalize font-bold
                                            ${c.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                                                c.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-amber-100 text-amber-700'}
                                        `}>
                                            {c.status.replace('_', ' ')}
                                        </span>
                                        <span className="text-slate-500 capitalize">{c.category}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-2 truncate">{c.location}</p>
                                    <Link
                                        to={`/complaints/${c._id}`}
                                        className="block text-center bg-brand-indigo text-white text-xs py-1.5 rounded hover:bg-brand-blue transition-colors"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Map Overlay Info */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-100 z-[1000] max-w-xs">
                    <h2 className="font-bold text-slate-800 flex items-center mb-2">
                        <MapPin className="w-5 h-5 mr-2 text-brand-indigo" />
                        Live Complaint Map
                    </h2>
                    <p className="text-xs text-slate-500 mb-3">Real-time view of civic issues reported by citizens.</p>
                    <div className="space-y-2 text-xs font-medium">
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                            <span>Resolved Issues</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                            <span>Pending / In Progress</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintMap;
