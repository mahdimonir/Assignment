import { Request, Response } from "express";
import { authServices } from "./auth.service";

const signupUser = async (req: Request, res: Response) => {
  try {
    const user = await authServices.signupUser(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "User registration failed",
      errors: error.message,
    });
  }
};

const signinUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await authServices.signinUser(email, password);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Login failed",
      errors: error.message,
    });
  }
};

export const authController = {
  signupUser,
  signinUser,
};
