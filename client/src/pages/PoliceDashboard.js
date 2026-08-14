import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";
import "./PoliceDashboard.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const socket = io(BASE_URL);

function PoliceDashboard() {
  const [alert, setAlert] = useState(null);
  const [history, setHistory] = useState([]);
  const [accepted, setAccepted] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const totalSOS = history.length;
  const [mapLocation, setMapLocation] = useState(null);

  const pendingSOS = history.filter(
    (item) => item.status === "Pending"
  ).length;

  const acceptedSOS = history.filter(
    (item) => item.status === "Accepted"
  ).length;

  const resolvedSOS = history.filter(
    (item) => item.status === "Resolved"
  ).length;

  const audioRef = useRef(null);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      const policeToken = localStorage.getItem("policeToken");

      const response = await fetch(
        `${BASE_URL}/api/sos/history`,
        {
          headers: {
            Authorization: `Bearer ${policeToken}`,
          },
        }
      );

      const data = await response.json();

      setHistory(data);
      const activeSOS = data.find(
        (item) =>
          item.status === "Pending" ||
          item.status === "Accepted"
      );

      if (activeSOS) {
  setAlert(activeSOS);
  setMapLocation(getCoordinates(activeSOS.location));
} else {
  setAlert(null);
  setMapLocation(null);
}
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    socket.on("receiveSOS", (data) => {
      console.log("🚨 SOS:", data);

      setAccepted(false);
      setAlert(data);
      fetchHistory();
      setMapLocation(getCoordinates(data.location));

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;

        audioRef.current
          .play()
          .catch((err) => console.log("Audio Error:", err));
      }
    });

    return () => {
      socket.off("receiveSOS");
    };
  }, []);

  useEffect(() => {
    const unlockAudio = () => {
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            console.log("🔓 Audio Unlocked");
          })
          .catch(() => {});
      }
    };

    window.addEventListener("click", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("click", unlockAudio);
    };
  }, []);

  const acceptAlert = async () => {
    try {
      const policeToken = localStorage.getItem("policeToken");

      const response = await fetch(
        `${BASE_URL}/api/sos/accept/${alert._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${policeToken}`,
          },
        }
      );

      const data = await response.json();

      setAccepted(true);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      setAlert(data.sos);
      await fetchHistory();
    } catch (error) {
      setPopupMessage("Failed to accept alert");
      setShowPopup(true);
    }
  };

  const getCoordinates = (location) => {
  if (!location) return null;

  const [lat, lng] = location.split(",").map(Number);

  if (isNaN(lat) || isNaN(lng)) return null;

  return [lat, lng];
};

  const resolveAlert = async () => {
    try {
      const policeToken = localStorage.getItem("policeToken");

      const response = await fetch(
        `${BASE_URL}/api/sos/resolve/${alert._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${policeToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setPopupMessage(data.message);
        setShowPopup(true);
        return;
      }

      setAccepted(false);
      await fetchHistory();
      setAlert(null);
    } catch (error) {
      setPopupMessage("Failed to resolve alert");
      setShowPopup(true);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/sounds/siren.mp3"
        preload="auto"
        loop
      />

      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "14px",
              width: "380px",
              textAlign: "center",
              boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ color: "#dc2626" }}>⚠️ Alert</h3>
            <p>{popupMessage}</p>
            <button
              onClick={() => setShowPopup(false)}
              style={{
                marginTop: "15px",
                padding: "10px 22px",
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="police-container">
        <div className="police-card">
          <div className="police-header">
            <div>
              <h1 className="police-title">🚔 Police Dashboard</h1>
              <p className="dashboard-status" style={{ color: "#16a34a", fontWeight: 600, marginTop: "8px" }}>
                Police Logged In Successfully ✅
              </p>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem("policeToken");
                localStorage.removeItem("police");
                navigate("/police-login");
              }}
              className="police-logout-btn"
            >
              🚪 Logout
            </button>
          </div>

          <div className="stats-row">
            <div className="stat-card stat-total">
              <h3>Total SOS</h3>
              <h1>{totalSOS}</h1>
            </div>
            <div className="stat-card stat-pending">
              <h3>Pending</h3>
              <h1>{pendingSOS}</h1>
            </div>
            <div className="stat-card stat-accepted">
              <h3>Accepted</h3>
              <h1>{acceptedSOS}</h1>
            </div>
            <div className="stat-card stat-resolved">
              <h3>Resolved</h3>
              <h1>{resolvedSOS}</h1>
            </div>
          </div>

          {!alert ? (
            <div className="no-emergency">
              <h2>🟢 No Active Emergency</h2>
              <p>System is Monitoring...</p>
            </div>
          ) : (
            <div className="emergency-alert">
              <h2>🚨 EMERGENCY ALERT 🚨</h2>

              <p><b>Driver:</b> {alert.driverName}</p>
              <p><b>Vehicle:</b> {alert.vehicleNumber}</p>
              <p><b>Location:</b> {alert.location}</p>
              <p>
                <b>Time:</b>{" "}
                {alert.createdAt
                  ? new Date(alert.createdAt).toLocaleString()
                  : alert.time}
              </p>
              <p style={{ color: "#dc2626", fontWeight: "bold" }}>
                <b>Emergency:</b> {alert.emergencyType}
              </p>

              <div className="alert-actions">
                <button
                  onClick={acceptAlert}
                  className={`btn-accept ${accepted ? "accepted" : ""}`}
                >
                  {accepted ? "✅ Alert Accepted" : "Accept Alert"}
                </button>

                <button
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps?q=${alert.location}`,
                      "_blank"
                    )
                  }
                  className="btn-map"
                >
                  🗺 Open in Google Maps
                </button>

                <button onClick={resolveAlert} className="btn-resolve">
                  Resolve Alert
                </button>
              </div>
            </div>
          )}
         {mapLocation && (
  <div className="map-section">
    <h2>📍 Live Emergency Location</h2>

    <MapContainer
      center={mapLocation}
      zoom={15}
      style={{ height: "350px", width: "100%", borderRadius: "15px" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={mapLocation}>
        <Popup>
          🚨 Emergency Location
        </Popup>
      </Marker>
    </MapContainer>
  </div>
)}
          <div className="history-section">
            <h2>📜 SOS History</h2>

            <div className="history-table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Driver</th>
                    <th>Vehicle</th>
                    <th>Emergency</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item._id}>
                      <td>{item.driverName}</td>
                      <td>{item.vehicleNumber}</td>
                      <td>{item.emergencyType}</td>
                      <td>
                        <span className={`status-badge status-${item.status}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>{new Date(item.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PoliceDashboard;