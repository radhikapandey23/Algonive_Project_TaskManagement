import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes, FaEdit, FaUser, FaCalendarAlt, FaFileAlt, FaTag } from "react-icons/fa";
import "./EditTaskModal.css";

const EditTaskModal = ({ closeModal, token, fetchTasks, task }) => {
    const [title, setTitle] = useState(task?.title || "");
    const [description, setDescription] = useState(task?.description || "");
    const [assignedTo, setAssignedTo] = useState(task?.assignedTo?._id || "");
    const [dueDate, setDueDate] = useState(
        task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ""
    );
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch all users for dropdown
        axios.get("http://localhost:4000/api/users", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            setUsers(res.data.users);
        }).catch(err => console.log(err));
    }, [token]);

    // Reset form when task changes
    useEffect(() => {
        if (task) {
            setTitle(task.title || "");
            setDescription(task.description || "");
            setAssignedTo(task.assignedTo?._id || "");
            setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "");
        }
    }, [task]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:4000/api/tasks/${task._id}`, {
                title,
                description,
                assignedTo,
                dueDate
            }, { headers: { Authorization: `Bearer ${token}` } });
            
            if (window.showToast) {
                window.showToast('Task updated successfully!', 'success');
            }
            
            // Call fetchTasks to refresh the data and update UI
            await fetchTasks();
            closeModal();
        } catch (err) {
            if (window.showToast) {
                window.showToast('Failed to update task', 'error');
            }
        }
    };

    return (
        <div className="modal-overlay">
            <div className="edit-task-modal">
                <div className="modal-header">
                    <div className="header-content">
                        <div className="header-icon">
                            <FaEdit />
                        </div>
                        <div className="header-text">
                            <h3>Edit Task</h3>
                            <p>Update task details</p>
                        </div>
                    </div>
                    <button className="close-btn" onClick={closeModal}>
                        <FaTimes />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="task-form">
                    <div className="form-group">
                        <label className="form-label">
                            <FaTag className="label-icon" />
                            Task Title
                        </label>
                        <input 
                            type="text" 
                            placeholder="Enter task title..." 
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                            required 
                            className="form-input"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">
                            <FaFileAlt className="label-icon" />
                            Description
                        </label>
                        <textarea 
                            placeholder="Describe the task details..." 
                            value={description} 
                            onChange={e => setDescription(e.target.value)}
                            className="form-textarea"
                            rows="4"
                        />
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                <FaUser className="label-icon" />
                                Assign To
                            </label>
                            <select 
                                value={assignedTo} 
                                onChange={e => setAssignedTo(e.target.value)} 
                                required
                                className="form-select"
                            >
                                <option value="">Select team member</option>
                                {users.map(u => (
                                    <option key={u._id} value={u._id}>{u.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">
                                <FaCalendarAlt className="label-icon" />
                                Due Date
                            </label>
                            <input 
                                type="date" 
                                value={dueDate} 
                                onChange={e => setDueDate(e.target.value)} 
                                required 
                                className="form-input"
                            />
                        </div>
                    </div>
                    
                    <div className="form-actions">
                        <button type="button" onClick={closeModal} className="cancel-btn">
                            Cancel
                        </button>
                        <button type="submit" className="update-btn">
                            <FaEdit className="btn-icon" />
                            Update Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTaskModal;