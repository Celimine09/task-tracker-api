import type { ProjectStatus, Role } from "@prisma/client";
import prisma from "./prisma.service.js";

export interface UpdateProjectPayload {
  name?: string;
  description?: string | null;
  status?: ProjectStatus;
  startDate?: Date;
  endDate?: Date | null;
}

export const createNewProject = async (
  userId: string,
  name: string,
  description: string | null,
  status: ProjectStatus | null,
  endDate: Date | null,
) => {
  const result = await prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        name,
        description,
        status: status || undefined,
        endDate: endDate,
      },
    });

    await tx.projectMember.create({
      data: {
        projectId: project.id,
        userId: userId,
        role: "OWNER",
      },
    });

    return project;
  });

  return result;
};

export const getAllProject = async (userId: string) => {
  const project = await prisma.project.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    include: {
      members: true,
    },
  });

  return project;
};

export const getProjectById = async (projectId: string, userId: string) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      members: {
        some: {
          userId,
        },
      },
    },
    include: {
      members: true,
    },
  });
  return project;
};

export const updateProject = async (
  userId: string,
  projectId: string,
  dataToUpdate: UpdateProjectPayload,
) => {
  const project = await getProjectById(projectId, userId);
  if (!project) {
    return null;
  }

  const updateProject = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: dataToUpdate,
  });
  return updateProject;
};

export const deleteProject = async (userId: string, projectId: string) => {
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

  const removeProject = await prisma.project.delete({
    where: {
      id: projectId,
    },
  });
  return removeProject;
};

export const addMember = async (
  userId: string,
  projectId: string,
  memberId: string,
  role: Role,
) => {
  const project = await getProjectById(projectId, userId);
  if (!project) {
    return null;
  }

  const requester = project.members.find((m) => m.userId === userId);
  if (requester?.role !== "OWNER" && requester?.role !== "ADMIN") {
    throw {
      statusCode: 403,
      message: "Forbidden: Only OWNER or ADMIN can add members",
    };
  }

  const addMemberToProject = await prisma.projectMember.create({
    data: {
      projectId: projectId,
      userId: memberId,
      role: role,
    },
  });
  return addMemberToProject;
};

export const updateMember = async (
  userId: string,
  projectId: string,
  memberId: string,
  role: Role,
) => {
  const project = await getProjectById(projectId, userId);
  if (!project) {
    return null;
  }

  const requester = project.members.find((m) => m.userId === userId);
  if (requester?.role !== "OWNER" && requester?.role !== "ADMIN") {
    throw {
      statusCode: 403,
      message: "Forbidden: Only OWNER or ADMIN can add members roles",
    };
  }
  const targetMember = project.members.find((m) => m.userId === memberId);
  if (!targetMember) {
    throw { statusCode: 404, message: "Member not found" };
  }
  if (targetMember.role === "OWNER") {
    throw {
      statusCode: 403,
      message: "Forbidden: Cannot change the role of the OWNER",
    };
  }

  const updateData = await prisma.projectMember.update({
    where: {
      projectId_userId: {
        projectId: projectId,
        userId: memberId,
      },
    },
    data: {
      role: role,
    },
  });
  return updateData;
};

export const deleteMember = async (
  userId: string,
  projectId: string,
  memberId: string,
) => {
  const project = await getProjectById(projectId, userId);
  if (!project) {
    return null;
  }

  const requester = project.members.find((m) => m.userId === userId);
  if (requester?.role !== "OWNER" && requester?.role !== "ADMIN") {
    throw {
      statusCode: 403,
      message: "Forbidden: Only OWNER or ADMIN can remove members",
    };
  }

  const targetMember = project.members.find((m) => m.userId === memberId);

  if (!targetMember) {
    throw {
      statusCode: 404,
      message: "Not Found: Member is not in this project",
    };
  }

  if (targetMember.role === "OWNER") {
    throw {
      statusCode: 403,
      message: "Forbidden: Cannot remove the project OWNER",
    };
  }

  const memberRemove = await prisma.projectMember.delete({
    where: {
      projectId_userId: {
        projectId: projectId,
        userId: memberId,
      },
    },
  });
  return memberRemove;
};
