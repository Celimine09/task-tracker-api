import { Router } from "express";
import {
  register,
  login,
  getMe,
  loginWithGoogle,
  refresh,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { catchAsync } from "../utils/catchAsync.js";
import { validateData } from "../middlewares/validate.middleware.js";
import {
  googleAuthSchema,
  loginSchema,
  registerSchema,
} from "../schemas/auth.schema.js";

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
