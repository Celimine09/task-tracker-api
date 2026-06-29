import type { AuthRequest } from "@/middlewares/auth.middleware";
import { loginGoogle, loginUser, registerUser } from "@/services/auth.service";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/services/token.service";
import { type Request, type Response } from "express";

export const register = async (req: Request, res: Response) => {
  const { email, password, name, surname } = req.body;
  const user = await registerUser(email, password, name, surname);
  res.status(201).json({ message: "User registered successfully", user });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await loginUser(email, password);
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({
    status: "success",
    message: "Login successful",
    accessToken,
    user: user,
  });
};

export const getMe = async (req: AuthRequest, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the protected zone!",
    user: req.user,
  });
};

export const loginWithGoogle = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const user = await loginGoogle(token);
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      status: "success",
      message: "Login successful",
      accessToken,
      user: user,
    });
  } catch (error) {
    throw { statusCode: 401, message: "Invalid or expired Google Token" };
  }
};
