// Frontend/src/pages/DailyTasks.js

import { useEffect, useState } from "react";
import axios from "axios";

export default function DailyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access");

  // Fetch today’s visits
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("https://stores-dango-visit-backend.onrender.com/accounts/today-visits/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data || []);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  // Find the first task that is not completed to determine the active task
  const activeTask = tasks.find(task => task.status !== 'completed');

  // Mark arrival
  const markArrived = async (taskId) => {
    try {
      const res = await axios.patch(
        `https://stores-dango-visit-backend.onrender.com/accounts/visits/${taskId}/arrive/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? res.data : t))
      );
    } catch (err) {
      console.error("Error marking arrival:", err);
      alert(err.response?.data?.error || "Could not mark arrival");
    }
  };

  // Complete visit
  const completeVisit = async (taskId) => {
    const comments = prompt("Enter any comments (optional):") || "";
    const issue = prompt("Enter any issues (optional):") || "";

    try {
      const res = await axios.patch(
        `https://stores-dango-visit-backend.onrender.com/accounts/visits/${taskId}/complete/`,
        { comments, issue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? res.data : t))
      );
    } catch (err) {
      console.error("Error completing visit:", err);
      alert(err.response?.data?.error || "Could not complete visit");
    }
  };

  if (loading) return <div>Loading daily tasks…</div>;
  if (!tasks.length) return <div>No tasks for today.</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>My Daily Tasks</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((t) => (
          <li
            key={t.id}
            style={{
              marginBottom: 12,
              border: "1px solid #ddd",
              padding: 12,
              borderRadius: 8,
              backgroundColor: activeTask && t.id !== activeTask.id ? '#f0f0f0' : 'transparent',
              color: activeTask && t.id !== activeTask.id ? '#999' : 'inherit'
            }}
          >
            <div>
              <strong>{t.store.store_information}</strong> — {t.store.location}
            </div>
            <div>
              Lat: {t.store.latitude} | Lng: {t.store.longitude}
            </div>
            <div>Order: {t.sequence_order}</div>
            <div>
              Status: {t.status}
            </div>
            <div>
              Arrived: {t.arrival_time ? new Date(t.arrival_time).toLocaleTimeString() : "Not yet"}
            </div>

            <div style={{ marginTop: 8 }}>
              {!t.arrival_status && (
                <button 
                  onClick={() => markArrived(t.id)} 
                  disabled={activeTask && t.id !== activeTask.id}
                >
                  Mark Arrived
                </button>
              )}
              {t.arrival_status && t.status !== "completed" && (
                <button onClick={() => completeVisit(t.id)}>Complete Visit</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}