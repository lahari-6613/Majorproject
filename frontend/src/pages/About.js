import React from "react";
import "../styles/main.css";

function About() {
  return (
    <div className="about-container">
      <h1>About CardioCare</h1>

      <div className="about-card">
        <h3>Our Mission</h3>
        <p>
          CardioCare is an AI-powered heart disease prediction platform
          designed to assist early detection and preventive healthcare.
        </p>
      </div>

      <div className="about-card">
        <h3>Technology Used</h3>
        <p>
          Our system uses a Hybrid 3-Layer Convolutional Neural Network (CNN)
          model trained on clinical heart disease datasets to provide
          accurate risk assessment with confidence scores.
        </p>
      </div>

      <div className="about-card">
        <h3>Why CardioCare?</h3>
        <p>
          Early detection saves lives. CardioCare enables fast,
          data-driven heart risk evaluation using advanced deep learning.
        </p>
      </div>
    </div>
  );
}

export default About;