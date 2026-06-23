import { describe, it, expect } from "vitest";
import {
  parseTime,
  formatDate,
  formatTime,
  isOpenDay,
  isDateBlocked,
} from "./date-utils";

describe("parseTime", () => {
  it("sets hours and minutes on a date", () => {
    const base = new Date("2026-07-01T00:00:00.000Z");
    const result = parseTime("09:30", base);
    expect(result.getHours()).toBe(9);
    expect(result.getMinutes()).toBe(30);
  });
});

describe("formatDate", () => {
  it("returns yyyy-MM-dd format", () => {
    const d = new Date("2026-07-01T12:00:00.000Z");
    expect(formatDate(d)).toBe("2026-07-01");
  });
});

describe("formatTime", () => {
  it("returns h:mm a format", () => {
    const d = new Date("2026-07-01T14:30:00.000Z");
    const result = formatTime(d);
    expect(result).toContain("30");
    expect(result).toMatch(/(AM|PM)/);
  });
});

describe("isOpenDay", () => {
  it("returns true for Monday (1) when openDays includes 1", () => {
    const monday = new Date("2026-06-29T00:00:00.000Z"); // Monday
    expect(isOpenDay(monday, [1, 2, 3, 4, 5, 6])).toBe(true);
  });

  it("returns false for Sunday (0) when openDays excludes 0", () => {
    const sunday = new Date("2026-06-28T00:00:00.000Z"); // Sunday
    expect(isOpenDay(sunday, [1, 2, 3, 4, 5, 6])).toBe(false);
  });
});

describe("isDateBlocked", () => {
  it("returns true for a blocked date", () => {
    const d = new Date("2026-12-25T00:00:00.000Z");
    expect(isDateBlocked(d, ["2026-12-25"])).toBe(true);
  });

  it("returns false for an unblocked date", () => {
    const d = new Date("2026-07-01T00:00:00.000Z");
    expect(isDateBlocked(d, ["2026-12-25"])).toBe(false);
  });
});
