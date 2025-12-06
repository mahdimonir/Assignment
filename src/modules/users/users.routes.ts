import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import { userController } from "./users.controller";

const router = Router();

router.get("/", authMiddleware(["admin"]), userController.getAllUsers);
router.put(
  "/:userId",
  authMiddleware(["admin", "customer"]),
  userController.updateUser
);
router.delete("/:userId", authMiddleware(["admin"]), userController.deleteUser);

export const userRoutes = router;
