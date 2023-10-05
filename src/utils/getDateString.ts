export function getDateString(date: Date | number | string = new Date()) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toISOString().slice(0, 10);
}
