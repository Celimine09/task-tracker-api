import {
  addMember,
  createNewProject,
  deleteMember,
  deleteProject,
  getAllProject,
  getProjectById,
  updateMember,
  updateProject,
} from "@/services/project.service";
import { type Response } from "express";
import { type AuthRequest } from "@/middlewares/auth.middleware";

export const createProject = async (req: AuthRequest, res: Response) => {
  const { name, description } = req.body;

  if (!req.user || typeof req.user === "string") {
    res.status(401).json({ message: "Unauthorized: Invalid token payload" });
    return;
  }
  const { userId } = req.user as { userId: string };
  const { status, endDate } = req.body;
  const project = await createNewProject(
    userId,
    name,
    description,
    status,
    endDate,
  );
  res.status(201).json({
    status: "success",
    message: "Project created successfully",
    project,
  });
};

export const getProject = async (req: AuthRequest, res: Response) => {
  if (!req.user || typeof req.user === "string") {
    res.status(401).json({ message: "Unauthorized: Invalid token payload" });
    return;
  }

  const { userId } = req.user as { userId: string };
  const project = await getAllProject(userId);
  res.status(200).json({
    status: "success",
    data: project,
  });
};

export const getProjectDetail = async (req: AuthRequest, res: Response) => {
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
  const project = await getProjectById(projectId, userId);
  if (!project) {
    res.status(404).json({ message: "Project not found or unauthorized" });
    return;
  }
  res.status(200).json({
    status: "success",
    data: project,
  });
};

export const updateProjectDetail = async (req: AuthRequest, res: Response) => {
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
  const dataToUpdate = req.body;
  const project = await updateProject(userId, projectId, dataToUpdate);
  if (!project) {
    res.status(404).json({ message: "Project not found or unauthorized" });
    return;
  }

  res.status(200).json({
    status: "success",
    message: "Project updated successfully",
    data: project,
  });
};

export const deleteProjectDetail = async (req: AuthRequest, res: Response) => {
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
  const project = await deleteProject(userId, projectId);
  if (!project) {
    res.status(404).json({ message: "Project not found or unauthorized" });
    return;
  }

  res.status(200).json({
    status: "success",
    message: "Project deleted successfully",
  });
};

export const addProjectMember = async (req: AuthRequest, res: Response) => {
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
  const { memberId, role } = req.body;

  const project = await addMember(userId, projectId, memberId, role);
  if (!project) {
    res.status(404).json({ message: "Project not found or unauthorized" });
    return;
  }

  res.status(200).json({
    status: "success",
    message: "Member added successfully",
  });
};

export const updateMemberRole = async (req: AuthRequest, res: Response) => {
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
  const { memberId, role } = req.body;

  const project = await updateMember(userId, projectId, memberId, role);
  if (!project) {
    res.status(404).json({ message: "Project not found or unauthorized" });
    return;
  }

  res.status(200).json({
    status: "success",
    message: "Changed member role successfully",
  });
};

export const deleteProjectMember = async (req: AuthRequest, res: Response) => {
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
  const { memberId } = req.body;

  const project = await deleteMember(userId, projectId, memberId);
  if (!project) {
    res.status(404).json({ message: "Project not found or unauthorized" });
    return;
  }

  res.status(200).json({
    status: "success",
    message: "Member deleted successfully",
  });
};
