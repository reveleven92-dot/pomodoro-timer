import { formatTime, getRelativeTime, isToday, cn } from "@/lib/utils";

describe("formatTime", () => {
  it("formats zero seconds as 00:00", () => {
    expect(formatTime(0)).toBe("00:00");
  });

  it("formats 25 minutes correctly", () => {
    expect(formatTime(25 * 60)).toBe("25:00");
  });

  it("formats seconds with leading zeros", () => {
    expect(formatTime(65)).toBe("01:05");
  });

  it("formats large values correctly", () => {
    expect(formatTime(90 * 60)).toBe("90:00");
  });

  it("handles single-digit minutes and seconds", () => {
    expect(formatTime(5 * 60 + 3)).toBe("05:03");
  });
});

describe("getRelativeTime", () => {
  it("returns 'just now' for times less than a minute ago", () => {
    const now = new Date().toISOString();
    expect(getRelativeTime(now)).toBe("just now");
  });

  it("returns minutes ago for recent times", () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(getRelativeTime(fiveMinAgo)).toBe("5 min ago");
  });

  it("returns hours ago for times over an hour", () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    expect(getRelativeTime(twoHoursAgo)).toBe("2 hr ago");
  });

  it("returns days ago for times over a day", () => {
    const threeDaysAgo = new Date(
      Date.now() - 3 * 24 * 60 * 60 * 1000,
    ).toISOString();
    expect(getRelativeTime(threeDaysAgo)).toBe("3 days ago");
  });

  it("returns singular day for exactly one day", () => {
    const oneDayAgo = new Date(
      Date.now() - 1 * 24 * 60 * 60 * 1000,
    ).toISOString();
    expect(getRelativeTime(oneDayAgo)).toBe("1 day ago");
  });
});

describe("isToday", () => {
  it("returns true for a date created right now", () => {
    expect(isToday(new Date().toISOString())).toBe(true);
  });

  it("returns false for yesterday", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(isToday(yesterday.toISOString())).toBe(false);
  });

  it("returns false for an invalid date string", () => {
    // new Date("garbage") creates an Invalid Date
    expect(isToday("garbage")).toBe(false);
  });
});

describe("cn", () => {
  it("joins multiple class names", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("filters out falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("returns empty string when all values are falsy", () => {
    expect(cn(false, null, undefined)).toBe("");
  });
});
