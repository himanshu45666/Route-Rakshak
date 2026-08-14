import PoliceDashboard from "./pages/PoliceDashboard";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { Navigate } from "react-router-dom";
import PoliceLogin from "./pages/PoliceLogin";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSetup from "./pages/AdminSetup";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
     <Route
  path="/dashboard"
  element={
    localStorage.getItem("token") ? (
      <Dashboard />
    ) : (
      <Navigate to="/" replace />
    )
  }
/>
<Route path="/police-login" element={<PoliceLogin />} />
      <Route
  path="/police"
  element={
    localStorage.getItem("policeToken") ? (
      <PoliceDashboard />
    ) : (
      <Navigate to="/police-login" replace />
    )
  }
/>
<Route path="/admin-setup" element={<AdminSetup />} />

<Route path="/admin-login" element={<AdminLogin />} />

  <Route
    path="/admin"
    element={
      localStorage.getItem("adminToken") ? (
        <AdminDashboard />
      ) : (
        <Navigate to="/admin-login" replace />
      )
    }
  />
    </Routes>
  );
}

export default App;