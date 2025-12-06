import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 8000,
  connection_str: process.env.CONNECTION_STR,
  jwtSecret: process.env.JWT_SECRET,
};

export default config;
