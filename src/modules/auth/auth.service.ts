import config from "@/config";
import { pool } from "@/config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const signupUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  if (!name || !email || !password || !phone || !role) {
    throw new Error("Missing required fields");
  }
  if ((password as string)?.length < 6) {
    throw new Error("Password can not be less then 6");
  }

  const hashedPassword = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role`,
    [name, email, hashedPassword, phone, role]
  );

  return result.rows[0];
};

const signinUser = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);
  if (result.rows.length === 0) {
    throw new Error("User not found");
  }
  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Invalid password");
  }

  const secret = config.jwtSecret as string;
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    secret,
    { expiresIn: "7d" }
  );

  // Strip password from user
  const { password: _, ...userWithoutPassword } = user;
  return { token, user: userWithoutPassword };
};

export const authServices = {
  signupUser,
  signinUser,
};
