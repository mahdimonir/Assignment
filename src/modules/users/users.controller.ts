import { Request, Response } from "express";
import { userServices } from "./users.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userServices.getAllUsers();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve users",
      errors: error.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.userId as string, 10);
    const user = await userServices.updateUser(id, req.body, req.user!);
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update user",
      errors: error.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.userId as string, 10);
    await userServices.deleteUser(id);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete user",
      errors: error.message,
    });
  }
};

export const userController = {
  getAllUsers,
  updateUser,
  deleteUser,
};
