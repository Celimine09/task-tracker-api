import type { TaskStatus, TaskPriority } from "@prisma/client";
import { getProjectById } from "./project.service";
import prisma from "./prisma.service";

export interface UpdateTaskPayload {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string | null;
  endDate?: Date | null;
}

export const createNewTask = async (
  userId: string,
  projectId: string,
  title: string,
  description: string | null,
  status: TaskStatus,
  priority: TaskPriority,
  assigneeId: string | null,
) => {
  const project = await getProjectById(projectId, userId);
  if (!project) {
    return null;
  }

  const task = await prisma.task.create({
    data: {
      projectId: projectId,
      title: title,
      description: description,
      status: status,
      creatorId: userId,
      priority: priority,
      assigneeId: assigneeId,
    },
  });
  return task;
};

export const getTask = async (
  userId: string,
  projectId: string,
  taskId: string,
) => {
  const project = await getProjectById(projectId, userId);
  if (!project) {
    return null;
  }

  const tasks = await prisma.task.findFirst({
    where: {
      id: taskId,
      projectId: projectId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return tasks;
};

export const getAllTask = async (userId: string, projectId: string) => {
  const project = await getProjectById(projectId, userId);
  if (!project) {
    return null;
  }

  const tasks = await prisma.task.findMany({
    where: {
      projectId: projectId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return tasks;
};

export const updateTaskDetail = async (
  userId: string,
  projectId: string,
  taskId: string,
  dataToUpdate: UpdateTaskPayload,
) => {
  const project = await getProjectById(projectId, userId);
  if (!project) {
    return null;
  }

  const updateTask = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: dataToUpdate,
  });
  return updateTask;
};

export const removeTask = async (
  userId: string,
  projectId: string,
  taskId: string,
) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      members: {
        some: {
          userId: userId,
          role: "OWNER",
        },
      },
    },
  });

  if (!project) {
    return null;
  }

  const deleteTask = await prisma.task.delete({
    where: {
      id: taskId,
    },
  });
  return deleteTask;
};
