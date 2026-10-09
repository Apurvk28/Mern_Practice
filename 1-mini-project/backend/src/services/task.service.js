import Task from "../models/task.model.js";

const validateTaskData = (data, isUpdate = false) => {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    const error = new Error("Request body must be an object");
    error.statusCode = 400;
    throw error;
  }

  const allowedFields = ["title", "description", "status", "priority"];

  const invalidFields = Object.keys(data).filter(
    (field) => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {
    const error = new Error(
      `Invalid field(s): ${invalidFields.join(", ")}`
    );
    error.statusCode = 400;
    throw error;
  }

  if (!isUpdate) {
    if (data.title === undefined || typeof data.title !== "string" || !data.title.trim()) {
      const error = new Error("Title is required and cannot be empty");
      error.statusCode = 400;
      throw error;
    }
  }

  if (isUpdate && "title" in data) {
    if (typeof data.title !== "string" || !data.title.trim()) {
      const error = new Error("Title cannot be empty");
      error.statusCode = 400;
      throw error;
    }
  }

  if (
    "status" in data &&
    data.status !== undefined &&
    !["todo", "in-progress", "completed"].includes(data.status)
  ) {
    const error = new Error(
      "Invalid status. Use todo, in-progress, or completed"
    );
    error.statusCode = 400;
    throw error;
  }

  if (
    "priority" in data &&
    data.priority !== undefined &&
    !["low", "medium", "high"].includes(data.priority)
  ) {
    const error = new Error(
      "Invalid priority. Use low, medium, or high"
    );
    error.statusCode = 400;
    throw error;
  }

  if (
    "description" in data &&
    data.description !== undefined &&
    typeof data.description !== "string"
  ) {
    const error = new Error("Description must be a string");
    error.statusCode = 400;
    throw error;
  }
};

export const createTaskService = async (data = {}) => {
  validateTaskData(data, false);

  const taskData = {
    title: data.title.trim(),
  };

  if (data.description !== undefined) {
    taskData.description = data.description.trim();
  }

  if (data.status !== undefined) {
    taskData.status = data.status;
  }

  if (data.priority !== undefined) {
    taskData.priority = data.priority;
  }

  const task = await Task.create(taskData);

  return task;
};

export const getTasksService = async () => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  return tasks;
};

export const getTaskByIdService = async (id) => {
  const task = await Task.findById(id);

  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  return task;
};

export const updateTaskService = async (id, data = {}) => {
  validateTaskData(data, true);

  const updateData = {};

  if ("title" in data) {
    updateData.title = data.title.trim();
  }

  if ("description" in data) {
    updateData.description = typeof data.description === "string" ? data.description.trim() : "";
  }

  if ("status" in data) {
    updateData.status = data.status;
  }

  if ("priority" in data) {
    updateData.priority = data.priority;
  }

  const task = await Task.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  return task;
};

export const deleteTaskService = async (id) => {
  const task = await Task.findByIdAndDelete(id);

  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  return task;
};
