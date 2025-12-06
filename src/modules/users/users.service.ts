import { pool } from "@/config/db";

const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users`
  );
  return result.rows;
};

const updateUser = async (
  id: number,
  payload: Record<string, unknown>,
  currentUser: { id: number; role: string }
) => {
  if (currentUser.role !== "admin" && currentUser.id !== id) {
    throw new Error("You can only update your own profile");
  }

  // Customers can't update role
  if (currentUser.role !== "admin" && payload.role) {
    delete payload.role;
  }

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
    `UPDATE users SET ${fields.join(
      ", "
    )} WHERE id = $${index} RETURNING id, name, email, phone, role`,
    values
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  return result.rows[0];
};

const deleteUser = async (id: number) => {
  const bookings = await pool.query(
    `SELECT * FROM bookings WHERE customer_id = $1 AND status = 'active'`,
    [id]
  );
  if (bookings.rows.length > 0) {
    throw new Error("Cannot delete user with active bookings");
  }

  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING *`,
    [id]
  );
  if (result.rows.length === 0) {
    throw new Error("User not found");
  }
};

export const userServices = {
  getAllUsers,
  updateUser,
  deleteUser,
};
