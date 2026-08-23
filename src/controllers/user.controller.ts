import { type Request, type Response } from "express";
import { findAllUsers } from "../services/user.service.js";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await findAllUsers();

  res.status(200).json({
    status: "success",
    data: users,
  });
};
