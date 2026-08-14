import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";
import "./Dashboard.css";
import ChatWidget from "./ChatWidget";

function Dashboard() {
  const [location, setLocation] = useState("Fetching Location...");
  const [emergencyType, setEmergencyType] =
    useState("Naxal Attack");
  const [description, setDescription] = useState("");
  const [detecting, setDetecting] = useState(false);

  const socketRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {

socketRef.current = io(BASE_URL);
    socketRef.current.on("connect", () => {
      console.log(
        "🟢 Connected:",
        socketRef.current.id
      );
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation("GPS Not Supported");
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation(
          `${position.coords.latitude}, ${position.coords.longitude}`
        );
      },
      () => {
        setLocation("Location Permission Denied");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const handleDetectEmergency = async () => {
    if (!description.trim()) {
      alert("Please describe the situation first");
      return;
    }

    try {
      setDetecting(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${BASE_URL}/api/ai/detect-emergency`,
        { description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const detectedType = response.data.emergencyType;

      const validTypes = [
        "Naxal Attack",
        "Landslide",
        "Accident",
        "Medical Emergency",
        "Fire",
      ];

      if (validTypes.includes(detectedType)) {
        setEmergencyType(detectedType);
      } else {
        alert("Could not detect emergency type, please select manually");
      }
    } catch (error) {
      console.log(error);
      alert("AI detection failed, please select manually");
    } finally {
      setDetecting(false);
    }
  };

  const handleSOS = async () => {
    try {
      console.log("🚨 SOS Clicked");

      const driver = JSON.parse(
        localStorage.getItem("driver")
      );

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${BASE_URL}/api/sos/send`,
        {
          driverName: driver.name,
          vehicleNumber: driver.vehicleNumber,
          emergencyType,
          location,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    console.log("📡 Emitting SOS");

    socketRef.current.emit("sendSOS", {
      _id: response.data.sos._id,
      driverName: driver.name,
      vehicleNumber: driver.vehicleNumber,
      location,
      time: new Date().toLocaleString(),
      emergencyType,
    });

    alert(response.data.message);
  } catch (error) {
  console.log(error);

  alert(
    error.response?.data?.message ||
    "Failed to send SOS"
  );
}
};
  return (
    <div className="dashboard-container">
      <div className="dashboard-card">

  <div className="dashboard-header">

    <div>
      <h1 className="dashboard-title">🚍 Driver Dashboard</h1>
      <p className="dashboard-status">
        Driver Logged In Successfully ✅
      </p>
    </div>

    <button
      onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("driver");
        navigate("/");
      }}
      className="logout-btn"
    >
      🚪 Logout
    </button>

  </div>

  <h2 className="dashboard-subtitle">
    Welcome to Route Rakshak
  </h2>
      
      <button
        onClick={handleSOS}
        className="sos-btn"
      >
        🆘 Emergency SOS
      </button>

      <div className="location-card">
  📍 <b>Current Location:</b> {location}
</div>

      <div className="emergency-card">
        <label className="emergency-label">
          🤖 Describe Situation (AI Powered)
        </label>

        <textarea
          className="emergency-select"
          style={{ width: "100%", minHeight: "70px", resize: "none" }}
          placeholder="e.g. Gaadi kharab ho gayi hai, ek passenger ghayal hai..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={handleDetectEmergency}
          disabled={detecting}
          style={{
            marginTop: "12px",
            padding: "10px 20px",
            background: detecting ? "#94a3b8" : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: detecting ? "not-allowed" : "pointer",
            fontWeight: "600",
          }}
        >
          {detecting ? "🤖 Detecting..." : "✨ Auto-Detect Emergency Type"}
        </button>
      </div>

      <div className="emergency-card">
  <label className="emergency-label">
    🚨 Emergency Type
  </label>

  <select
  className="emergency-select"
  value={emergencyType}
  onChange={(e) => setEmergencyType(e.target.value)}
>
  <option value="Naxal Attack">🚨 Naxal Attack</option>
  <option value="Landslide">⛰ Landslide</option>
  <option value="Accident">🚗 Accident</option>
  <option value="Medical Emergency">🏥 Medical Emergency</option>
  <option value="Fire">🔥 Fire</option>
</select>
</div>
<ChatWidget />
    </div>
  </div>
  );
}

export default Dashboard;