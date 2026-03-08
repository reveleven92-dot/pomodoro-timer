/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react";
import { useTimer } from "@/hooks/use-timer";
import type { TimerSettings } from "@/lib/types";

const DEFAULT_SETTINGS: TimerSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
};

function setup(overrides?: Partial<TimerSettings>) {
  const settings = { ...DEFAULT_SETTINGS, ...overrides };
  const onComplete = jest.fn();
  return renderHook(() =>
    useTimer({ settings, onSessionComplete: onComplete }),
  );
}

describe("useTimer", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("initializes with idle status and full duration", () => {
    const { result } = setup();

    expect(result.current.status).toBe("idle");
    expect(result.current.sessionType).toBe("focus");
    expect(result.current.timeRemaining).toBe(25 * 60);
    expect(result.current.progress).toBe(0);
  });

  it("starts counting down when started", () => {
    const { result } = setup();

    act(() => {
      result.current.start();
    });

    expect(result.current.status).toBe("running");

    // Advance 3 seconds
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.timeRemaining).toBe(25 * 60 - 3);
  });

  it("pauses the timer", () => {
    const { result } = setup();

    act(() => {
      result.current.start();
    });
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    const timeAtPause = result.current.timeRemaining;

    act(() => {
      result.current.pause();
    });

    expect(result.current.status).toBe("paused");

    // Advance more time — should NOT change
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.timeRemaining).toBe(timeAtPause);
  });

  it("resets timer to full duration", () => {
    const { result } = setup();

    act(() => {
      result.current.start();
    });
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    act(() => {
      result.current.reset();
    });

    expect(result.current.status).toBe("idle");
    expect(result.current.timeRemaining).toBe(25 * 60);
  });

  it("switches session type and resets timer", () => {
    const { result } = setup();

    act(() => {
      result.current.switchSession("shortBreak");
    });

    expect(result.current.sessionType).toBe("shortBreak");
    expect(result.current.timeRemaining).toBe(5 * 60);
    expect(result.current.status).toBe("idle");
  });

  it("transitions to short break after focus session completes", () => {
    const onComplete = jest.fn();
    const settings = { ...DEFAULT_SETTINGS, focusDuration: 1 }; // 1 minute
    const { result } = renderHook(() =>
      useTimer({ settings, onSessionComplete: onComplete }),
    );

    act(() => {
      result.current.start();
    });

    // Advance past the full 1-minute duration
    act(() => {
      jest.advanceTimersByTime(61000);
    });

    expect(onComplete).toHaveBeenCalledWith("focus", "shortBreak");
    expect(result.current.sessionType).toBe("shortBreak");
    expect(result.current.status).toBe("running");
  });

  it("transitions to long break after 4th focus session", () => {
    const onComplete = jest.fn();
    const settings = { ...DEFAULT_SETTINGS, focusDuration: 1, shortBreakDuration: 1 };
    const { result } = renderHook(() =>
      useTimer({ settings, onSessionComplete: onComplete }),
    );

    // Complete 4 focus sessions with short breaks in between
    for (let i = 0; i < 3; i++) {
      // Focus session
      act(() => result.current.start());
      act(() => jest.advanceTimersByTime(61000));
      // Short break auto-starts
      act(() => jest.advanceTimersByTime(61000));
      // Focus auto-starts
    }

    // 4th focus session
    act(() => {
      // The timer should already be running from auto-transition
      // If idle, start it
      if (result.current.status === "idle") {
        result.current.start();
      }
    });
    act(() => jest.advanceTimersByTime(61000));

    // After the 4th focus session, should transition to long break
    expect(onComplete).toHaveBeenLastCalledWith("focus", "longBreak");
  });

  it("handles negative edge case — timer never goes below 0", () => {
    const { result } = setup({ focusDuration: 1 });

    act(() => result.current.start());
    // Way past the duration
    act(() => jest.advanceTimersByTime(120000));

    expect(result.current.timeRemaining).toBeGreaterThanOrEqual(0);
  });
});
