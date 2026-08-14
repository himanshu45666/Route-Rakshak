import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import { BASE_URL } from "../config";

function AdminSetup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSetup = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/admin/setup`,
        {
          username,
          password,
        }
      );

      alert("Super Admin Created Successfully");

      navigate("/admin-login");
    } catch (error) {
      alert(
        error.response?.data?.message || "Setup Failed"
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>⚙️ First Time Setup</h1>

        <p
          style={{
            color: "#dbeafe",
            marginBottom: "20px",
          }}
        >
          Create Super Admin
        </p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          onClick={handleSetup}
          className="login-btn"
        >
          Create Admin
        </button>
      </div>
    </div>
  );
}

export default AdminSetup;