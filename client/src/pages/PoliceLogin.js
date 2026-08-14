import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config";
import "./Login.css";

function PoliceLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
 
  const handleLogin = async () => {
  console.log("Login button clicked");
  try {
    const response = await axios.post(
  `${BASE_URL}/api/police/login`,
      {
        policeId: username,
        password,
      }
    );
console.log(response.data);

localStorage.setItem(
  "policeToken",
  response.data.token
);

localStorage.setItem(
  "police",
  JSON.stringify(response.data.police)
);

console.log("Saved Token:", localStorage.getItem("policeToken"));

window.location.href = "/police";
  } catch (error) {
    console.log(error);
    console.log(error.response);
    alert(
      error.response?.data?.message || "Login Failed"
    );
  }
};

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>👮 Police Login</h1>

        <p
          style={{
            color: "#dbeafe",
            marginBottom: "20px",
          }}
        >
          Route Rakshak Control Room
        </p>

        <input
          type="text"
          placeholder="Police ID"
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

export default PoliceLogin;