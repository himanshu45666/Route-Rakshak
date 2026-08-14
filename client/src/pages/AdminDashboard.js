import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config";

function AdminDashboard() {
const navigate = useNavigate();
const [name, setName] = useState("");
const [policeId, setPoliceId] = useState("");
const [station, setStation] = useState("");
const [password, setPassword] = useState("");
const handleCreatePolice = async () => {
  try {
    await axios.post(
  `${BASE_URL}/api/police/register`,
      {
        name,
        policeId,
        station,
        password,
      }
    );

    alert("Police Account Created Successfully");

    setName("");
    setPoliceId("");
    setStation("");
    setPassword("");
  } catch (error) {
    alert(
      error.response?.data?.message || "Failed"
    );
  }
};

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "70px",
      }}
    >
      <button
        onClick={() => {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("admin");
          navigate("/admin-login");
        }}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "10px 20px",
          background: "#dc2626",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        🚪 Logout
      </button>

      <h1>👨‍💼 Admin Dashboard</h1>

      <h3>Welcome Admin</h3>

      <p>
        From here you will create Police Accounts,
        manage Police and Drivers.
      </p>

      <div
  style={{
    marginTop: "30px",
    width: "350px",
    marginInline: "auto",
  }}
>
  <input
    type="text"
    placeholder="Police Name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="login-input"
  />

  <input
    type="text"
    placeholder="Police ID"
    value={policeId}
    onChange={(e) => setPoliceId(e.target.value)}
    className="login-input"
  />

  <input
    type="text"
    placeholder="Police Station"
    value={station}
    onChange={(e) => setStation(e.target.value)}
    className="login-input"
  />

  <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="login-input"
  />

  <button
    onClick={handleCreatePolice}
    className="login-btn"
  >
    ➕ Create Police
  </button>
</div>
    </div>
  );
}

export default AdminDashboard;