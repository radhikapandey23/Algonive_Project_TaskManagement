import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

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
            console.log(err);
            alert("Invalid credentials");
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2>Login</h2>
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit">Login</button>

                {/* 🔹 Register link */}
                <p style={{ textAlign: "center", marginTop: "15px", fontSize: "14px" }}>
                    Don’t have an account? <Link to="/register" style={{ color: "#2c7a7b", textDecoration: "none" }}>Register</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
