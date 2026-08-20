import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route";
import projectRouter from "./routes/project.route";
import taskRouter from "./routes/task.route";
import userRouter from "./routes/user.route";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/projects", taskRouter);
app.use("/api/v1/users", userRouter);
app.use(errorHandler);

export default app;
