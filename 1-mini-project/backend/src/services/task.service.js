import Task from "../models/task.model.js";

const validateTaskData = (data, isUpdate = false) => {
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

  if (!isUpdate && !data.title?.trim()) {
    const error = new Error("Title is required and cannot be empty");
    error.statusCode = 400;
    throw error;
  }

  if (isUpdate && "title" in data && !data.title?.trim()) {
    const error = new Error("Title cannot be empty");
    error.statusCode = 400;
    throw error;
  }

  if (
    "status" in data &&
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
    typeof data.description !== "string"
  ) {
    const error = new Error("Description must be a string");
    error.statusCode = 400;
    throw error;
  }

  if ("title" in data && typeof data.title !== "string") {
    const error = new Error("Title must be a string");
    error.statusCode = 400;
    throw error;
  }
};

export const createTaskService = async ({
  title,
  description,
  status,
  priority,
}) => {
  validateTaskData({ title, description, status, priority });

  const task = await Task.create({
    title: title.trim(),
    description,
    status,
    priority,
  });

  return task;
};

export const getTasksService = async () => {
  const tasks = await Task.find();
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

export const updateTaskService = async (id, data) => {
  validateTaskData(data, true);

  const updateData = { ...data };

  if (typeof updateData.title === "string") {
    updateData.title = updateData.title.trim();
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
