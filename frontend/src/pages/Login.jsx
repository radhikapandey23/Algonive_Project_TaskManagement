import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";
import "./Login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // Pre-fill email if user just registered
    useEffect(() => {
        const lastRegisteredEmail = localStorage.getItem("lastRegisteredEmail");
        if (lastRegisteredEmail) {
            setEmail(lastRegisteredEmail);
            // Clear it after using so it doesn't persist forever
            localStorage.removeItem("lastRegisteredEmail");
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:4000/api/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userName", res.data.user.name);
            localStorage.setItem("userId", res.data.user._id);
            localStorage.setItem("userEmail", res.data.user.email);
            navigate("/dashboard");
        } catch (err) {
            console.log("Login error:", err.response?.data || err.message);
            if (window.showToast) {
                if (err.response?.data?.message) {
                    window.showToast(err.response.data.message, 'error');
                } else if (err.response?.status === 401) {
                    window.showToast("Invalid email or password. Please check your credentials.", 'error');
                } else if (err.response?.status === 404) {
                    window.showToast("User not found. Please register first.", 'error');
                } else {
                    window.showToast("Login failed. Please try again.", 'error');
                }
            } else {
                // Fallback to alert if toast is not available
                if (err.response?.data?.message) {
                    alert(err.response.data.message);
                } else if (err.response?.status === 401) {
                    alert("Invalid email or password. Please check your credentials.");
                } else if (err.response?.status === 404) {
                    alert("User not found. Please register first.");
                } else {
                    alert("Login failed. Please try again.");
                }
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>Welcome Back</h2>
                    <p>Sign in to your account</p>
                </div>
                
                <form onSubmit={handleLogin} className="login-form" autoComplete="off">
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
                    
                    <button type="submit" className="login-btn">
                        <FaSignInAlt className="btn-icon" />
                        <span>Sign In</span>
                    </button>
                </form>
                
                <div className="register-link">
                    <p>Don't have an account? 
                        <Link to="/register" className="link">Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;