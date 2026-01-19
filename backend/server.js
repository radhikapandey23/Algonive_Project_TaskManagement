const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes.js");
const Task = require('./models/Tasks.js') // correct path se import karo


require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);


// database connect
connectDB();

// server.js ke end me after app.listen or db connect

// Deadline reminder check (every 1 hour)
setInterval(async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // start of today
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); // next day

        const tasksDueSoon = await Task.find({
            dueDate: { $gte: today, $lte: tomorrow },
            status: { $ne: "completed" }
        }).populate("assignedTo", "name email");

        tasksDueSoon.forEach(task => {
            console.log(`Reminder: Task "${task.title}" is due on ${task.dueDate.toLocaleDateString()} for ${task.assignedTo.name}`);
            // yahan email ya push notification bhej sakte ho
        });
    } catch (err) {
        console.error("Error checking deadlines:", err);
    }
}, 3600000); // 1 hour interval


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
