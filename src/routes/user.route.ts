import { Router } from "express";
import { getAllUsers } from "@/controllers/user.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { catchAsync } from "@/utils/catchAsync";

const router = Router();

router.get("/", authenticate, catchAsync(getAllUsers));

export default router;
