import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/main.css";

function Navbar() {

  const navigate = useNavigate();

  const userId = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">🫀 CardioCare</div>

      <ul className="nav-links">

        <li><Link to="/">Home</Link></li>

        {!userId && (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}

        {userId && role === "user" && (
          <li><Link to="/dashboard">Dashboard</Link></li>
        )}

        {userId && role === "admin" && (
          <li><Link to="/admin">Admin</Link></li>
        )}

        <li><Link to="/about">About Us</Link></li>

        {userId && (
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        )}

      </ul>
    </nav>
  );
}

export default Navbar;