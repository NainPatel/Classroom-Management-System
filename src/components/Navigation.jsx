import React from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';

export const Loadnav = () => {
  return (
    <>
    
    <div>
      <header>
        <div className="logo">
          <img src="logo.png" alt="Logo" />
          <h1 style={{ color: 'black' }}>Academix</h1>
        </div>
        <nav>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/classes">Classes</Link></li>
            <li><Link to="/assignments">Assignments</Link></li>
            <li><Link to="/settings">Settings</Link></li>
          </ul>
        </nav>
        <div className="auth-buttons">
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>
          <Link to="/signup">
            <button className="signup-btn">Signup</button>
          </Link>
        </div>
      </header>

      <hr className="hr-line" />
      
      <div style={{ color: 'black' }}>
        <h2>Welcome to Academix!</h2>
        <p>This is the main content area. You can customize it with your content.</p>
      </div>
    </div>
    </>
  );
};
