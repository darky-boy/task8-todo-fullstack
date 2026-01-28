const express = require("express");
const router = express.Router();

const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus
} = require("../controllers/taskController");

// Get all tasks & create task
router.route("/")
  .get(getAllTasks)
  .post(createTask);

// Get, update, delete task by ID
router.route("/:id")
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

// Update task status
router.patch("/:id/status", updateTaskStatus);

module.exports = router;
