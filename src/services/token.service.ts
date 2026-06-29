import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: string) => {
  return jwt.sign(
    { userId },
    process.env.ACCESS_TOKEN_SECRET || "default_secret",
    { expiresIn: "15m" },
  );
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET || "default_secret",
    { expiresIn: "7d" },
  );
};
