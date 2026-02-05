import React from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

const getDeadlineLabel = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    if (due.getTime() === today.getTime()) {
        return "today";
    }
    if (due.getTime() === tomorrow.getTime()) {
        return "tomorrow";
    }
    return null;
};



const TaskCard = ({ task, updateStatus, showDeadline, deleteTask, editTask, viewTask }) => {




    const statusClass = {
        pending: "status-pending",
        "in-progress": "status-inprogress",
        completed: "status-completed"
    };

    const label =
        showDeadline && task.status !== "completed"
            ? getDeadlineLabel(task.dueDate)
            : null;



    return (
        <div className="task-card">

            <h3>{task.title}</h3>
            <p className="description">{task.description}</p>
            {label === "today" && <span className="deadline today">Due Today</span>}
            {label === "tomorrow" && <span className="deadline tomorrow">Due Tomorrow</span>}


            <div className="info-row">
                <p><strong>Assigned To:</strong> {task.assignedTo.name}</p>
                <p><strong>Created By:</strong> {task.createdBy.name}</p>
                <p><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
                <span className={`task-status ${statusClass[task.status]}`}>{task.status}</span>
            </div>

            <div className="button-row">
                <button className="pending" onClick={() => updateStatus(task._id, "pending")}>Pending</button>
                <button className="inprogress" onClick={() => updateStatus(task._id, "inprogress")}>In-Progress</button>
                <button className="completed" onClick={() => updateStatus(task._id, "completed")}>Completed</button>
            </div>
            
            <div className="action-buttons">
                <button 
                    className="view-btn" 
                    onClick={() => viewTask && viewTask(task)} 
                    title="View Details"
                >
                    <FaEye />
                    <span>View</span>
                </button>
                <button 
                    className="edit-btn" 
                    onClick={() => editTask && editTask(task)} 
                    title="Edit Task"
                >
                    <FaEdit />
                    <span>Edit</span>
                </button>
                <button className="delete-btn" onClick={() => deleteTask && deleteTask(task._id)} title="Delete Task">
                    <FaTrash />
                    <span>Delete</span>
                </button>
            </div>

        </div>

    );
};

export default TaskCard;
