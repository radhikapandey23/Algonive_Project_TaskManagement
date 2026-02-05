import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";
import "./Register.css";


const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        
        // Frontend password validation
        const alphanumericRegex = /^[a-zA-Z0-9]+$/;
        if (!alphanumericRegex.test(password)) {
            if (window.showToast) {
                window.showToast("Password must contain only letters and numbers", 'error');
            } else {
                alert("Password must contain only letters and numbers");
            }
            return;
        }
        
        if (password.length < 6) {
            if (window.showToast) {
                window.showToast("Password must be at least 6 characters long", 'error');
            } else {
                alert("Password must be at least 6 characters long");
            }
            return;
        }
        
        try {
            await axios.post("http://localhost:4000/api/auth/register", { name, email, password });
            
            // Save email for login pre-fill
            localStorage.setItem("lastRegisteredEmail", email);
            
            if (window.showToast) {
                window.showToast("Registered successfully. Please login.", 'success');
            } else {
                alert("Registered successfully. Please login.");
            }
            navigate("/login");
        } catch (err) {
            console.log("Registration error:", err.response?.data || err.message);
            if (window.showToast) {
                if (err.response?.data?.message) {
                    window.showToast(err.response.data.message, 'error');
                } else if (err.response?.status === 400) {
                    window.showToast("User already exists or invalid data. Please try with different email.", 'error');
                } else {
                    window.showToast("Registration failed. Please try again.", 'error');
                }
            } else {
                // Fallback to alert if toast is not available
                if (err.response?.data?.message) {
                    alert(err.response.data.message);
                } else if (err.response?.status === 400) {
                    alert("User already exists or invalid data. Please try with different email.");
                } else {
                    alert("Registration failed. Please try again.");
                }
            }
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <h2>Create Account</h2>
                    <p>Join us today</p>
                </div>
                
                <form onSubmit={handleRegister} className="register-form" autoComplete="off">
                    <div className="input-group">
                        <input 
                            type="text" 
                            placeholder="Full Name" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            required 
                            className="form-input"
                            autoComplete="off"
                        />
                        <FaUser className="input-icon" />
                    </div>
                    
                    <div className="input-group">
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                            className="form-input"
                            autoComplete="off"
                        />
                        <FaEnvelope className="input-icon" />
                    </div>
                    
                    <div className="input-group">
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            required 
                            className="form-input"
                            autoComplete="new-password"
                        />
                        <FaLock className="input-icon" />
                    </div>
                    
                    <button type="submit" className="register-btn">
                        <FaUserPlus className="btn-icon" />
                        <span>Create Account</span>
                    </button>
                </form>
                
                <div className="login-link">
                    <p>Already have an account? 
                        <Link to="/login" className="link">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
