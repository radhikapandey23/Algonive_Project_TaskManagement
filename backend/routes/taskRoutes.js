const express = require("express");
const {
    createTask,
    getMyTasks,
    updateTaskStatus,
    updateTask,
    deleteTask,
    getOwnTask,
    completeTask,
    getCompletedTasks
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createTask);
router.get("/", protect, getMyTasks);
router.put("/:id", protect, updateTask);
router.patch("/:id/status", protect, updateTaskStatus);
router.delete("/:id", protect, deleteTask);
router.get('/my', protect, getOwnTask);
router.patch("/:id/complete", protect, completeTask);

// get completed tasks
router.get("/completed", protect, getCompletedTasks);

module.exports = router;
