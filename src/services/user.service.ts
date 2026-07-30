import prisma from "./prisma.service";

export const findAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      surname: true,
      createdAt: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return users;
};
