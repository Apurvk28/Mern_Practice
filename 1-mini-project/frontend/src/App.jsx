import { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5002/api/tasks";

const INITIAL_FORM = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Edit Mode state
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const formSectionRef = useRef(null);
  const titleInputRef = useRef(null);

  // Fetch tasks on initial mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get(API_URL);
        setTasks(response.data.tasks || []);
      } catch (err) {
        const message = axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to load tasks. Please try again."
          : "Something went wrong loading tasks.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Form input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  // Start editing a task
  const handleStartEdit = (task) => {
    setEditingTaskId(task._id);
    setFormData({
      title: task.title,
      description: task.description || "",
      status: task.status || "todo",
      priority: task.priority || "medium",
    });
    setError("");
    setSuccess("");

    if (formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setFormData(INITIAL_FORM);
    setError("");
  };

  // Submit form (create or edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle) {
      setError("Task title is required and cannot be empty.");
      return;
    }

    try {
      setSubmitting(true);

      if (editingTaskId) {
        // Edit Task (PATCH)
        const payload = {
          title: trimmedTitle,
          description: formData.description.trim(),
          status: formData.status,
          priority: formData.priority,
        };

        const response = await axios.patch(`${API_URL}/${editingTaskId}`, payload);
        const updatedTask = response.data.task;

        setTasks((prev) =>
          prev.map((task) => (task._id === editingTaskId ? updatedTask : task))
        );

        setEditingTaskId(null);
        setFormData(INITIAL_FORM);
        setSuccess("Task updated successfully!");
      } else {
        // Create Task (POST)
        const payload = {
          title: trimmedTitle,
          description: formData.description.trim(),
          status: formData.status,
          priority: formData.priority,
        };

        const response = await axios.post(API_URL, payload);
        const createdTask = response.data.task;

        setTasks((prev) => [createdTask, ...prev]);
        setFormData(INITIAL_FORM);
        setSuccess("Task created successfully!");
      }
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ||
          (editingTaskId ? "Failed to update task." : "Failed to create task.")
        : "An unexpected error occurred.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete a task
  const handleDelete = async (taskId) => {
    const taskToDelete = tasks.find((t) => t._id === taskId);
    const taskName = taskToDelete ? `"${taskToDelete.title}"` : "this task";

    const confirmed = window.confirm(`Are you sure you want to delete ${taskName}?`);
    if (!confirmed) return;

    try {
      setDeletingId(taskId);
      setError("");
      setSuccess("");

      await axios.delete(`${API_URL}/${taskId}`);

      setTasks((prev) => prev.filter((t) => t._id !== taskId));

      // If currently editing the deleted task, exit edit mode
      if (editingTaskId === taskId) {
        handleCancelEdit();
      }

      setSuccess("Task deleted successfully!");
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || "Failed to delete task. Please try again."
        : "Failed to delete task.";
      setError(message);
    } finally {
      setDeletingId(null);
    }
  };

  // Reset search and filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
  };

  // Combined client-side filtering and search
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search matching title (case-insensitive)
      const matchesSearch = searchQuery.trim() === "" ||
        task.title.toLowerCase().includes(searchQuery.trim().toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;

      // Priority filter
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === "todo").length;
    const inProgress = tasks.filter((t) => t.status === "in-progress").length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    return { total, todo, inProgress, completed };
  }, [tasks]);

  const hasActiveFilters = searchQuery.trim() !== "" || statusFilter !== "all" || priorityFilter !== "all";

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <div className="header-icon" aria-hidden="true">✓</div>
          <div>
            <h1>Task Manager</h1>
            <p>Organize, track, and manage your day efficiently</p>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="stats-bar" aria-label="Task statistics">
          <div className="stat-pill">
            <span className="stat-label">Total</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-pill stat-todo">
            <span className="stat-label">To Do</span>
            <span className="stat-value">{stats.todo}</span>
          </div>
          <div className="stat-pill stat-inprogress">
            <span className="stat-label">In Progress</span>
            <span className="stat-value">{stats.inProgress}</span>
          </div>
          <div className="stat-pill stat-completed">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{stats.completed}</span>
          </div>
        </div>
      </header>

      {/* Global Alerts */}
      {error && (
        <div className="alert alert-error" role="alert">
          <span className="alert-icon" aria-hidden="true">⚠️</span>
          <span className="alert-text">{error}</span>
          <button
            type="button"
            className="alert-close"
            onClick={() => setError("")}
            aria-label="Dismiss error message"
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="alert alert-success" role="status">
          <span className="alert-icon" aria-hidden="true">✓</span>
          <span className="alert-text">{success}</span>
          <button
            type="button"
            className="alert-close"
            onClick={() => setSuccess("")}
            aria-label="Dismiss success message"
          >
            ×
          </button>
        </div>
      )}

      <main className="app-main">
        {/* Task Form Section (Create & Edit) */}
        <section
          ref={formSectionRef}
          className={`form-card ${editingTaskId ? "is-editing-mode" : ""}`}
          aria-labelledby="form-heading"
        >
          <div className="form-card-header">
            <div>
              <h2 id="form-heading">
                {editingTaskId ? "Edit Task" : "Create a New Task"}
              </h2>
              <p className="form-subtitle">
                {editingTaskId
                  ? "Update the details of your selected task below."
                  : "Add a task to your tracker with priority and status."}
              </p>
            </div>
            {editingTaskId && (
              <span className="editing-badge">Editing Mode</span>
            )}
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="task-title">
                Task Title <span className="required-star">*</span>
              </label>
              <input
                ref={titleInputRef}
                id="task-title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Complete quarterly financial review"
                maxLength={120}
                required
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="task-description">Description</label>
              <textarea
                id="task-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add supporting notes, links, or context (optional)..."
                rows={3}
                disabled={submitting}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="task-status">Status</label>
                <select
                  id="task-status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={submitting}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="task-priority">Priority</label>
                <select
                  id="task-priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  disabled={submitting}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting
                  ? editingTaskId
                    ? "Saving Changes..."
                    : "Creating..."
                  : editingTaskId
                  ? "Save Changes"
                  : "Create Task"}
              </button>

              {editingTaskId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                  disabled={submitting}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Task List & Filtering Section */}
        <section className="tasks-card" aria-labelledby="tasks-heading">
          <div className="tasks-header">
            <div>
              <h2 id="tasks-heading">Your Tasks</h2>
              <p className="tasks-subtitle">
                {tasks.length === 0
                  ? "No tasks registered"
                  : `Showing ${filteredTasks.length} of ${tasks.length} task${
                      tasks.length === 1 ? "" : "s"
                    }`}
              </p>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="filter-toolbar" role="search" aria-label="Filter tasks">
            <div className="search-field">
              <span className="search-icon" aria-hidden="true">🔍</span>
              <input
                id="search-input"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks by title..."
                aria-label="Search tasks by title"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search query"
                >
                  ×
                </button>
              )}
            </div>

            <div className="filter-selects">
              <div className="filter-group">
                <label htmlFor="filter-status" className="visually-hidden">
                  Filter by status
                </label>
                <select
                  id="filter-status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  aria-label="Filter by status"
                >
                  <option value="all">All Statuses</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="filter-priority" className="visually-hidden">
                  Filter by priority
                </label>
                <select
                  id="filter-priority"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  aria-label="Filter by priority"
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleResetFilters}
                  title="Reset all active search and filter options"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="loading-state" role="status">
              <div className="spinner" aria-hidden="true"></div>
              <p>Loading your tasks...</p>
            </div>
          )}

          {/* Empty State: No tasks in database */}
          {!loading && tasks.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon" aria-hidden="true">📝</div>
              <h3>No tasks yet</h3>
              <p>Your task list is empty. Use the form above to create your first task!</p>
            </div>
          )}

          {/* Empty State: Tasks exist but none match filters */}
          {!loading && tasks.length > 0 && filteredTasks.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon" aria-hidden="true">🔎</div>
              <h3>No matching tasks found</h3>
              <p>No tasks matched your current search and filter combination.</p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleResetFilters}
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Task List */}
          {!loading && filteredTasks.length > 0 && (
            <ul className="task-list" aria-label="Task list">
              {filteredTasks.map((task) => {
                const isItemEditing = editingTaskId === task._id;
                const isItemDeleting = deletingId === task._id;

                const statusLabel =
                  task.status === "todo"
                    ? "To Do"
                    : task.status === "in-progress"
                    ? "In Progress"
                    : "Completed";

                const priorityLabel =
                  task.priority === "high"
                    ? "High"
                    : task.priority === "medium"
                    ? "Medium"
                    : "Low";

                return (
                  <li
                    key={task._id}
                    className={`task-card ${isItemEditing ? "card-is-editing" : ""} ${
                      task.status === "completed" ? "card-is-completed" : ""
                    }`}
                  >
                    <div className="task-card-main">
                      <div className="task-badges">
                        <span className={`badge badge-status badge-status-${task.status}`}>
                          {statusLabel}
                        </span>
                        <span className={`badge badge-priority badge-prio-${task.priority}`}>
                          {priorityLabel} Priority
                        </span>
                      </div>

                      <h3 className="task-title">{task.title}</h3>

                      {task.description ? (
                        <p className="task-description">{task.description}</p>
                      ) : (
                        <p className="task-description task-no-desc">
                          No description provided
                        </p>
                      )}

                      <div className="task-footer">
                        {task.createdAt && (
                          <span className="task-date">
                            Created {new Date(task.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="task-actions">
                      <button
                        type="button"
                        className="btn btn-action btn-edit"
                        onClick={() => handleStartEdit(task)}
                        disabled={submitting || deletingId !== null}
                        aria-label={`Edit task "${task.title}"`}
                        title="Edit task"
                      >
                        {isItemEditing ? "Editing..." : "Edit"}
                      </button>

                      <button
                        type="button"
                        className="btn btn-action btn-delete"
                        onClick={() => handleDelete(task._id)}
                        disabled={isItemDeleting || submitting}
                        aria-label={`Delete task "${task.title}"`}
                        title="Delete task"
                      >
                        {isItemDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
