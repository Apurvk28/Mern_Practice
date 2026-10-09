# Task Manager Mini-Project (MERN Stack)

A full-stack Task Manager web application built with Node.js, Express, MongoDB (Mongoose), and React (Vite).

---

## Features

- **Full CRUD Operations**:
  - Create tasks with title, description, status, and priority.
  - Read & view all tasks with real-time statistics (Total, To Do, In Progress, Completed).
  - Update tasks in-place reusing the form with pre-filled inputs and cancel support.
  - Delete tasks with confirmation dialogs.
- **Search & Filtering**:
  - Real-time client-side search by task title.
  - Filter tasks by status (`All`, `To Do`, `In Progress`, `Completed`).
  - Filter tasks by priority (`All`, `Low`, `Medium`, `High`).
  - Combined multi-criteria filtering with quick reset options.
- **Robust Validation & Error Handling**:
  - Backend schema and field-level validation (title required, enums for status/priority, disallowed unexpected fields).
  - Centralized error-handling middleware handling CastError (invalid MongoDB IDs), validation errors, and server errors.
  - Frontend user feedback with non-intrusive alert banners and in-flight loading states.
- **Modern Responsive UI**:
  - Mobile-first, fully responsive design using semantic HTML and vanilla CSS.
  - Distinct badges for status and priority.

---

## Project Structure

```text
1-mini-project/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection (db.js)
│   │   ├── controllers/     # Route controller handlers (task.controller.js)
│   │   ├── middleware/      # Error handling middleware (error.middleware.js)
│   │   ├── models/          # Mongoose schema and model (task.model.js)
│   │   ├── routes/          # Express route definitions (task.routes.js)
│   │   └── services/        # Business logic and validations (task.service.js)
│   ├── .env.example         # Sample environment configuration
│   ├── package.json
│   └── server.js            # Server entry point (port 5002)
└── frontend/
    ├── src/
    │   ├── App.jsx          # Main Task Manager application component
    │   ├── App.css          # Application component styling & responsive design
    │   ├── index.css        # CSS variables, tokens, and foundation styles
    │   └── main.jsx         # React root entry point
    ├── index.html
    └── package.json
```

---

## Prerequisites

- **Node.js** (v18.x or later, tested on Node v25)
- **npm** (v9.x or later)
- **MongoDB** running locally on port `27017` or via MongoDB Atlas

---

## Installation & Setup

### 1. Backend Setup

```bash
cd 1-mini-project/backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

Ensure `.env` contains:
```env
PORT=5002
MONGO_URI=mongodb://localhost:27017/task-manager
```

Start the backend server in watch mode:
```bash
npm run dev
# Server runs on http://localhost:5002
```

### 2. Frontend Setup

```bash
cd 1-mini-project/frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
# Application runs on http://localhost:5173
```

---

## API Endpoints

Base URL: `http://localhost:5002/api`

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/tasks` | Get all tasks (sorted newest first) | None |
| `GET` | `/tasks/:id` | Get single task by ID | None |
| `POST` | `/tasks` | Create a new task | `{ title: string, description?: string, status?: "todo" \| "in-progress" \| "completed", priority?: "low" \| "medium" \| "high" }` |
| `PATCH` | `/tasks/:id` | Update task by ID | `{ title?: string, description?: string, status?: string, priority?: string }` |
| `DELETE` | `/tasks/:id` | Delete task by ID | None |
