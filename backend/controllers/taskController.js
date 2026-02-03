const Task = require("../models/Tasks")
// CREATE TASK
exports.createTask = async (req, res) => {
    try {
        const { title, description, assignedTo, dueDate } = req.body;

        const task = await Task.create({
            title,
            description,
            assignedTo,
            dueDate,
            createdBy: req.user.id
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET MY TASKS
exports.getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate("createdBy", "name")
            .populate("assignedTo", "name");

        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch completed tasks" });
    }
}

// UPDATE STATUS
exports.updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE TASK
exports.updateTask = async (req, res) => {
    try {
        const { title, description, assignedTo, dueDate } = req.body;

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description, assignedTo, dueDate },
            { new: true }
        ).populate("createdBy", "name")
         .populate("assignedTo", "name");

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//get own task

exports.getOwnTask = async (req, res) => {
    try {
        const tasks = await Task.find({
            assignedTo: req.user.id
        }).populate("assignedTo", "name")
            .populate("createdBy", "name email");;

        res.json(tasks);

    } catch (err) {
        res.status(500).json({ message: "Failed to fetch my tasks" });
    }
}

// complete task
exports.completeTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        task.status = "completed";   // 🔥 YAHI MAIN LINE HAI
        await task.save();

        res.json({ message: "Task marked as completed", task });
    } catch (err) {
        res.status(500).json({ message: "Failed to complete task" });
    }
};

exports.getCompletedTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ status: "completed" })
            .populate("createdBy", "name")
            .populate("assignedTo", "name");

        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch completed tasks" });
    }
};
