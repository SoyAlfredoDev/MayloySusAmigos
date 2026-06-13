import { siteConfig } from "@/config/site";

const TIMEZONE = siteConfig.timezone;

type ZonedParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  dayOfWeek: number;
};

function getPart(
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
): number {
  const value = parts.find((part) => part.type === type)?.value ?? "0";
  return Number(value);
}

export function getZonedParts(date: Date, timeZone = TIMEZONE): ZonedParts {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  });

  const parts = formatter.formatToParts(date);
  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "Sun";
  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return {
    year: getPart(parts, "year"),
    month: getPart(parts, "month"),
    day: getPart(parts, "day"),
    hour: getPart(parts, "hour") % 24,
    minute: getPart(parts, "minute"),
    dayOfWeek: dayMap[weekday] ?? 0,
  };
}

export function formatDateYmd(date: Date, timeZone = TIMEZONE): string {
  const { year, month, day } = getZonedParts(date, timeZone);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function formatTimeHm(date: Date, timeZone = TIMEZONE): string {
  const { hour, minute } = getZonedParts(date, timeZone);
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function formatSlotLabel(date: Date, timeZone = TIMEZONE): string {
  return new Intl.DateTimeFormat(siteConfig.locale, {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function formatAppointmentDate(date: Date, timeZone = TIMEZONE): string {
  return new Intl.DateTimeFormat(siteConfig.locale, {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function zonedDateTimeToUtc(
  dateYmd: string,
  timeHm: string,
  timeZone = TIMEZONE,
): Date {
  const [year, month, day] = dateYmd.split("-").map(Number);
  const [hour, minute] = timeHm.split(":").map(Number);

  let candidate = new Date(Date.UTC(year, month - 1, day, hour, minute));

  for (let i = 0; i < 4; i += 1) {
    const parts = getZonedParts(candidate, timeZone);
    const target = Date.UTC(year, month - 1, day, hour, minute);
    const actual = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
    );
    candidate = new Date(candidate.getTime() + (target - actual));
  }

  return candidate;
}

export function addDaysYmd(dateYmd: string, days: number): string {
  const utc = zonedDateTimeToUtc(dateYmd, "12:00");
  utc.setUTCDate(utc.getUTCDate() + days);
  return formatDateYmd(utc);
}

export function todayYmd(): string {
  return formatDateYmd(new Date());
}
