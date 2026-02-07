
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const LocationMarker = ({ setPosition, position }) => {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
};

const LocationPicker = ({ onLocationSelect, initialPosition }) => {
    const [position, setPosition] = useState(initialPosition || null);

    // Default center (e.g., configurable or user's current location)
    // For now, let's use a generic city center or try to get user location
    const [center, setCenter] = useState({ lat: 51.505, lng: -0.09 });
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setCenter({ lat: latitude, lng: longitude });
                    if (!position && !initialPosition) {
                        // Optional: Auto-set position to current location
                        // setPosition({ lat: latitude, lng: longitude });
                    }
                    setMapReady(true);
                },
                () => {
                    // Fallback if permission denied
                    setMapReady(true);
                }
            );
        } else {
            setMapReady(true);
        }
    }, [initialPosition, position]);

    useEffect(() => {
        if (position) {
            onLocationSelect(position);
        }
    }, [position, onLocationSelect]);

    if (!mapReady) {
        return <div className="h-64 bg-slate-100 rounded-lg animate-pulse flex items-center justify-center text-slate-400">Loading Map...</div>;
    }

    return (
        <div className="h-64 rounded-lg overflow-hidden border border-slate-200 z-0">
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=KNcj69eh2nNRFjKoavX3`}
                    attribution="© MapTiler © OpenStreetMap contributors"
                />
                <LocationMarker setPosition={setPosition} position={position} />
            </MapContainer>
            <div className="text-xs text-slate-500 mt-1 text-center">
                Tap on the map to pin the exact location of the issue.
            </div>
        </div>
    );
};

export default LocationPicker;
