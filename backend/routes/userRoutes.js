const express = require('express')
const User = require('../models/User.js')
const authMiddleware = require("../middleware/authMiddleware.js")

const router = express.Router();

// GET ALL USERS (for Assign To dropdown)
router.get("/", authMiddleware, async (req, res) => {
    try {
        const users = await User.find().select("name email");
        res.json({ users });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
});

module.exports = router;   // ✅ YE SAHI HAI
