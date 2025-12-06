import express from "express";
import { authMiddleware } from "../../middleware/auth";
import { vehicleController } from "./vehicles.controller";

const router = express.Router();

router.post("/", authMiddleware(["admin"]), vehicleController.createVehicle);
router.get("/", vehicleController.getAllVehicles);
router.get("/:vehicleId", vehicleController.getVehicleById);
router.put(
  "/:vehicleId",
  authMiddleware(["admin"]),
  vehicleController.updateVehicle
);
router.delete(
  "/:vehicleId",
  authMiddleware(["admin"]),
  vehicleController.deleteVehicle
);

export const vehicleRoutes = router;
