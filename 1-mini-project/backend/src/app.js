import express from "express";
import taskRoutes from "./routes/task.routes.js";
import errorHandler from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());

app.get("/test", (req, res) => {
  res.json({
    message: "App is working",
  });
});

app.use("/api", taskRoutes);
app.use(errorHandler);

export default app;