import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

export const Signup = () => {
  const navigate = useNavigate(); // Hook for navigation after signup

  const [formData, setFormData] = useState({
    username: "", // Change 'fullName' to 'username'
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const response = await axios.post("http://localhost:8081/api/users/signup", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Signup Success:", response.data);

      alert("Signup Successful!");
      navigate("/"); 
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Signup Failed: " + error.response?.data?.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="form signup">
        <header>Signup</header>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username" // Ensure this is 'username'
            placeholder="Username"
            value={formData.username} // Bind to username field
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="role"
                value="student"
                checked={formData.role === "student"}
                onChange={handleChange}
                required
              />
              Student
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="faculty"
                checked={formData.role === "faculty"}
                onChange={handleChange}
                required
              />
              Faculty
            </label>
          </div>

          <button type="submit">Signup</button>
        </form>
      </div>
    </div>
  );
};
