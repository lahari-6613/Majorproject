import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/main.css";

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Validation
  const validate = () => {
    if (username.length < 6) {
      alert("Username must be at least 6 characters.");
      return false;
    }

    const regex = /^[a-zA-Z0-9]{6}$/;
    if (!regex.test(password)) {
      alert("Password must be exactly 6 alphanumeric characters.");
      return false;
    }

    return true;
  };

  const handleLogin = async () => {

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role })
      });

      const data = await response.json();

      if (response.ok) {

        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("role", role);

        alert("Login successful!");

        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }

      } else {
        alert(data.detail || "Login failed.");
      }

    } catch (error) {
      alert("Server error. Please check backend.");
    }

    setLoading(false);
  };

  return (
    <div className="card">
      <h2>Login</h2>

      <input
        type="text"
        placeholder="Username (min 6 chars)"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password (6 alphanumeric)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="role-select-container">
        <label>Select Role</label>
        <select
          className="role-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
        <option value="user">User</option>
        <option value="admin">Admin</option>
        </select>
      </div>

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}

export default Login;