const Joi = require("joi");

const operationValues = ["uppercase", "lowercase", "reverse", "wordcount"];
const statusValues = ["pending", "running", "success", "failed"];

const createTaskSchema = Joi.object({
  title: Joi.string().trim().min(2).max(120).required(),
  inputText: Joi.string().trim().min(1).max(10000).required(),
  operation: Joi.string()
    .valid(...operationValues)
    .required()
});

const listTasksSchema = Joi.object({
  q: Joi.string().trim().allow(""),
  status: Joi.string()
    .valid("all", ...statusValues)
    .default("all"),
  operation: Joi.string()
    .valid("all", ...operationValues)
    .default("all"),
  sortBy: Joi.string().valid("createdAt", "updatedAt", "title").default("createdAt"),
  sortOrder: Joi.string().valid("asc", "desc").default("desc"),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10)
});

module.exports = {
  createTaskSchema,
  listTasksSchema
};
