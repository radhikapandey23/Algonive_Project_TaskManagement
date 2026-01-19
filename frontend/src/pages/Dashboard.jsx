import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskCard from "../components/TaskCard";
import CreateTaskModal from "../components/CreateTaskModal";
import Sidebar from "../components/Sidebar";
import Settings from "./Setting";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [deadlineTasks, setDeadlineTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState("dashboard");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme); // ✅ store in localStorage
    };



    const openSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const token = localStorage.getItem("token");



    /* ================= SIDEBAR HANDLERS ================= */
    const showDashboard = async () => {
        setCurrentPage("dashboard");
        setLoading(true);
        await fetchTasks();
        setIsSidebarOpen(false);
        setLoading(false);
    };

    const showMyTasks = async () => {
        setCurrentPage("mytasks");
        setLoading(true);
        await fetchMyTasks();
        setIsSidebarOpen(false);
        setLoading(false);
    };

    const showCompleted = async () => {
        setCurrentPage("completed");
        setLoading(true);
        await fetchCompletedTasks();
        setIsSidebarOpen(false);
        setLoading(false);
    };

    const showSettings = () => {
        setCurrentPage("settings");
        setIsSidebarOpen(false);
    };

    /* ================= API CALLS ================= */
    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:4000/api/tasks", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(res.data);
            calculateDeadlineTasks(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyTasks = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/tasks/my", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(res.data);
            calculateDeadlineTasks(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchCompletedTasks = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/tasks/completed", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(res.data);
            setDeadlineTasks([]);
        } catch (err) {
            console.log(err);
        }
    };

    /* ================= DEADLINE LOGIC ================= */
    const calculateDeadlineTasks = (allTasks) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        tomorrow.setHours(23, 59, 59, 999);

        const dueSoon = allTasks.filter(task => {
            if (!task.dueDate) return false;
            const due = new Date(task.dueDate);
            return task.status !== "completed" && due >= today && due <= tomorrow;
        });

        setDeadlineTasks(dueSoon);
    };

    /* ================= UPDATE STATUS ================= */
    const updateStatus = async (id, status) => {
        try {
            await axios.put(
                `http://localhost:4000/api/tasks/${id}`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchTasks();
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchTasks().finally(() => setLoading(false));
    }, []);

    /* ================= UI ================= */
    return (
        <>
            <Navbar openSidebar={openSidebar} />

            <div className="layout">
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    closeSidebar={() => setIsSidebarOpen(false)}
                    fetchTasks={showDashboard}
                    fetchMyTasks={showMyTasks}
                    fetchCompletedTasks={showCompleted}
                    showSettings={showSettings}
                />

                <div className={`main ${theme}`}>

                    {loading ? (


                        <Loading />
                    ) : (
                        <>
                            {/* ================= DASHBOARD ================= */}
                            {currentPage === "dashboard" && (
                                <>
                                    {deadlineTasks.length > 0 && (
                                        <div className="deadline-notifications">
                                            <h3>⚠️ Upcoming Deadlines</h3>
                                            <ul>
                                                {deadlineTasks.map(task => (
                                                    <li key={task._id}>
                                                        {task.title} — due on{" "}
                                                        {new Date(task.dueDate).toLocaleDateString()}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <button
                                        className="create-btn"
                                        onClick={() => setShowModal(true)}
                                    >
                                        Create Task
                                    </button>

                                    {tasks.length === 0 && <EmptyState message={"No tasks available. Create your first task!"} />}

                                    {tasks.map(task => (
                                        <TaskCard
                                            key={task._id}
                                            task={task}
                                            updateStatus={updateStatus}
                                            showDeadline={true}
                                        />
                                    ))}
                                </>
                            )}

                            {/* ================= MY TASKS ================= */}
                            {currentPage === "mytasks" && (
                                <>
                                    <h2>My Tasks</h2>
                                    {tasks.length === 0 && <EmptyState message={"You have no assigned tasks at the moment!"} />}
                                    {tasks.map(task => (
                                        <TaskCard
                                            key={task._id}
                                            task={task}
                                            updateStatus={updateStatus}
                                            showDeadline={false}
                                        />
                                    ))}
                                </>
                            )}

                            {/* ================= COMPLETED ================= */}
                            {currentPage === "completed" && (
                                <>
                                    <h2>Completed Tasks</h2>
                                    {tasks.length === 0 && <EmptyState message="No tasks have been completed yet!" />}
                                    {tasks.map(task => (
                                        <TaskCard
                                            key={task._id}
                                            task={task}
                                            updateStatus={updateStatus}
                                            showDeadline={false}
                                        />
                                    ))}
                                </>
                            )}

                            {/* ================= SETTINGS ================= */}
                            {currentPage === "settings" && <Settings theme={theme} toggleTheme={toggleTheme} />}

                            {/* ================= MODAL ================= */}
                            {showModal && (
                                <CreateTaskModal
                                    closeModal={() => setShowModal(false)}
                                    token={token}
                                    fetchTasks={fetchTasks}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
