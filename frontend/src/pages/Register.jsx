import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";


const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:4000/api/auth/register", { name, email, password });
            alert("Registered successfully. Please login.");
            navigate("/login");
        } catch (err) {
            console.log(err)
            alert("Registration failed");
        }
    };

    return (
        <div className="register-container">
            <form onSubmit={handleRegister} className="register-form">
                <h2>Register</h2>
                <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit">Register</button>

                {/* 🔹 Login link */}
                <p style={{ textAlign: "center", marginTop: "15px", fontSize: "14px" }}>
                    Already have an account? <Link to="/login" style={{ color: "#2c7a7b", textDecoration: "none" }}>Login</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;
