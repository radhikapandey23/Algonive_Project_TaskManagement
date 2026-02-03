import React from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="confirm-modal-overlay">
            <div className="confirm-modal">
                <div className="confirm-header">
                    <div className="confirm-icon">
                        <FaExclamationTriangle />
                    </div>
                    <button className="confirm-close" onClick={onCancel}>
                        <FaTimes />
                    </button>
                </div>
                
                <div className="confirm-content">
                    <h3>{title}</h3>
                    <p>{message}</p>
                </div>
                
                <div className="confirm-actions">
                    <button className="confirm-cancel-btn" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="confirm-delete-btn" onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;