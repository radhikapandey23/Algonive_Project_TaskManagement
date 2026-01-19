import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateTaskModal = ({ closeModal, token, fetchTasks }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch all users for dropdown
        axios.get("http://localhost:4000/api/users", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            console.log("UserApi ", res.data)
            setUsers(res.data.users)
        })
            .catch(err => console.log(err));
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post("http://localhost:4000/api/tasks", {
            title,
            description,
            assignedTo,
            dueDate
        }, { headers: { Authorization: `Bearer ${token}` } });
        fetchTasks();
        closeModal();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>Create Task</h3>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
                    <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
                    <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} required>
                        <option value="">Assign To</option>
                        {users.map(u => <option key={u._id} value={u._id} >{u.name}</option>)}
                    </select>
                    <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
                    <button type="submit">Create Task</button>
                    <button type="button" onClick={closeModal}>Cancel</button>
                </form>
            </div>
        </div >
    );
};

export default CreateTaskModal;
