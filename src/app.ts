import express, { Application, NextFunction, Request, Response } from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import initDB from "./config/db";
import { authRoutes } from "./modules/auth/auth.routes";
import { bookingRoutes } from "./modules/bookings/bookings.routes";
import { userRoutes } from "./modules/users/users.routes";
import { vehicleRoutes } from "./modules/vehicles/vehicles.routes";
import swaggerDocument from "./swagger.json";

const app: Application = express();

// Serve Swagger UI static files
app.use(
  "/swagger-ui",
  express.static(path.join(__dirname, "../node_modules/swagger-ui-dist"))
);

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Initialize DB tables (non-blocking for serverless)
initDB()
  .then(() => {
    console.log("PostgreSQL connected & tables initialized");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    // Don't call process.exit() in serverless - it crashes the function
  });

// Health Check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Root Welcome
app.get("/", (req: Request, res: Response) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  res.json({
    success: true,
    message: "Vehicle Rental System API",
    version: "1.0.0",
    documentation: `${baseUrl}/api-docs`,
    health: `${baseUrl}/health`,
    endpoints: {
      auth: "/api/v1/auth",
      vehicles: "/api/v1/vehicles",
      users: "/api/v1/users",
      bookings: "/api/v1/bookings",
    },
  });
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/bookings", bookingRoutes);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Not found
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    requested: req.originalUrl,
    tip: `Visit /api-docs for API documentation`,
  });
});

// Global Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.message,
  });
});

export default app;