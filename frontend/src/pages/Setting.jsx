import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";

const Settings = ({ toggleTheme, theme }) => {
    const navigate = useNavigate();

    const name = localStorage.getItem("userName");
    const email = localStorage.getItem("userEmail");




    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div className="settings-page">
            <h2>Settings</h2>

            <div className="settings-card">
                <h3>Theme</h3>
                <div className="theme-toggle" onClick={toggleTheme}>
                    {theme === "light" ? (
                        <>
                            <FaSun /> Light Mode
                        </>
                    ) : (
                        <>
                            <FaMoon /> Dark Mode
                        </>
                    )}
                </div>
            </div>

            <div className="settings-card">
                <h3>User Information</h3>

                <div className="info-row">
                    <span>Name</span>
                    <span>{name}</span>
                </div>

                <div className="info-row">
                    <span>Email</span>
                    <span>{email || "Not Available"}</span>
                </div>

                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Settings;
