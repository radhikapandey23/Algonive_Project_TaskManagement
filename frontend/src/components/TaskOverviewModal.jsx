import React from 'react';
import { FaTimes, FaTasks, FaClock, FaCheckCircle, FaChartPie, FaCalendarAlt } from 'react-icons/fa';
import './TaskOverviewModal.css';

const TaskOverviewModal = ({ tasks, closeModal, theme = "light" }) => {
    if (!tasks) return null;

    const taskStats = {
        total: tasks.length,
        completed: tasks.filter(task => task.status === "completed").length,
        pending: tasks.filter(task => task.status === "pending").length,
        inProgress: tasks.filter(task => task.status === "inprogress" || task.status === "in-progress").length
    };

    const completionPercentage = taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0;

    // Get upcoming deadlines
    const today = new Date();
    const upcomingTasks = tasks.filter(task => {
        if (!task.dueDate || task.status === "completed") return false;
        const dueDate = new Date(task.dueDate);
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 7;
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    // Recent activity
    const recentTasks = [...tasks]
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5);

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className={`overview-modal-content ${theme}`} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="header-title">
                        <FaChartPie />
                        <h2>Task Overview</h2>
                    </div>
                    <button className="close-btn" onClick={closeModal}>
                        <FaTimes />
                    </button>
                </div>

                <div className="modal-body">
                    {/* Statistics Cards */}
                    <div className="stats-grid">
                        <div className="stat-card total">
                            <div className="stat-icon">
                                <FaTasks />
                            </div>
                            <div className="stat-info">
                                <h3>{taskStats.total}</h3>
                                <p>Total Tasks</p>
                            </div>
                        </div>

                        <div className="stat-card completed">
                            <div className="stat-icon">
                                <FaCheckCircle />
                            </div>
                            <div className="stat-info">
                                <h3>{taskStats.completed}</h3>
                                <p>Completed</p>
                            </div>
                        </div>

                        <div className="stat-card pending">
                            <div className="stat-icon">
                                <FaClock />
                            </div>
                            <div className="stat-info">
                                <h3>{taskStats.pending}</h3>
                                <p>Pending</p>
                            </div>
                        </div>

                        <div className="stat-card progress">
                            <div className="stat-icon">
                                <FaTasks />
                            </div>
                            <div className="stat-info">
                                <h3>{taskStats.inProgress}</h3>
                                <p>In Progress</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Section */}
                    <div className="progress-section">
                        <h3>Overall Progress</h3>
                        <div className="progress-container">
                            <div className="progress-bar">
                                <div 
                                    className="progress-fill" 
                                    style={{ width: `${completionPercentage}%` }}
                                ></div>
                            </div>
                            <span className="progress-text">{completionPercentage}%</span>
                        </div>
                        <p className="progress-description">
                            {taskStats.completed} of {taskStats.total} tasks completed
                        </p>
                    </div>

                    {/* Two Column Layout */}
                    <div className="content-grid">
                        {/* Upcoming Deadlines */}
                        <div className="content-section">
                            <h3>
                                <FaCalendarAlt />
                                Upcoming Deadlines
                            </h3>
                            <div className="deadline-list">
                                {upcomingTasks.length > 0 ? (
                                    upcomingTasks.map(task => {
                                        const dueDate = new Date(task.dueDate);
                                        const diffTime = dueDate - today;
                                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                        
                                        return (
                                            <div key={task._id} className="deadline-item">
                                                <div className="task-info">
                                                    <h4>{task.title}</h4>
                                                    <p className="task-assignee">
                                                        Assigned to: {task.assignedTo?.name}
                                                    </p>
                                                </div>
                                                <div className={`due-badge ${diffDays === 0 ? 'today' : diffDays <= 2 ? 'urgent' : 'upcoming'}`}>
                                                    {diffDays === 0 ? 'Today' : 
                                                     diffDays === 1 ? 'Tomorrow' : 
                                                     `${diffDays} days`}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="empty-message">No upcoming deadlines</p>
                                )}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="content-section">
                            <h3>
                                <FaClock />
                                Recent Activity
                            </h3>
                            <div className="activity-list">
                                {recentTasks.map(task => (
                                    <div key={task._id} className="activity-item">
                                        <div className={`status-dot ${task.status}`}></div>
                                        <div className="activity-info">
                                            <h4>{task.title}</h4>
                                            <p className="activity-meta">
                                                {task.status.charAt(0).toUpperCase() + task.status.slice(1)} • 
                                                {new Date(task.updatedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Motivational Message */}
                    <div className="motivation-section">
                        <div className="motivation-card">
                            {completionPercentage === 100 ? (
                                <>
                                    <span className="motivation-emoji">🎉</span>
                                    <h4>Congratulations!</h4>
                                    <p>All tasks completed! You're doing amazing work!</p>
                                </>
                            ) : completionPercentage >= 75 ? (
                                <>
                                    <span className="motivation-emoji">🚀</span>
                                    <h4>Almost There!</h4>
                                    <p>You're making great progress. Keep up the excellent work!</p>
                                </>
                            ) : completionPercentage >= 50 ? (
                                <>
                                    <span className="motivation-emoji">💪</span>
                                    <h4>Keep Going!</h4>
                                    <p>You're halfway there. Stay focused and keep pushing forward!</p>
                                </>
                            ) : (
                                <>
                                    <span className="motivation-emoji">⭐</span>
                                    <h4>Get Started!</h4>
                                    <p>Every great journey begins with a single step. You've got this!</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskOverviewModal;