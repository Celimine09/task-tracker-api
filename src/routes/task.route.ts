import {
  createTask,
  deleteTask,
  getAllTaskProject,
  getTaskById,
  updateTask,
} from "@/controllers/task.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { validateData } from "@/middlewares/validate.middleware";
import { createTaskSchema, updateTaskSchema } from "@/schemas/task.schema";
import { catchAsync } from "@/utils/catchAsync";
import { Router } from "express";

const router = Router();

router.post(
  "/:id/tasks",
  authenticate,
  validateData(createTaskSchema),
  catchAsync(createTask),
);
router.get("/:id/tasks/:taskId", authenticate, catchAsync(getTaskById));
router.get("/:id/tasks", authenticate, catchAsync(getAllTaskProject));
router.patch(
  "/:id/tasks/:taskId",
  authenticate,
  validateData(updateTaskSchema),
  catchAsync(updateTask),
);
router.delete("/:id/tasks/:taskId", authenticate, catchAsync(deleteTask));

export default router;
