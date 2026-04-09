import React from "react";
import "../styles/main.css";

function Home() {
  return (
    <div className="hero-section">
      <div className="hero-overlay">
        <div className="hero-content">
          <h1>🫀 CardioCare</h1>
          <p>
            AI-Powered Heart Disease Risk Prediction System
          </p>
          <div className="hero-buttons">
            <a href="/login" className="btn-primary">Get Started</a>
            <a href="/about" className="btn-secondary">Learn More</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;