import React from "react";
import { FaTasks } from "react-icons/fa";


const EmptyState = ({ message }) => {
    return (
        <div className="empty-state">
            <FaTasks className="empty-icon" />
            <p>{message}</p>
        </div>
    );
};

export default EmptyState;
