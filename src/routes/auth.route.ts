import { Router } from "express";
import {
  register,
  login,
  getMe,
  loginWithGoogle,
  refresh,
} from "@/controllers/auth.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { catchAsync } from "@/utils/catchAsync";
import { validateData } from "@/middlewares/validate.middleware";
import {
  googleAuthSchema,
  loginSchema,
  registerSchema,
} from "@/schemas/auth.schema";

const router = Router();

router.post("/register", validateData(registerSchema), catchAsync(register));
router.post("/login", validateData(loginSchema), catchAsync(login));
router.get("/me", authenticate, catchAsync(getMe));
router.post(
  "/google",
  validateData(googleAuthSchema),
  catchAsync(loginWithGoogle),
);
router.post("/refresh", refresh);

export default router;
