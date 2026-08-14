const db = require("../config/database");

// CREATE TASK
const createTask = (req, res) => {
    const {
        title,
        description,
        priority,
        category,
        due_date
    } = req.body;

    const allowedPriorities = [
        "low",
        "medium",
        "high"
    ];

    const allowedCategories = [
        "General",
        "School",
        "Work",
        "Personal",
        "Shopping",
        "Other"
    ];

    if (
        priority &&
        !allowedPriorities.includes(priority)
    ) {
        return res.status(400).json({
            message: "Invalid priority"
        });
    }

    if (
        category &&
        !allowedCategories.includes(category)
    ) {
        return res.status(400).json({
            message: "Invalid category"
        });
    }

    if (!title) {
        return res.status(400).json({
            message: "Task title is required"
        });
    }

    const sql = `
        INSERT INTO tasks
        (user_id, title, description, priority, category, due_date)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
        req.user.id,
        title,
        description || null,
        priority || "medium",
        category || "General",
        due_date || null
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to create task"
            });
        }

        res.status(201).json({
            message: "Task created successfully",
            taskId: result.insertId
        });
    });
};


// GET ALL USER TASKS
const getTasks = (req, res) => {

    const sql = `
        SELECT *
        FROM tasks
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [req.user.id], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to retrieve tasks"
            });
        }

        res.status(200).json({
            tasks: results
        });
    });
};


// GET ONE TASK
const getTask = (req, res) => {

    const taskId = req.params.id;

    const sql = `
        SELECT *
        FROM tasks
        WHERE id = ? AND user_id = ?
    `;

    db.query(
        sql,
        [taskId, req.user.id],
        (err, results) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "Task not found"
                });
            }

            res.status(200).json({
                task: results[0]
            });
        }
    );
};


// UPDATE TASK
const updateTask = (req, res) => {

    const taskId = req.params.id;

    const {
        title,
        description,
        priority,
        category,
        due_date
    } = req.body;

    const allowedPriorities = [
        "low",
        "medium",
        "high"
    ];

    const allowedCategories = [
        "General",
        "School",
        "Work",
        "Personal",
        "Shopping",
        "Other"
    ];

    if (
        priority &&
        !allowedPriorities.includes(priority)
    ) {
        return res.status(400).json({
            message: "Invalid priority"
        });
    }

    if (
        category &&
        !allowedCategories.includes(category)
    ) {
        return res.status(400).json({
            message: "Invalid category"
        });
    }

    if (!title) {
        return res.status(400).json({
            message: "Task title is required"
        });
    }

    const sql = `
        UPDATE tasks
        SET
            title = ?,
            description = ?,
            priority = ?,
            category = ?,
            due_date = ?
        WHERE id = ? AND user_id = ?
    `;

    const values = [
        title,
        description || null,
        priority || "medium",
        category || "General",
        due_date || null,
        taskId,
        req.user.id
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to update task"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task updated successfully"
        });
    });
};


// DELETE TASK
const deleteTask = (req, res) => {

    const taskId = req.params.id;

    const sql = `
        DELETE FROM tasks
        WHERE id = ? AND user_id = ?
    `;

    db.query(
        sql,
        [taskId, req.user.id],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to delete task"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Task not found"
                });
            }

            res.status(200).json({
                message: "Task deleted successfully"
            });
        }
    );
};


// MARK TASK AS COMPLETED / UNCOMPLETED
const toggleComplete = (req, res) => {

    const taskId = req.params.id;

    const sql = `
        UPDATE tasks
        SET completed = NOT completed
        WHERE id = ? AND user_id = ?
    `;

    db.query(
        sql,
        [taskId, req.user.id],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to update task"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Task not found"
                });
            }

            res.status(200).json({
                message: "Task completion status updated"
            });
        }
    );
};


module.exports = {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask,
    toggleComplete
};