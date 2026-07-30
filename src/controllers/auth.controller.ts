import type { AuthRequest } from "@/middlewares/auth.middleware";
import {
  loginGoogle,
  loginUser,
  registerUser,
  verifyAndRefreshUser,
} from "@/services/auth.service";
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
    secure: false,
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
    const { code } = req.body;
    const user = await loginGoogle(code);
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
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

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized, no token found" });
    }

    const user = await verifyAndRefreshUser(refreshToken);
    const newAccessToken = generateAccessToken(user.id);

    res.status(200).json({
      status: "success",
      accessToken: newAccessToken,
      user: user,
    });
  } catch (error) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.status(403).json({ message: "Invalid or expired Refresh Token" });
  }
};
