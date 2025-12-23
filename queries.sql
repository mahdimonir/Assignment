-- Query 1: JOIN
SELECT 
  b.booking_id,
  u.name AS customer_name,
  v.name AS vehicle_name,
  b.start_date,
  b.end_date,
  b.status
FROM bookings b
INNER JOIN users u ON b.user_id = u.user_id
INNER JOIN vehicles v ON b.vehicle_id = v.vehicle_id;

-- Query 2: EXISTS
SELECT *
FROM vehicles v
WHERE NOT EXISTS (
  SELECT 1 
  FROM bookings b 
  WHERE b.vehicle_id = v.vehicle_id
);

-- Query 3: WHERE
SELECT *
FROM vehicles
WHERE type = 'car' AND status = 'available';

-- Query 4: GROUP BY and HAVING
SELECT 
  v.name AS vehicle_name,
  COUNT(b.booking_id) AS total_bookings
FROM vehicles v
LEFT JOIN bookings b ON v.vehicle_id = b.vehicle_id
GROUP BY v.vehicle_id, v.name
HAVING COUNT(b.booking_id) > 2;
