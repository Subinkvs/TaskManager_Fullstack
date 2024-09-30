import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/landingpage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="content-wrapper">
        <h1 className="landing-title">Welcome to Task Manager</h1>
        <p className="landing-subtitle">Organize your tasks efficiently</p>
        <div className="btn-group">
          <Link to="/login" className="btn-link">Login</Link>
          <Link to="/register" className="btn-link btn-secondary">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
