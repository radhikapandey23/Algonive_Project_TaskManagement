import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskCard from "../components/TaskCard";
import CreateTaskModal from "../components/CreateTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import ViewTaskModal from "../components/ViewTaskModal";
import ConfirmModal from "../components/ConfirmModal";
import Sidebar from "../components/Sidebar";
import Settings from "./Setting";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import SearchBar from "../components/SearchBar";
const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [deadlineTasks, setDeadlineTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const [viewingTask, setViewingTask] = useState(null);
    const [currentPage, setCurrentPage] = useState("dashboard");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

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

    /* ================= SEARCH FUNCTIONALITY ================= */
    const handleSearch = async (query) => {
        try {
            setLoading(true);
            setIsSearching(true);
            setSearchQuery(query);
            
            const res = await axios.get(`http://localhost:4000/api/tasks/search?query=${encodeURIComponent(query)}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setSearchResults(res.data);
            setCurrentPage("search");
        } catch (err) {
            console.log(err);
            if (window.showToast) {
                window.showToast('Search failed', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClearSearch = () => {
        setIsSearching(false);
        setSearchResults([]);
        setSearchQuery('');
        setCurrentPage("dashboard");
        fetchTasks();
    };

    /* ================= API CALLS ================= */
    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:4000/api/tasks", {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Dashboard fetchTasks:', res.data);
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
            console.log('Dashboard fetchMyTasks:', res.data);
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
            console.log('Dashboard fetchCompletedTasks:', res.data);
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
            await axios.patch(
                `http://localhost:4000/api/tasks/${id}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Update tasks state immediately for better UX
            const updatedTasks = tasks.map(task => 
                task._id === id ? { ...task, status } : task
            );
            setTasks(updatedTasks);
            
            // Recalculate deadline tasks with updated data
            calculateDeadlineTasks(updatedTasks);
            
            // Show success toast
            if (window.showToast) {
                window.showToast(`Task marked as ${status}`, 'success');
            }
            
        } catch (err) {
            console.log(err);
            if (window.showToast) {
                window.showToast('Failed to update task status', 'error');
            }
        }
    };

    /* ================= DELETE TASK ================= */
    const deleteTask = async (id) => {
        setTaskToDelete(id);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (taskToDelete) {
            try {
                await axios.delete(
                    `http://localhost:4000/api/tasks/${taskToDelete}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                // Remove task from state immediately
                const updatedTasks = tasks.filter(task => task._id !== taskToDelete);
                setTasks(updatedTasks);
                
                // Recalculate deadline tasks
                calculateDeadlineTasks(updatedTasks);
                
                if (window.showToast) {
                    window.showToast('Task deleted successfully', 'success');
                }
                
            } catch (err) {
                console.log(err);
                if (window.showToast) {
                    window.showToast('Failed to delete task', 'error');
                }
            }
        }
        setShowConfirmModal(false);
        setTaskToDelete(null);
    };

    const cancelDelete = () => {
        setShowConfirmModal(false);
        setTaskToDelete(null);
    };

    /* ================= EDIT TASK ================= */
    const editTask = (task) => {
        setEditingTask(task);
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setEditingTask(null);
    };

    /* ================= VIEW TASK ================= */
    const viewTask = (task) => {
        setViewingTask(task);
        setShowViewModal(true);
    };

    const closeViewModal = () => {
        setShowViewModal(false);
        setViewingTask(null);
    };

    useEffect(() => {
        fetchTasks().finally(() => setLoading(false));
    }, []);

    /* ================= UI ================= */
    return (
        <>
            <Navbar openSidebar={openSidebar} theme={theme} />

            <div className="layout">
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    closeSidebar={() => setIsSidebarOpen(false)}
                    fetchTasks={showDashboard}
                    fetchMyTasks={showMyTasks}
                    fetchCompletedTasks={showCompleted}
                    showSettings={showSettings}
                    tasks={tasks}
                    theme={theme}
                    currentPage={currentPage}
                />

                <div className={`main ${theme}`}>

                    {(currentPage === "dashboard" || currentPage === "search") && (
                        <SearchBar 
                            onSearch={handleSearch}
                            onClear={handleClearSearch}
                            theme={theme}
                        />
                    )}

                    {loading ? (


                        <Loading />
                    ) : (
                        <>
                            {/* ================= SEARCH RESULTS ================= */}
                            {currentPage === "search" && (
                                <>
                                    <div className="page-header">
                                        <div className="header-content">
                                            <div className="header-icon">
                                                <span className="page-icon">🔍</span>
                                            </div>
                                            <div className="header-text">
                                                <h2>Search Results</h2>
                                                <p>Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {searchResults.length === 0 && <EmptyState message={`No tasks found for "${searchQuery}"`} />}
                                    
                                    <div className="tasks-grid">
                                        {searchResults.map(task => (
                                            <TaskCard
                                                key={task._id}
                                                task={task}
                                                updateStatus={updateStatus}
                                                showDeadline={true}
                                                deleteTask={deleteTask}
                                                editTask={editTask}
                                                viewTask={viewTask}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* ================= DASHBOARD ================= */}
                            {currentPage === "dashboard" && (
                                <>
                                    {deadlineTasks.length > 0 && (
                                        <div className="deadline-notifications">
                                            <div className="deadline-header">
                                                <div className="deadline-icon">
                                                    <span className="pulse-icon">⚠️</span>
                                                </div>
                                                <div className="deadline-title">
                                                    <h3>Upcoming Deadlines</h3>
                                                    <p>{deadlineTasks.length} task{deadlineTasks.length > 1 ? 's' : ''} due soon</p>
                                                </div>
                                            </div>
                                            <div className="deadline-list">
                                                {deadlineTasks.map(task => {
                                                    const dueDate = new Date(task.dueDate);
                                                    const today = new Date();
                                                    const isToday = dueDate.toDateString() === today.toDateString();
                                                    const isTomorrow = dueDate.toDateString() === new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString();
                                                    
                                                    return (
                                                        <div key={task._id} className={`deadline-item ${isToday ? 'today' : 'tomorrow'}`}>
                                                            <div className="deadline-task-info">
                                                                <div className="task-title">{task.title}</div>
                                                                <div className="task-due">
                                                                    <span className="due-label">
                                                                        {isToday ? '🔥 Due Today' : '⏰ Due Tomorrow'}
                                                                    </span>
                                                                    <span className="due-date">
                                                                        {dueDate.toLocaleDateString('en-US', { 
                                                                            month: 'short', 
                                                                            day: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="deadline-actions">
                                                                <button 
                                                                    className="quick-complete-btn"
                                                                    onClick={() => updateStatus(task._id, 'completed')}
                                                                    title="Mark as completed"
                                                                >
                                                                    ✓
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
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
                                            deleteTask={deleteTask}
                                            editTask={editTask}
                                            viewTask={viewTask}
                                        />
                                    ))}
                                </>
                            )}

                            {/* ================= MY TASKS ================= */}
                            {currentPage === "mytasks" && (
                                <>
                                    <div className="page-header">
                                        <div className="header-content">
                                            <div className="header-icon">
                                                <span className="page-icon">👤</span>
                                            </div>
                                            <div className="header-text">
                                                <h2>My Tasks</h2>
                                                <p>Tasks assigned to you</p>
                                            </div>
                                        </div>
                                        <div className="task-summary">
                                            <div className="summary-item">
                                                <span className="summary-number">{tasks.length}</span>
                                                <span className="summary-label">Total</span>
                                            </div>
                                            <div className="summary-item">
                                                <span className="summary-number">{tasks.filter(t => t.status === 'pending').length}</span>
                                                <span className="summary-label">Pending</span>
                                            </div>
                                            <div className="summary-item">
                                                <span className="summary-number">{tasks.filter(t => t.status === 'inprogress').length}</span>
                                                <span className="summary-label">In Progress</span>
                                            </div>
                                            <div className="summary-item">
                                                <span className="summary-number">{tasks.filter(t => t.status === 'completed').length}</span>
                                                <span className="summary-label">Completed</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {tasks.length === 0 && <EmptyState message={"You have no assigned tasks at the moment!"} />}
                                    
                                    <div className="tasks-grid">
                                        {tasks.map(task => (
                                            <TaskCard
                                                key={task._id}
                                                task={task}
                                                updateStatus={updateStatus}
                                                showDeadline={true}
                                                deleteTask={deleteTask}
                                                editTask={editTask}
                                                viewTask={viewTask}
                                            />
                                        ))}
                                    </div>
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
                                            deleteTask={deleteTask}
                                            editTask={editTask}
                                            viewTask={viewTask}
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
                            
                            {/* ================= EDIT MODAL ================= */}
                            {showEditModal && editingTask && (
                                <EditTaskModal
                                    key={editingTask._id}
                                    closeModal={closeEditModal}
                                    token={token}
                                    fetchTasks={fetchTasks}
                                    task={editingTask}
                                />
                            )}
                            
                            {/* ================= VIEW MODAL ================= */}
                            {showViewModal && viewingTask && (
                                <ViewTaskModal
                                    task={viewingTask}
                                    closeModal={closeViewModal}
                                />
                            )}
                            
                            {/* ================= CONFIRM MODAL ================= */}
                            <ConfirmModal
                                isOpen={showConfirmModal}
                                title="Delete Task"
                                message="Are you sure you want to delete this task? This action cannot be undone."
                                onConfirm={confirmDelete}
                                onCancel={cancelDelete}
                            />
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
