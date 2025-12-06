import app from "./app";
import config from "./config";

const PORT = config.port || 8000;

const server = app.listen(PORT, () => {
  console.log("_".repeat(60));
  console.log(`Vehicle Rental System API`);
  console.log(`Server running on: http://localhost:${PORT}`);
  console.log(`Swagger Docs:    http://localhost:${PORT}/api-docs`);
  console.log(`Health Check:    http://localhost:${PORT}/health`);
  console.log("_".repeat(60));
});

// Graceful Shutdown
const shutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  server.close(() => {
    console.log("All requests finished. Server closed.");
    process.exit(0);
  });
  setTimeout(() => {
    console.error("Force closing stuck connections...");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Export for Vercel
export default app;
