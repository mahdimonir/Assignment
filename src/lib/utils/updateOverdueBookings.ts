
import { pool } from "../../config/db";
import { getToday } from "./date";

const updateOverdueBookings = async () => {
  const today = getToday();

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const overdue = await client.query(
      `UPDATE bookings SET status = 'returned' 
       WHERE status = 'active' AND rent_end_date < $1 
       RETURNING vehicle_id`,
      [today]
    );

    for (const { vehicle_id } of overdue.rows) {
      const stillActive = await client.query(
        `SELECT 1 FROM bookings WHERE vehicle_id = $1 AND status = 'active' LIMIT 1`,
        [vehicle_id]
      );
      if (stillActive.rows.length === 0) {
        await client.query(
          `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
          [vehicle_id]
        );
      }
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export default updateOverdueBookings;
