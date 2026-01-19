import React, { useEffect, useRef } from "react";
import {
    FaTachometerAlt,
    FaTasks,
    FaCheckCircle,
    FaCog
} from "react-icons/fa";

const Sidebar = ({
    fetchMyTasks,
    fetchCompletedTasks,
    fetchTasks,
    showSettings,
    isSidebarOpen = false,   // ✅ NEW (safe default)
    closeSidebar = () => { } // ✅ NEW (safe default)
}) => {
    const sidebarRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                isSidebarOpen &&
                sidebarRef.current &&
                !sidebarRef.current.contains(e.target)
            ) {
                closeSidebar();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSidebarOpen]);
    return (
        <aside ref={sidebarRef} className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
            <ul className="sidebar-menu">

                <li onClick={() => { fetchTasks(); closeSidebar(); }}>
                    <FaTachometerAlt />
                    <span>Dashboard</span>
                </li>

                <li onClick={() => { fetchMyTasks(); closeSidebar(); }}>
                    <FaTasks />
                    <span>My Tasks</span>
                </li>

                <li onClick={() => { fetchCompletedTasks(); closeSidebar(); }}>
                    <FaCheckCircle />
                    <span>Completed</span>
                </li>

                <li onClick={() => { showSettings(); closeSidebar(); }}>
                    <FaCog />
                    <span>Settings</span>
                </li>

            </ul>
        </aside>
    );
};

export default Sidebar;
