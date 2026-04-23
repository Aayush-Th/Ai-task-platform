const Task = require("../models/Task");
const { enqueueTask } = require("../queue/taskQueue");

const createTask = async (req, res, next) => {
  try {
    const { title, inputText, operation } = req.body;

    const task = await Task.create({
      userId: req.user._id,
      title,
      inputText,
      operation,
      status: "pending",
      logs: [`${new Date().toISOString()} - Task created`]
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const {
      q = "",
      status = "all",
      operation = "all",
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 10
    } = req.query;

    const filter = { userId: req.user._id };

    if (q) {
      filter.title = { $regex: q, $options: "i" };
    }
    if (status !== "all") {
      filter.status = status;
    }
    if (operation !== "all") {
      filter.operation = operation;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      Task.countDocuments(filter)
    ]);

    res.json({
      data: tasks,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    next(error);
  }
};

const runTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = "pending";
    task.result = "";
    task.startedAt = null;
    task.completedAt = null;
    task.logs.push(`${new Date().toISOString()} - Task queued for processing`);
    await task.save();

    await enqueueTask(task._id.toString());
    res.json({ message: "Task queued", task });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    return res.json({ message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};

const retryTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = "pending";
    task.result = "";
    task.startedAt = null;
    task.completedAt = null;
    task.logs.push(`${new Date().toISOString()} - Task retried`);
    await task.save();
    await enqueueTask(task._id.toString());

    return res.json({ message: "Task retry queued", task });
  } catch (error) {
    next(error);
  }
};

const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [statusAgg, operationAgg, dailyAgg] = await Promise.all([
      Task.aggregate([
        { $match: { userId } },
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),
      Task.aggregate([
        { $match: { userId } },
        { $group: { _id: "$operation", count: { $sum: 1 } } }
      ]),
      Task.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } },
        { $limit: 14 }
      ])
    ]);

    res.json({
      status: statusAgg,
      operation: operationAgg,
      daily: dailyAgg
    });
  } catch (error) {
    next(error);
  }
};

const getTaskActivity = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .limit(15)
      .select("title status updatedAt");

    const events = tasks.map((task) => ({
      id: task._id,
      message: `Task "${task.title}" is ${task.status}`,
      status: task.status,
      updatedAt: task.updatedAt
    }));

    res.json(events);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  runTask,
  deleteTask,
  retryTask,
  getTaskStats,
  getTaskActivity
};
