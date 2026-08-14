import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config";
import "./Login.css";
function Login() {
const [phone, setPhone] = useState("");
const [password, setPassword] = useState("");
const navigate = useNavigate();
const handleLogin = async () => {
  try {
    const response = await axios.post(
  `${BASE_URL}/api/auth/login`,
      {
        phone,
        password,
      }
    );
    console.log(response.status);
console.log(response.data);

localStorage.setItem("token", response.data.token);
localStorage.setItem(
  "driver",
  JSON.stringify(response.data.driver)
);

window.location.href = "/dashboard";
  } catch (error) {
  console.log(error);
  console.log(error.response);

  alert(
    error.response?.data?.message || "Server not reachable"
  );
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

<h3>👤 Driver Login</h3>

     <input
        type="text"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
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

<p
  style={{
    color: "white",
    marginTop: "20px",
    fontSize: "15px",
  }}
>
  Don't have an account?
</p>

<button
  onClick={() => navigate("/register")}
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
  Register
</button>
      </div>
    </div>
  );
}

export default Login;