// Bangladesh = UTC+6
const BD_TIMEZONE_OFFSET_MS = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

// Check if a date is in the past
export const isPastDate = (dateStr: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const bdToday = new Date(today.getTime() + BD_TIMEZONE_OFFSET_MS);
  const inputDate = new Date(dateStr);
  return inputDate < bdToday;
};

// Optional: Get today's date
export const getToday = (): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const bdToday = new Date(today.getTime() + BD_TIMEZONE_OFFSET_MS);
  return bdToday.toISOString().split("T")[0]!;
};
