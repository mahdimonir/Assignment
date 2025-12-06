import { Request, Response } from "express";
import { vehicleServices } from "./vehicles.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehicleServices.createVehicle(req.body);
    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create vehicle",
      errors: error.message,
    });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await vehicleServices.getAllVehicles();
    res.status(200).json({
      success: true,
      message:
        vehicles.length > 0
          ? "Vehicles retrieved successfully"
          : "No vehicles found",
      data: vehicles,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve vehicles",
      errors: error.message,
    });
  }
};

const getVehicleById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.vehicleId as string, 10);
    const vehicle = await vehicleServices.getVehicleById(id);
    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: vehicle,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Vehicle not found",
      errors: error.message,
    });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.vehicleId as string, 10);
    const vehicle = await vehicleServices.updateVehicle(id, req.body);
    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: vehicle,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update vehicle",
      errors: error.message,
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.vehicleId as string, 10);
    await vehicleServices.deleteVehicle(id);
    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete vehicle",
      errors: error.message,
    });
  }
};

export const vehicleController = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
