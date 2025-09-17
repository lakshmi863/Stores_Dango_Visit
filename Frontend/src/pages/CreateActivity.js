import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateActivity = () => {
    // --- 1. STATE MANAGEMENT (MODIFIED) ---
    const [storesList, setStoresList] = useState([]); // Will hold the list of all stores for the dropdown
    const [selectedStore, setSelectedStore] = useState(''); // Will hold the ID of the store the user selects
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState('');

    // State for the form submission process
    const [remarks, setRemarks] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [locationAccuracy, setLocationAccuracy] = useState(null);

    const navigate = useNavigate();
    const token = localStorage.getItem('access');

    // --- 2. DATA FETCHING EFFECT (MODIFIED) ---
    // This now fetches ALL stores assigned to the employee, not just today's tasks.
    useEffect(() => {
        const fetchEmployeeStores = async () => {
            if (!token) { navigate('/login'); return; }
            try {
                // This is the new API endpoint. It gets all stores linked to the employee profile.
                const res = await axios.get('https://stores-dango-visit-backend.onrender.com/accounts/employee/stores/', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data && res.data.length > 0) {
                    setStoresList(res.data);
                    // Pre-select the first store in the list by default
                    setSelectedStore(res.data[0].store_id); 
                } else {
                    setPageError("You have no stores assigned to you. Please contact your administrator.");
                }
            } catch (err) {
                console.error("Error fetching stores:", err);
                setPageError("Could not load your assigned stores. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchEmployeeStores();
    }, [token, navigate]);

    // --- 3. FORM SUBMISSION HANDLER (MODIFIED) ---
    const handleSubmit = (event) => {
        event.preventDefault();
        
        // Add validation to ensure a store has been selected from the dropdown
        if (!selectedStore) {
            setSubmitError('Please select a store from the list.');
            return;
        }

        setSubmitError('');
        setMessage('Getting your current location...');
        setLocationAccuracy(null);
        setIsSubmitting(true);

        const geoOptions = { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 };

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                setLocationAccuracy(accuracy);
                setMessage('Verifying location and submitting...');
                try {
                    // The 'store' ID now comes from the 'selectedStore' state variable,
                    // which is controlled by the dropdown menu.
                    await axios.post('https://stores-dango-visit-backend.onrender.com/accounts/activities/create/', {
                        store: selectedStore, 
                        remarks,
                        latitude,
                        longitude,
                    }, { headers: { Authorization: `Bearer ${token}` } });
                    
                    navigate('/'); // Success! Go back to the dashboard.
                } catch (err) {
                    setSubmitError(err.response?.data?.error || 'An unexpected error occurred.');
                    setMessage('');
                } finally {
                    setIsSubmitting(false);
                }
            },
            (geoError) => {
                setSubmitError(`Location Error: ${geoError.message}.`);
                setMessage('');
                setIsSubmitting(false);
            },
            geoOptions
        );
    };
    
    // --- RENDER LOGIC ---

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center font-semibold">Loading your stores...</div>;
    }

    if (pageError) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-lg p-8 text-center bg-white rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-gray-700">{pageError}</h2>
                    <button onClick={() => navigate('/')} className="mt-6 py-2 px-4 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                        &larr; Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-900">Log Activity</h2>
                <button onClick={() => navigate(-1)} className="text-sm text-indigo-600 hover:text-indigo-500">
                    &larr; Back to Dashboard
                </button>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {message && !submitError && (
                        <div className="text-sm text-center text-blue-600 bg-blue-100 p-3 rounded-md">
                            <p>{message}</p>
                            {locationAccuracy && (
                                <p className="mt-1 font-semibold">Location Accuracy: {locationAccuracy.toFixed(0)} meters</p>
                            )}
                        </div>
                    )}
                    {submitError && <p className="text-sm text-center text-red-600 bg-red-100 p-3 rounded-md">{submitError}</p>}
                    
                    {/* --- 4. JSX UI (MODIFIED) --- */}
                    {/* This is now a dropdown menu (`<select>`) instead of a static display. */}
                    <div>
                        <label htmlFor="store-select" className="text-sm font-medium text-gray-700">Select a Store to Visit</label>
                        <select
                            id="store-select"
                            value={selectedStore}
                            onChange={(e) => setSelectedStore(e.target.value)}
                            className="w-full px-3 py-3 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="" disabled>-- Choose a store --</option>
                            {/* We map over the storesList to create an <option> for each one */}
                            {storesList.map((store) => (
                                <option key={store.store_id} value={store.store_id}>
                                    {store.store_information} ({store.location})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Remarks / Feedback</label>
                        <textarea
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                            placeholder="Example: Order received for 10 units."
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isSubmitting || storesList.length === 0} 
                        className="w-full py-2 px-4 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
                    >
                        {isSubmitting ? 'Submitting...' : 'Log Visit'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateActivity;