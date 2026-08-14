const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask,
    toggleComplete
} = require("../controllers/taskController");


// All task routes require authentication
router.use(authenticateToken);


// Create task
router.post("/", createTask);

// Get all tasks
router.get("/", getTasks);

// Get one task
router.get("/:id", getTask);

// Update task
router.put("/:id", updateTask);

// Delete task
router.delete("/:id", deleteTask);

// Complete/uncomplete task
router.patch("/:id/complete", toggleComplete);


module.exports = router;