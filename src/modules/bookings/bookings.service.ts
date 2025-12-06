import { pool } from "@/config/db";
import { isPastDate } from "@/lib/utils/date";
import updateOverdueBookings from "@/lib/utils/updateOverdueBookings";

const createBooking = async (
  payload: any,
  user: { id: number; role: string }
) => {
  let { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  if (user.role !== "admin") {
    customer_id = user.id;
  }

  if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
    throw new Error("All fields are required");
  }

  // Block past dates
  if (isPastDate(rent_start_date) || isPastDate(rent_end_date)) {
    throw new Error(
      "Rental dates cannot be in the past. Please select future dates."
    );
  }

  if (new Date(rent_end_date) <= new Date(rent_start_date)) {
    throw new Error("End date must be after start date");
  }

  const days =
    Math.ceil(
      (new Date(rent_end_date).getTime() -
        new Date(rent_start_date).getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const vehicleRes = await client.query(
      `SELECT * FROM vehicles WHERE id = $1 FOR UPDATE`,
      [vehicle_id]
    );
    if (vehicleRes.rows.length === 0) {
      throw new Error("Vehicle not found");
    }
    const vehicle = vehicleRes.rows[0];

    if (vehicle.availability_status !== "available") {
      throw new Error("Vehicle is currently booked and not available");
    }

    // Check for overlapping active bookings
    const overlap = await client.query(
      `SELECT 1 FROM bookings 
   WHERE vehicle_id = $1 
     AND status = 'active'
     AND rent_start_date <= $2 
     AND rent_end_date >= $3`,
      [vehicle_id, rent_end_date, rent_start_date]
    );
    if (overlap.rows.length > 0) {
      throw new Error("Vehicle is already booked for the selected dates");
    }

    const total_price = Number(vehicle.daily_rent_price) * days;

    const bookingRes = await client.query(
      `INSERT INTO bookings 
         (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status`,
      [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
    );

    await client.query(
      `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
      [vehicle_id]
    );

    await client.query("COMMIT");

    return {
      ...bookingRes.rows[0],
      vehicle: {
        vehicle_name: vehicle.vehicle_name,
        daily_rent_price: vehicle.daily_rent_price,
      },
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const getBookings = async (user: { id: number; role: string }) => {
  await updateOverdueBookings(); // Auto cleanup

  let query = "";
  const values: any[] = [];

  if (user.role === "admin") {
    query = `
      SELECT 
        b.*,
        u.name AS customer_name,
        u.email AS customer_email,
        v.vehicle_name,
        v.registration_number
      FROM bookings b
      LEFT JOIN users u ON b.customer_id = u.id
      LEFT JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.rent_start_date DESC
    `;
  } else {
    query = `
      SELECT 
        b.id, b.vehicle_id, b.rent_start_date, b.rent_end_date,
        b.total_price, b.status,
        v.vehicle_name, v.registration_number, v.type
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.customer_id = $1
      ORDER BY b.rent_start_date DESC
    `;
    values.push(user.id);
  }

  const result = await pool.query(query, values);

  if (user.role === "admin") {
    return result.rows.map((row) => ({
      ...row,
      customer: { name: row.customer_name, email: row.customer_email },
      vehicle: {
        vehicle_name: row.vehicle_name,
        registration_number: row.registration_number,
      },
      customer_name: undefined,
      customer_email: undefined,
    }));
  }

  return result.rows.map((row) => ({
    ...row,
    vehicle: {
      vehicle_name: row.vehicle_name,
      registration_number: row.registration_number,
      type: row.type,
    },
    vehicle_name: undefined,
    registration_number: undefined,
    type: undefined,
  }));
};

const updateBooking = async (
  bookingId: number,
  payload: { status?: string },
  user: { id: number; role: string }
) => {
  const status = payload?.status?.trim();

  if (!status) {
    throw new Error("Status is required. Must be 'cancelled' or 'returned'");
  }
  if (!["cancelled", "returned"].includes(status)) {
    throw new Error("Invalid status. Only 'cancelled' or 'returned' allowed");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const bookingRes = await client.query(
      `SELECT * FROM bookings WHERE id = $1 FOR UPDATE`,
      [bookingId]
    );
    if (bookingRes.rows.length === 0) throw new Error("Booking not found");
    const booking = bookingRes.rows[0];

    if (user.role !== "admin" && booking.customer_id !== user.id) {
      throw new Error("Not authorized");
    }

    if (status === "cancelled") {
      if (user.role !== "admin" && isPastDate(booking.rent_start_date)) {
        throw new Error("Cannot cancel booking that has already started");
      }
    } else if (status === "returned" && user.role !== "admin") {
      throw new Error("Only admin can mark as returned");
    }

    await client.query(`UPDATE bookings SET status = $1 WHERE id = $2`, [
      status,
      bookingId,
    ]);

    // If no active booking left → free the vehicle
    const active = await client.query(
      `SELECT 1 FROM bookings WHERE vehicle_id = $1 AND status = 'active' LIMIT 1`,
      [booking.vehicle_id]
    );
    if (active.rows.length === 0) {
      await client.query(
        `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
        [booking.vehicle_id]
      );
    }

    await client.query("COMMIT");

    const updated = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [
      bookingId,
    ]);
    return updated.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const bookingServices = {
  createBooking,
  getBookings,
  updateBooking,
};
