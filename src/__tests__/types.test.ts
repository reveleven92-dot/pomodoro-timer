import {
  DEFAULT_SETTINGS,
  SESSION_LABELS,
  SESSION_COLORS,
  LONG_BREAK_INTERVAL,
  MIN_DURATION,
  MAX_DURATION,
} from "@/lib/types";

describe("type constants", () => {
  it("has correct default durations", () => {
    expect(DEFAULT_SETTINGS.focusDuration).toBe(25);
    expect(DEFAULT_SETTINGS.shortBreakDuration).toBe(5);
    expect(DEFAULT_SETTINGS.longBreakDuration).toBe(15);
  });

  it("has labels for all session types", () => {
    expect(SESSION_LABELS.focus).toBe("Focus");
    expect(SESSION_LABELS.shortBreak).toBe("Short Break");
    expect(SESSION_LABELS.longBreak).toBe("Long Break");
  });

  it("has colors for all session types", () => {
    expect(SESSION_COLORS.focus).toContain("stroke");
    expect(SESSION_COLORS.shortBreak).toContain("stroke");
    expect(SESSION_COLORS.longBreak).toContain("stroke");
  });

  it("has valid duration constraints", () => {
    expect(MIN_DURATION).toBe(1);
    expect(MAX_DURATION).toBe(90);
    expect(MIN_DURATION).toBeLessThan(MAX_DURATION);
  });

  it("sets long break interval to 4", () => {
    expect(LONG_BREAK_INTERVAL).toBe(4);
  });
});
