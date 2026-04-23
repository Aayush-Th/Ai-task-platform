const express = require("express");
const {
  createTask,
  getTasks,
  getTaskById,
  runTask,
  deleteTask,
  retryTask,
  getTaskStats,
  getTaskActivity
} = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");
const userRateLimit = require("../middleware/userRateLimit");
const validate = require("../middleware/validate");
const { createTaskSchema, listTasksSchema } = require("../validation/taskValidation");

const router = express.Router();

router.use(authMiddleware);
router.use(userRateLimit);
router.get("/", validate(listTasksSchema, "query"), getTasks);
router.get("/stats", getTaskStats);
router.get("/activity", getTaskActivity);
router.post("/", validate(createTaskSchema), createTask);
router.post("/:id/run", runTask);
router.post("/:id/retry", retryTask);
router.delete("/:id", deleteTask);
router.get("/:id", getTaskById);

module.exports = router;
