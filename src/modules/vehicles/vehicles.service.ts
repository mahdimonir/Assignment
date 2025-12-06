import { pool } from "@/config/db";

const createVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  if (!vehicle_name || !registration_number || !daily_rent_price) {
    throw new Error("Missing required fields");
  }

  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) 
     VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status || "available",
    ]
  );

  return result.rows[0];
};

const getAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result.rows;
};

const getVehicleById = async (id: number) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
  if (result.rows.length === 0) {
    throw new Error("Vehicle not found");
  }
  return result.rows[0];
};

const updateVehicle = async (id: number, payload: Record<string, unknown>) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(payload)) {
    fields.push(`${key} = $${index}`);
    values.push(value);
    index++;
  }

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(id);
  const result = await pool.query(
    `UPDATE vehicles SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  return result.rows[0];
};

const deleteVehicle = async (id: number) => {
  const bookings = await pool.query(
    `SELECT * FROM bookings WHERE vehicle_id = $1 AND status = 'active'`,
    [id]
  );
  if (bookings.rows.length > 0) {
    throw new Error("Cannot delete vehicle with active bookings");
  }

  const result = await pool.query(
    `DELETE FROM vehicles WHERE id = $1 RETURNING *`,
    [id]
  );
  if (result.rows.length === 0) {
    throw new Error("Vehicle not found");
  }
};

export const vehicleServices = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
