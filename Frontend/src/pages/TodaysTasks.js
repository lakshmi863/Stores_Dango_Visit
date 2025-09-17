// C:\Users\Lenovo\Desktop\React and Django\Frontend\src\pages\TodaysTasks.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TodaysTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem('access');

    useEffect(() => {
        const fetchTodaysTasks = async () => {
            if (!token) {
                navigate('/login'); // Redirect if not logged in
                return;
            }
            try {
                // Fetch data from the new API endpoint
                const response = await axios.get('http://127.0.0.1:8000/accounts/tasks/today/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTasks(response.data);
            } catch (error) {
                console.error("Failed to fetch today's tasks:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTodaysTasks();
    }, [token, navigate]); // Dependencies for the effect

    if (loading) {
        return <div className="text-center p-8">Loading your tasks...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Today's Visit Plan</h1>
                    <button 
                        onClick={() => navigate('/')} 
                        className="py-2 px-4 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                        &larr; Back to Dashboard
                    </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    {tasks.length > 0 ? (
                        <ul className="space-y-4">
                            {tasks.map(task => (
                                <li key={task.id} className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-lg text-gray-800">
                                            <span className="text-gray-500 mr-2">#{task.sequence_order}</span>
                                            {task.store.store_information}
                                        </p>
                                        <p className="text-sm text-gray-600">{task.store.location}</p>
                                    </div>
                                    <div className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                        task.status === 'completed' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600 text-center py-8">
                            You have no tasks assigned for today. Please contact your administrator.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TodaysTasks;