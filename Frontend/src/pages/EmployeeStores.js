import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function EmployeeStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access"); // JWT token
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("https://stores-dango-visit-backend.onrender.com/accounts/employee/stores/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStores(res.data || []);
      } catch (err) {
        console.error("Error fetching stores:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const openMaps = (lat, lng) => {
    if (lat == null || lng == null) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openDirections = (lat, lng) => {
    if (lat == null || lng == null) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loading) return <div>Loading…</div>;
  if (!stores.length) return <div>No stores assigned.</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Your Stores</h2>

      {/* Back button */}
      <button onClick={() => navigate("/dashboard")} style={{ marginBottom: 16 }}>
        ← Back to Dashboard
      </button>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {stores.map((s) => (
          <li
            key={s.store_id}
            style={{ marginBottom: 12, border: "1px solid #ddd", padding: 12, borderRadius: 8 }}
          >
            <div><strong>{s.store_information}</strong></div>
            <div>Lat: {s.latitude ?? "N/A"} | Lng: {s.longitude ?? "N/A"}</div>
            <div style={{ marginTop: 8 }}>
              <button
                onClick={() => openMaps(s.latitude, s.longitude)}
                disabled={s.latitude == null || s.longitude == null}
              >
                Open in Google Maps
              </button>{" "}
              <button
                onClick={() => openDirections(s.latitude, s.longitude)}
                disabled={s.latitude == null || s.longitude == null}
              >
                Directions
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
