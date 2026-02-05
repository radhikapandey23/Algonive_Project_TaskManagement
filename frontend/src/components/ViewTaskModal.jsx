import React from 'react';
import { FaTimes, FaUser, FaCalendarAlt, FaClock, FaTag } from 'react-icons/fa';
import './ViewTaskModal.css';

const ViewTaskModal = ({ task, closeModal }) => {
    if (!task) return null;

    const formatDate = (date) => {
        if (!date) return 'Not set';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#fbbf24';
            case 'inprogress': return '#60a5fa';
            case 'completed': return '#34d399';
            default: return '#9ca3af';
        }
    };

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="view-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Task Details</h2>
                    <button className="close-btn" onClick={closeModal}>
                        <FaTimes />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="detail-section">
                        <h3 className="task-title">{task.title}</h3>
                        <div className="status-badge" style={{ backgroundColor: getStatusColor(task.status) }}>
                            <FaTag />
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </div>
                    </div>

                    <div className="detail-section">
                        <h4>Description</h4>
                        <p className="task-description">
                            {task.description || 'No description provided'}
                        </p>
                    </div>

                    <div className="detail-grid">
                        <div className="detail-item">
                            <div className="detail-label">
                                <FaUser />
                                Created By
                            </div>
                            <div className="detail-value">
                                {task.createdBy?.name || 'Unknown'}
                                {task.createdBy?.email && (
                                    <span className="email">({task.createdBy.email})</span>
                                )}
                            </div>
                        </div>

                        <div className="detail-item">
                            <div className="detail-label">
                                <FaUser />
                                Assigned To
                            </div>
                            <div className="detail-value">
                                {task.assignedTo?.name || 'Unassigned'}
                                {task.assignedTo?.email && (
                                    <span className="email">({task.assignedTo.email})</span>
                                )}
                            </div>
                        </div>

                        <div className="detail-item">
                            <div className="detail-label">
                                <FaCalendarAlt />
                                Due Date
                            </div>
                            <div className="detail-value">
                                {formatDate(task.dueDate)}
                            </div>
                        </div>

                        <div className="detail-item">
                            <div className="detail-label">
                                <FaClock />
                                Created
                            </div>
                            <div className="detail-value">
                                {formatDate(task.createdAt)}
                            </div>
                        </div>

                        <div className="detail-item">
                            <div className="detail-label">
                                <FaClock />
                                Last Updated
                            </div>
                            <div className="detail-value">
                                {formatDate(task.updatedAt)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewTaskModal;