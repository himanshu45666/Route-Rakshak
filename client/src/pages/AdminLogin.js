import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import { BASE_URL } from "../config";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
  try {
    console.log("BASE_URL:", BASE_URL);
    console.log("Admin login request started");

    const response = await axios.post(
      `${BASE_URL}/api/admin/login`,
      {
        username,
        password,
      }
    );

    console.log("STATUS:", response.status);
    console.log("RESPONSE:", response.data);

    localStorage.setItem("adminToken", response.data.token);
    localStorage.setItem(
      "admin",
      JSON.stringify(response.data.admin)
    );

    window.location.href = "/admin";

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    console.log("ERROR STATUS:", error.response?.status);
    console.log("ERROR DATA:", error.response?.data);

    alert(
      error.response?.data?.message || "Login Failed"
    );
  }
};

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>👨‍💼 Admin Login</h1>

        <p
          style={{
            color: "#dbeafe",
            marginBottom: "20px",
          }}
        >
          Route Rakshak Administration
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
          onClick={handleLogin}
          className="login-btn"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;