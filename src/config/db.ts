import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
  connectionString: `${config.connection_str}`,
});

const initDB = async () => {
  // User Table
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone VARCHAR(15) NOT NULL,
        role VARCHAR(50) NOT NULL
        )
        `);

  // Vehicle Table
  await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(200) NOT NULL,
        type VARCHAR(60),
        registration_number VARCHAR(60) UNIQUE NOT NULL,
        daily_rent_price NUMERIC(10,2) NOT NULL,
        availability_status VARCHAR(60) DEFAULT 'available'
        )
        `);

  // Booking Table
  await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        customer_id INT REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date TIMESTAMPTZ NOT NULL,
        rent_end_date TIMESTAMPTZ NOT NULL,
        total_price NUMERIC(10,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'active'
        )
        `);
};

export default initDB;
