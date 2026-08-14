import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import { BASE_URL } from "../config";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [password, setPassword] = useState("");
  const handleRegister = async () => {
  try {
    await axios.post(
  `${BASE_URL}/api/auth/register`,
  {
        name,
        phone,
        vehicleNumber,
        password,
      }
    );

    alert("Registration Successful ✅");

    navigate("/");
  } catch (error) {
    alert(error.response?.data?.message || "Registration Failed");
  }
};
  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🚌 Route Rakshak</h1>

        <p
          style={{
            color: "#dbeafe",
            marginTop: "-8px",
            marginBottom: "20px",
            fontSize: "15px",
          }}
        >
          Emergency Response & Tracking System
        </p>

        <h3>👤 Driver Registration</h3>
        <input
  type="text"
  placeholder="Driver Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="login-input"
/>

<input
  type="text"
  placeholder="Phone Number"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  className="login-input"
/>

<input
  type="text"
  placeholder="Vehicle Number"
  value={vehicleNumber}
  onChange={(e) => setVehicleNumber(e.target.value)}
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
  onClick={handleRegister}
  className="login-btn"
>
  Register
</button>

<p
  style={{
    color: "white",
    marginTop: "20px",
    fontSize: "15px",
  }}
>
  Already have an account?
</p>

<button
  onClick={() => navigate("/")}
  style={{
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    border: "none",
    borderRadius: "10px",
    background: "#2563eb",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  Login
</button>
      </div>
    </div>
  );
}

export default Register;