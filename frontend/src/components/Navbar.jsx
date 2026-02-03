import React, { useState } from "react";
import { FaUserCircle, FaSignOutAlt, FaBars, FaChevronDown } from "react-icons/fa";


const Navbar = ({ openSidebar, theme }) => {
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    return (
        <nav className={`navbar ${theme}`}>
            {/* Left */}
            <div className="navbar-left">
                <FaBars className="menu-icon" onClick={openSidebar} />
                <span className="navbar-logo">Task Manager</span>
            </div>

            {/* Right */}
            <div className="navbar-right">
                {/* Direct Logout Button */}
                <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt className="logout-icon" />
                    <span>Logout</span>
                </button>
                
                <div className="profile-dropdown">
                    <div 
                        className="profile-trigger" 
                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    >
                        <div className="user-info">
                            <FaUserCircle className="user-icon" />
                            <span className="user-name">{userName}</span>
                        </div>
                        <FaChevronDown className={`dropdown-arrow ${showProfileDropdown ? 'open' : ''}`} />
                    </div>
                    
                    {showProfileDropdown && (
                        <div className="profile-menu">
                            <div className="profile-info">
                                <div className="profile-name">{userName}</div>
                                <div className="profile-email">{userEmail}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
