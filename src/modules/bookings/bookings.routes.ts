import { authMiddleware } from "@/middleware/auth";
import express from "express";
import { bookingController } from "./bookings.controller";

const router = express.Router();

router.post(
  "/",
  authMiddleware(["admin", "customer"]),
  bookingController.createBooking
);
router.get(
  "/",
  authMiddleware(["admin", "customer"]),
  bookingController.getBookings
);
router.put(
  "/:bookingId",
  authMiddleware(["admin", "customer"]),
  bookingController.updateBooking
);

export const bookingRoutes = router;
