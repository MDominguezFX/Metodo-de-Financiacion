
export const parseISODate = (value: string): Date => {
  const [year, month, day] = value.split('-').map(Number);
  // Create date in UTC to avoid timezone issues with local time
  return new Date(Date.UTC(year, month - 1, day));
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
};

export const moveToBusinessDay = (date: Date): Date => {
  const dayOfWeek = date.getUTCDay(); // 0 = Sunday, 6 = Saturday
  if (dayOfWeek === 0) return addDays(date, 1); // If Sunday, move to Monday
  if (dayOfWeek === 6) return addDays(date, 2); // If Saturday, move to Monday
  return date;
};
