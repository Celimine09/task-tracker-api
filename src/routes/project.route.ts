import {
  addProjectMember,
  createProject,
  deleteProjectDetail,
  deleteProjectMember,
  getProject,
  getProjectDetail,
  updateMemberRole,
  updateProjectDetail,
} from "@/controllers/project.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { catchAsync } from "@/utils/catchAsync";
import { Router } from "express";
import {
  addMemberSchema,
  createProjectSchema,
  updateMemberRoleSchema,
  updateProjectSchema,
} from "@/schemas/project.schema";
import { validateData } from "@/middlewares/validate.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  validateData(createProjectSchema),
  catchAsync(createProject),
);
router.get("/", authenticate, catchAsync(getProject));
router.get("/:id", authenticate, catchAsync(getProjectDetail));
router.patch(
  "/:id",
  authenticate,
  validateData(updateProjectSchema),
  catchAsync(updateProjectDetail),
);
router.delete("/:id", authenticate, catchAsync(deleteProjectDetail));
router.post(
  "/:id/member",
  authenticate,
  validateData(addMemberSchema),
  catchAsync(addProjectMember),
);
router.patch(
  "/:id/member",
  authenticate,
  validateData(updateMemberRoleSchema),
  catchAsync(updateMemberRole),
);
router.delete("/:id/member", authenticate, catchAsync(deleteProjectMember));

export default router;
