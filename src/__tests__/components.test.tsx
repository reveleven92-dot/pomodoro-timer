/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TimerDisplay } from "@/components/timer-display";
import { TimerControls } from "@/components/timer-controls";
import { SessionTabs } from "@/components/session-tabs";
import { SessionHistory } from "@/components/session-history";
import { StatsCard } from "@/components/stats-card";
import type { SessionRecord } from "@/lib/types";

// ─── TimerDisplay ─────────────────────────────────────────────────────────

describe("TimerDisplay", () => {
  it("renders the formatted time", () => {
    render(
      <TimerDisplay
        timeRemaining={1500}
        progress={0}
        sessionType="focus"
        status="idle"
      />,
    );
    expect(screen.getByText("25:00")).toBeInTheDocument();
  });

  it("shows the session type label", () => {
    render(
      <TimerDisplay
        timeRemaining={300}
        progress={0}
        sessionType="shortBreak"
        status="idle"
      />,
    );
    expect(screen.getByText("Short Break")).toBeInTheDocument();
  });

  it("has an accessible live region", () => {
    render(
      <TimerDisplay
        timeRemaining={1500}
        progress={0}
        sessionType="focus"
        status="running"
      />,
    );
    const liveRegion = document.querySelector("[aria-live='polite']");
    expect(liveRegion).toBeInTheDocument();
  });

  it("renders SVG with aria-label", () => {
    render(
      <TimerDisplay
        timeRemaining={1500}
        progress={0.5}
        sessionType="focus"
        status="idle"
      />,
    );
    const svg = screen.getByRole("img");
    expect(svg).toHaveAttribute(
      "aria-label",
      "Focus timer: 25:00 remaining",
    );
  });
});

// ─── TimerControls ────────────────────────────────────────────────────────

describe("TimerControls", () => {
  it("shows Start button when idle", () => {
    const onStart = jest.fn();
    render(
      <TimerControls
        status="idle"
        onStart={onStart}
        onPause={jest.fn()}
        onReset={jest.fn()}
      />,
    );
    const startBtn = screen.getByLabelText("Start timer");
    expect(startBtn).toBeInTheDocument();
    fireEvent.click(startBtn);
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it("shows Pause button when running", () => {
    const onPause = jest.fn();
    render(
      <TimerControls
        status="running"
        onStart={jest.fn()}
        onPause={onPause}
        onReset={jest.fn()}
      />,
    );
    const pauseBtn = screen.getByLabelText("Pause timer");
    expect(pauseBtn).toBeInTheDocument();
    fireEvent.click(pauseBtn);
    expect(onPause).toHaveBeenCalledTimes(1);
  });

  it("disables Reset when idle", () => {
    render(
      <TimerControls
        status="idle"
        onStart={jest.fn()}
        onPause={jest.fn()}
        onReset={jest.fn()}
      />,
    );
    const resetBtn = screen.getByLabelText("Reset timer");
    expect(resetBtn).toBeDisabled();
  });

  it("enables Reset when running", () => {
    render(
      <TimerControls
        status="running"
        onStart={jest.fn()}
        onPause={jest.fn()}
        onReset={jest.fn()}
      />,
    );
    const resetBtn = screen.getByLabelText("Reset timer");
    expect(resetBtn).not.toBeDisabled();
  });
});

// ─── SessionTabs ──────────────────────────────────────────────────────────

describe("SessionTabs", () => {
  it("renders all three session type tabs", () => {
    render(<SessionTabs activeType="focus" onSwitch={jest.fn()} />);
    expect(screen.getByText("Focus")).toBeInTheDocument();
    expect(screen.getByText("Short Break")).toBeInTheDocument();
    expect(screen.getByText("Long Break")).toBeInTheDocument();
  });

  it("marks the active tab with aria-selected", () => {
    render(<SessionTabs activeType="shortBreak" onSwitch={jest.fn()} />);
    const shortBreakTab = screen.getByText("Short Break");
    expect(shortBreakTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Focus")).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("calls onSwitch when a tab is clicked", () => {
    const onSwitch = jest.fn();
    render(<SessionTabs activeType="focus" onSwitch={onSwitch} />);
    fireEvent.click(screen.getByText("Long Break"));
    expect(onSwitch).toHaveBeenCalledWith("longBreak");
  });
});

// ─── SessionHistory ───────────────────────────────────────────────────────

describe("SessionHistory", () => {
  it("shows empty message when no sessions", () => {
    render(<SessionHistory sessions={[]} />);
    expect(
      screen.getByText(/No sessions completed yet/),
    ).toBeInTheDocument();
  });

  it("renders session entries", () => {
    const sessions: SessionRecord[] = [
      {
        type: "focus",
        duration: 25,
        completedAt: new Date().toISOString(),
      },
    ];
    render(<SessionHistory sessions={sessions} />);
    expect(screen.getByText("Focus")).toBeInTheDocument();
    expect(screen.getByText("25 min")).toBeInTheDocument();
  });

  it("only shows the last 10 sessions", () => {
    const sessions: SessionRecord[] = Array.from({ length: 15 }, (_, i) => ({
      type: "focus" as const,
      duration: 25,
      completedAt: new Date(Date.now() - i * 60000).toISOString(),
    }));
    render(<SessionHistory sessions={sessions} />);
    const items = screen.getAllByText("Focus");
    expect(items.length).toBe(10);
  });
});

// ─── StatsCard ────────────────────────────────────────────────────────────

describe("StatsCard", () => {
  it("shows zero stats when no sessions exist", () => {
    render(<StatsCard sessions={[]} />);
    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBe(3);
  });

  it("counts today's focus sessions correctly", () => {
    const sessions: SessionRecord[] = [
      { type: "focus", duration: 25, completedAt: new Date().toISOString() },
      { type: "focus", duration: 25, completedAt: new Date().toISOString() },
      {
        type: "shortBreak",
        duration: 5,
        completedAt: new Date().toISOString(),
      },
    ];
    render(<StatsCard sessions={sessions} />);
    // 2 focus sessions and streak=2, so "2" appears twice — use getAllByText
    const twos = screen.getAllByText("2");
    expect(twos.length).toBe(2); // sessions=2, streak=2
    // 50 focus minutes total
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("does not count yesterday's sessions in today's stats", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const sessions: SessionRecord[] = [
      {
        type: "focus",
        duration: 25,
        completedAt: yesterday.toISOString(),
      },
    ];
    render(<StatsCard sessions={sessions} />);
    // Streak should be 1 (regardless of day), but today's sessions should be 0
    // The "0" values should appear for "Sessions" and "Minutes"
    const zeroElements = screen.getAllByText("0");
    expect(zeroElements.length).toBe(2); // sessions=0, minutes=0
  });
});
