import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/main.css";

function Register() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {

  if (username.length < 6) {
    alert("Username must be at least 6 characters");
    return;
  }

  if (!/^[a-zA-Z0-9]{6}$/.test(password)) {
    alert("Password must be exactly 6 alphanumeric characters");
    return;
  }

  if (!/^\d{10}$/.test(mobile)) {
    alert("Mobile must be 10 digits");
    return;
  }

  const response = await fetch("http://localhost:8000/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      email,
      mobile,
      password
    })
  });

  const data = await response.json();

  if (response.ok) {
    alert("Registration Successful");
  } else {
      alert(data.detail);
  }
  };

  return (
    <div className="card">
      <h2>Register</h2>

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="text"
        placeholder="Mobile Number"
        onChange={(e) => setMobile(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;