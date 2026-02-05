import React, { useEffect, useRef, useState } from "react";
import {
    FaTachometerAlt,
    FaTasks,
    FaCheckCircle,
    FaCog,
    FaHome
} from "react-icons/fa";
import axios from "axios";

const Sidebar = ({
    fetchMyTasks,
    fetchCompletedTasks,
    fetchTasks,
    showSettings,
    isSidebarOpen = false,
    closeSidebar = () => { },
    tasks = [],
    theme = "light",
    currentPage = "dashboard"
}) => {
    const sidebarRef = useRef(null);
    const [taskStats, setTaskStats] = useState({ total: 0, completed: 0, pending: 0, inProgress: 0 });

    useEffect(() => {
        if (tasks && tasks.length >= 0) {
            const completed = tasks.filter(task => task.status === "completed").length;
            const inProgress = tasks.filter(task => task.status === "inprogress").length;
            const pending = tasks.filter(task => task.status === "pending").length;
            
            const newStats = { 
                total: tasks.length, 
                completed, 
                pending, 
                inProgress 
            };
            
            // Only update if stats actually changed
            if (JSON.stringify(newStats) !== JSON.stringify(taskStats)) {
                setTaskStats(newStats);
            }
        }
    }, [tasks]);
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
    const goToHome = () => {
        window.location.href = "/";
    };

    return (
        <aside ref={sidebarRef} className={`sidebar ${theme} ${isSidebarOpen ? "open" : ""}`}>
            <ul className="sidebar-menu">

                <li className={currentPage === "home" ? "active" : ""} onClick={() => { goToHome(); closeSidebar(); }}>
                    <FaHome />
                    <span>Home</span>
                </li>

                <li className={currentPage === "dashboard" ? "active" : ""} onClick={() => { fetchTasks(); closeSidebar(); }}>
                    <FaTachometerAlt />
                    <span>Dashboard</span>
                </li>

                <li className={currentPage === "mytasks" ? "active" : ""} onClick={() => { fetchMyTasks(); closeSidebar(); }}>
                    <FaTasks />
                    <span>My Tasks</span>
                </li>

                <li className={currentPage === "completed" ? "active" : ""} onClick={() => { fetchCompletedTasks(); closeSidebar(); }}>
                    <FaCheckCircle />
                    <span>Completed</span>
                </li>

                <li className={currentPage === "settings" ? "active" : ""} onClick={() => { showSettings(); closeSidebar(); }}>
                    <FaCog />
                    <span>Settings</span>
                </li>

            </ul>
            
            <div className="sidebar-progress">
                <div className="progress-header">
                    <h4>📊 Task Overview</h4>
                    <div className="total-badge">{taskStats.total}</div>
                </div>
                
                <div className="progress-item">
                    <div className="progress-label">
                        <span>Overall Progress</span>
                        <span className="progress-percentage">
                            {taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0}%
                        </span>
                    </div>
                    <div className="progress-bar">
                        <div 
                            className="progress-fill" 
                            style={{ width: `${taskStats.total > 0 ? (taskStats.completed / taskStats.total) * 100 : 0}%` }}
                        ></div>
                    </div>
                </div>
                
                <div className="progress-stats">
                    <div className="stat-card pending">
                        <div className="stat-icon">⏳</div>
                        <div className="stat-info">
                            <span className="stat-number">{taskStats.pending}</span>
                            <span className="stat-label">Pending</span>
                        </div>
                    </div>
                    <div className="stat-card completed">
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                            <span className="stat-number">{taskStats.completed}</span>
                            <span className="stat-label">Completed</span>
                        </div>
                    </div>
                </div>
                
                <div className="motivational-text">
                    {taskStats.completed === taskStats.total && taskStats.total > 0 ? 
                        "🎉 All tasks completed!" : 
                        taskStats.completed > 0 ? 
                        "💪 Keep going!" : 
                        "🚀 Start your first task!"
                    }
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
