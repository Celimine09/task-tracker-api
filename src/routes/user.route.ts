import { Router } from "express";
import { getAllUsers } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { catchAsync } from "../utils/catchAsync.js";

const router = Router();

router.get("/", authenticate, catchAsync(getAllUsers));

export default router;
