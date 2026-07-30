import type { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Internal Server Error:", err);

  res.status(err.status || err.statusCode || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
    details: err,
  });
};
