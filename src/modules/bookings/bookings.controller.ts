import { Request, Response } from "express";
import { bookingServices } from "./bookings.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const booking = await bookingServices.createBooking(req.body, req.user!);
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create booking",
      errors: error.message,
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await bookingServices.getBookings(req.user!);
    res.status(200).json({
      success: true,
      message:
        req.user!.role === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully",
      data: bookings,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve bookings",
      errors: error.message,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.bookingId as string);
    const updated = await bookingServices.updateBooking(
      id,
      req.body,
      req.user!
    );
    const message =
      req.body.status === "cancelled"
        ? "Booking cancelled successfully"
        : "Booking marked as returned. Vehicle is now available";
    res.status(200).json({
      success: true,
      message,
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update booking",
      errors: error.message,
    });
  }
};

export const bookingController = {
  createBooking,
  getBookings,
  updateBooking,
};
