import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes.js";
import userRoutes from "./routes/user.routes.js";
import logger from "./middleware/logger.middleware.js";
import requestInfo from "./middleware/requestInfo.middleware.js";

const app = express();
app.use(logger);
app.use(requestInfo);

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.use("/", healthRoutes);
app.use("/api", userRoutes);

export default app;