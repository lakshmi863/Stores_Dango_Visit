import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// --- Standard icon fix (no changes here) ---
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Custom icon for all stores (we only need one now)
const blueIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

// Re-centering component (no changes here)
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const LiveMap = () => {
    const [currentPosition, setCurrentPosition] = useState(null);
    
    // --- CHANGE #1: RENAMED STATE FROM 'tasks' to 'stores' FOR CLARITY ---
    const [stores, setStores] = useState([]); 
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('access');

    // Effect for real-time geolocation tracking (no changes here)
    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                setCurrentPosition({ lat: latitude, lng: longitude, accuracy: accuracy });
                if (loading) setLoading(false);
            },
            (geoError) => {
                setError(`Geolocation Error: ${geoError.message}.`);
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }, [loading]);

    // Effect to fetch ALL assigned stores
    useEffect(() => {
        const fetchEmployeeStores = async () => {
            if (!token) { navigate('/login'); return; }
            try {
                // --- CHANGE #2: API ENDPOINT IS NOW '/employee/stores/' ---
                // This gets all stores linked to your employee profile.
                const response = await axios.get('https://stores-dango-visit-backend.onrender.com/accounts/employee/stores/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStores(response.data || []); // Update the new 'stores' state
            } catch (err) {
                console.error("Failed to fetch stores:", err);
                setError('Could not load store data for the map.');
            }
        };
        fetchEmployeeStores();
    }, [token, navigate]);

    // Error and loading messages (no changes here)
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center font-semibold">Loading map and getting your location...</div>;
    }
    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-600 p-4 text-center font-semibold">{error}</div>;
    }
    if (!currentPosition) {
         return <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">Could not get your current location.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">Live Map</h1>
                    <button onClick={() => navigate('/')} className="py-2 px-4 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                        &larr; Back to Dashboard
                    </button>
                </div>
                <div className="mb-2 text-center text-gray-700 font-semibold">
                    Location Accuracy: {currentPosition.accuracy.toFixed(0)} meters
                </div>
                <div className="bg-white rounded-lg shadow-md h-[75vh]">
                    <MapContainer center={[currentPosition.lat, currentPosition.lng]} zoom={15} style={{ height: "100%", width: "100%" }}>
                        
                        <ChangeView center={[currentPosition.lat, currentPosition.lng]} zoom={15} />

                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                        
                        <Circle center={[currentPosition.lat, currentPosition.lng]} radius={currentPosition.accuracy} pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1, weight: 1 }}/>
                        <Marker position={[currentPosition.lat, currentPosition.lng]} >
                            <Popup>You are here (within {currentPosition.accuracy.toFixed(0)}m)</Popup>
                        </Marker>

                        {/* --- CHANGE #3: MODIFIED THE .map() LOOP ---
                            // It now loops over 'stores' instead of 'tasks' and accesses properties directly.
                        */}
                        {stores.map(store => {
                            if (!store || !store.latitude || !store.longitude) {
                                return null;
                            }
                            return (
                                <Marker 
                                    key={store.store_id} 
                                    position={[store.latitude, store.longitude]}
                                    icon={blueIcon} // All stores use the same icon now
                                >
                                    <Popup>
                                        <div className="font-bold text-base">{store.store_information}</div>
                                        <div>{store.location}</div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}; 

export default LiveMap; 