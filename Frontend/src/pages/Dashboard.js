// C:\Users\Lenovo\Desktop\React and Django\Frontend\src\pages\Dashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem('access');

    useEffect(() => {
        const fetchTodaysActivities = async () => {
            try {
                const response = await axios.get('https://stores-dango-visit-backend.onrender.com/accounts/activities/today/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setActivities(response.data);
            } catch (error) {
                console.error("Failed to fetch activities:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTodaysActivities();
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user_role');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <button onClick={handleLogout} className="py-2 px-4 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                        Logout
                    </button>
                </div>
            </header>
            <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* --- MODIFIED SECTION --- */}
                {/* A single container for all primary action button */}
                <div className="mb-6 flex flex-wrap justify-end gap-4">
                    
                    {/* Button to the new Live Map page */}
                    <Link to="/live-map">
                        <button className="py-2 px-6 text-base font-medium text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600">
                            View Live Map
                        </button>
                    </Link>

                    {/* Button to view the daily plan */}
                    <Link to="/tasks">
                        <button className="py-2 px-6 text-base font-medium text-white bg-gray-500 rounded-lg shadow-md hover:bg-gray-600">
                            View Today's Plan
                        </button>
                    </Link>
                    
                    {/* Button to create a new activity */}
                    <Link to="/create-activity">
                        <button className="py-2 px-6 text-base font-medium text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700">
                            + Create New Activity
                        </button>
                    </Link>

                </div>
                {/* --- END OF MODIFICATION --- */}

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Today's Activities</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : activities.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {activities.map(activity => (
                                <li key={activity.id} className="py-4">
                                    <p className="font-semibold text-gray-900">{activity.store_name}</p>
                                    <p className="text-sm text-gray-700 mt-1">Remarks: {activity.remarks || "No remarks provided."}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Logged at: {new Date(activity.created_at).toLocaleTimeString()}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">You have not logged any activities today.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;