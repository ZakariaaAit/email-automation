import { formatInTimeZone } from "date-fns-tz";

export function formatDate(utcDate: string, timeZone: string = "UTC") {
  return formatInTimeZone(utcDate, timeZone, "yyyy-MM-dd HH:mm:ss");
}
