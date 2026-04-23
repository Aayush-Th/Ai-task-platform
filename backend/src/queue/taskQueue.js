const connection = require("../config/redis");

const TASK_QUEUE_NAME = "task-processing-queue";

const enqueueTask = async (taskId) => {
  const payload = JSON.stringify({ taskId, queuedAt: new Date().toISOString() });
  await connection.lpush(TASK_QUEUE_NAME, payload);
};

module.exports = {
  TASK_QUEUE_NAME,
  enqueueTask
};
