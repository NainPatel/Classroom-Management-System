import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Initialize navigate

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send login request using axios
      const response = await axios.post('http://localhost:8081/api/users/login', {
        email,
        password,
      });

      // Handle successful login
      console.log('Login Success:', response.data);
      alert('Login Successful!');
      
      // Optionally store token or user data in localStorage
      // localStorage.setItem('user', JSON.stringify(response.data));

      // Redirect to the home page (or any other page)
      navigate("/");  // Change '/home' to your desired route

    } catch (error) {
      // Handling error if login fails
      console.error('Login Error:', error);

      // Check if error response contains a message from the backend
      if (error.response && error.response.data) {
        setError(error.response.data); // Display the error message from backend
      } else {
        setError('An unexpected error occurred. Please try again later.'); // Generic error message
      }
    }
  };

  return (
    <div className="login-container">
      <div className="form login">
        <header>Login</header>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="error-message">{error}</div>} {/* Display error message */}
          <a href="#">Forgot password?</a>
          <input type="submit" value="Login" />
        </form>
      </div>
    </div>
  );
};
