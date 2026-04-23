require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const connection = require("../config/redis");
const Task = require("../models/Task");
const { processTaskOperation } = require("../services/taskProcessor");
const { TASK_QUEUE_NAME } = require("./taskQueue");

const appendLog = (task, message) => {
  task.logs.push(`${new Date().toISOString()} - ${message}`);
};

const processJob = async (payload) => {
  const { taskId } = JSON.parse(payload);
  const task = await Task.findById(taskId);
  if (!task) return;

  task.status = "running";
  task.startedAt = new Date();
  appendLog(task, "Task started");
  await task.save();

  try {
    const result = processTaskOperation(task.inputText, task.operation);
    task.result = result;
    task.status = "success";
    task.completedAt = new Date();
    appendLog(task, "Task completed successfully");
  } catch (error) {
    task.status = "failed";
    task.completedAt = new Date();
    appendLog(task, `Task failed: ${error.message}`);
  }

  await task.save();
};

const startWorker = async () => {
  await connectDB();
  console.log("Worker is ready");

  // Blocking pop loop keeps this process dedicated to queue consumption.
  while (true) {
    try {
      const response = await connection.brpop(TASK_QUEUE_NAME, 0);
      if (!response || response.length < 2) continue;
      const payload = response[1];
      await processJob(payload);
    } catch (error) {
      console.error("Worker error:", error.message);
    }
  }
};

startWorker().catch((error) => {
  console.error("Failed to start worker:", error.message);
  mongoose.connection.close();
  process.exit(1);
});
