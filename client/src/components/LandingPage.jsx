import React from "react";
import { Link } from "react-router-dom";
import "../App.css";


function LandingPage() {
  return (
    <div className="landing-container">
      <h1>WELCOME TO SCHOOL MANGEMENT SYSTEM</h1>
      <div className="auth-buttons">
        <Link to="/login">Login</Link>
        <Link to="/register">Register as Admin</Link>
      </div>
    </div>
  );
}

export default LandingPage;