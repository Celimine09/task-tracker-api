import type { AuthRequest } from "../middlewares/auth.middleware.js";
import {
  createNewTask,
  getAllTask,
  getTask,
  removeTask,
  updateTaskDetail,
} from "../services/task.service.js";
import { type Response } from "express";

export const createTask = async (req: AuthRequest, res: Response) => {
  if (!req.user || typeof req.user === "string") {
    res.status(401).json({ message: "Unauthorized: Invalid token payload" });
    return;
  }
  const { userId } = req.user as { userId: string };
  if (!req.params.id || typeof req.params.id !== "string") {
    res.status(401).json({ message: "Unauthorized: Invalid project payload" });
    return;
  }
  const projectId = req.params.id;
  const { title, description, status, priority, assigneeId } = req.body;

  const task = await createNewTask(
    userId,
    projectId,
    title,
    description,
    status,
    priority,
    assigneeId,
  );
  if (!task) {
    res
      .status(403)
      .json({ message: "Forbidden: You are not a member of this project" });
    return;
  }

  res.status(200).json({
    status: "success",
    message: "Create Task Successfully",
    data: task,
  });
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
  if (!req.user || typeof req.user === "string") {
    res.status(401).json({ message: "Unauthorized: Invalid token payload" });
    return;
  }
  const { userId } = req.user as { userId: string };
  if (!req.params.id || typeof req.params.id !== "string") {
    res.status(401).json({ message: "Unauthorized: Invalid project payload" });
    return;
  }
  const projectId = req.params.id;
  const { taskId } = req.body;

  const task = await getTask(userId, projectId, taskId);
  if (!task) {
    res
      .status(403)
      .json({ message: "Forbidden: You are not a member of this project" });
    return;
  }

  res.status(200).json({
    status: "success",
    message: "Get task successfully",
    data: task,
  });
};

export const getAllTaskProject = async (req: AuthRequest, res: Response) => {
  if (!req.user || typeof req.user === "string") {
    res.status(401).json({ message: "Unauthorized: Invalid token payload" });
    return;
  }
  const { userId } = req.user as { userId: string };
  if (!req.params.id || typeof req.params.id !== "string") {
    res.status(401).json({ message: "Unauthorized: Invalid project payload" });
    return;
  }
  const projectId = req.params.id;

  const task = await getAllTask(userId, projectId);
  if (!task) {
    res
      .status(403)
      .json({ message: "Forbidden: You are not a member of this project" });
    return;
  }

  res.status(200).json({
    status: "success",
    message: "Get all task successfully",
    data: task,
  });
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  if (!req.user || typeof req.user === "string") {
    res.status(401).json({ message: "Unauthorized: Invalid token payload" });
    return;
  }
  const { userId } = req.user as { userId: string };
  if (!req.params.id || typeof req.params.id !== "string") {
    res.status(401).json({ message: "Unauthorized: Invalid project payload" });
    return;
  }
  const projectId = req.params.id;
  if (!req.params.taskId || typeof req.params.taskId !== "string") {
    res.status(401).json({ message: "Unauthorized: Invalid project payload" });
    return;
  }
  const taskId = req.params.taskId;

  const dataToUpdate = req.body;
  const task = await updateTaskDetail(userId, projectId, taskId, dataToUpdate);
  if (!task) {
    res.status(403).json({
      message:
        "Forbidden: You are not a member of this project or task not found",
    });
    return;
  }

  res.status(200).json({
    status: "success",
    message: "Task updated successfully",
    data: task,
  });
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  if (!req.user || typeof req.user === "string") {
    res.status(401).json({ message: "Unauthorized: Invalid token payload" });
    return;
  }
  const { userId } = req.user as { userId: string };
  if (!req.params.id || typeof req.params.id !== "string") {
    res.status(401).json({ message: "Unauthorized: Invalid project payload" });
    return;
  }
  const projectId = req.params.id;
  if (!req.params.taskId || typeof req.params.taskId !== "string") {
    res.status(401).json({ message: "Unauthorized: Invalid project payload" });
    return;
  }
  const taskId = req.params.taskId;

  const task = await removeTask(userId, projectId, taskId);
  if (!task) {
    res.status(403).json({
      message:
        "Forbidden: You are not a member of this project or task not found",
    });
    return;
  }

  res.status(200).json({
    status: "success",
    message: "Task deleted successfully",
  });
};
