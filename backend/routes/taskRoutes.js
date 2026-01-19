const express = require("express");
const {
    createTask,
    getMyTasks,
    updateTaskStatus,
    getOwnTask,
    completeTask,
    getCompletedTasks
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createTask);
router.get("/", protect, getMyTasks);
router.put("/:id", protect, updateTaskStatus);
router.get('/my', protect, getOwnTask);
router.patch("/:id/complete", protect, completeTask);

// get completed tasks
router.get("/completed", protect, getCompletedTasks);

module.exports = router;
