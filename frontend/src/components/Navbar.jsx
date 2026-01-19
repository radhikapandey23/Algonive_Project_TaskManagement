import React from "react";
import { FaUserCircle, FaSignOutAlt, FaBars } from "react-icons/fa";


const Navbar = ({ openSidebar }) => {
    const userName = localStorage.getItem("userName");

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    return (
        <nav className="navbar">
            {/* Left */}
            <div className="navbar-left">
                <FaBars className="menu-icon" onClick={openSidebar} />
                <span className="navbar-logo">Task Manager</span>
            </div>

            {/* Right */}
            <div className="navbar-right">
                <div className="user-info">
                    <FaUserCircle className="user-icon" />
                    <span className="user-name">{userName}</span>
                </div>

                <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt className="logout-icon" />
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
