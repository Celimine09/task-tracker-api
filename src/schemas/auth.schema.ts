import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Invalid email format" }),
  password: z
    .string({ message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      "Password must be at least 8 chars, 1 uppercase, 1 lowercase, 1 number",
    ),
  name: z
    .string({ message: "Name is required" })
    .min(2, { message: "Name must be at least 2 characters long" }),
});

export const loginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Invalid email format" }),
  password: z.string({ message: "Password is required" }),
});

export const googleAuthSchema = z.object({
  code: z.string({ message: "Code is required" }),
});
