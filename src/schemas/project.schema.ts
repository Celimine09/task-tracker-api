import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(2).optional(),
  status: z.enum(["ACTIVE", "ON_HOLD", "COMPLETED"]).optional(),
  endDate: z.coerce.date().optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(2).optional(),
  status: z.enum(["ACTIVE", "ON_HOLD", "COMPLETED"]).optional(),
  endDate: z.coerce.date().optional(),
});

export const addMemberSchema = z.object({
  memberId: z.string().uuid("Invalid user ID"),
  role: z.enum(["OWNER", "ADMIN", "MEMBER"]),
});

export const updateMemberRoleSchema = z.object({
  memberId: z.string().uuid("Invalid user ID"),
  role: z.enum(["ADMIN", "MEMBER"], {
    message: "Role can be only ADMIN or MEMBER",
  }),
});
