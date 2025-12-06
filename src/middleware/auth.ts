import config from "@/config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (roles: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.replace("Bearer ", "");
    try {
      const decoded = jwt.verify(
        token,
        config.jwtSecret as string
      ) as Express.UserPayload;
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "Insufficient permissions",
        });
      }

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
  };
};
