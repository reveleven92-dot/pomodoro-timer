/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "@/hooks/use-local-storage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns the initial value when nothing is stored", () => {
    const { result } = renderHook(() =>
      useLocalStorage("test-key", "initial"),
    );
    expect(result.current[0]).toBe("initial");
  });

  it("persists a value to localStorage when set", () => {
    const { result } = renderHook(() =>
      useLocalStorage("persist-key", "initial"),
    );

    act(() => {
      result.current[1]("updated");
    });

    expect(result.current[0]).toBe("updated");
    expect(JSON.parse(window.localStorage.getItem("persist-key")!)).toBe(
      "updated",
    );
  });

  it("reads a previously stored value on mount", () => {
    window.localStorage.setItem("existing-key", JSON.stringify("stored"));

    const { result } = renderHook(() =>
      useLocalStorage("existing-key", "fallback"),
    );

    // After hydration, it should have the stored value
    expect(result.current[0]).toBe("stored");
  });

  it("supports functional updates", () => {
    const { result } = renderHook(() =>
      useLocalStorage<number>("counter-key", 0),
    );

    act(() => {
      result.current[1]((prev) => prev + 5);
    });

    expect(result.current[0]).toBe(5);
  });

  it("handles invalid JSON in localStorage gracefully", () => {
    window.localStorage.setItem("bad-json", "not valid json");

    const { result } = renderHook(() =>
      useLocalStorage("bad-json", "default"),
    );

    // Should fall back to the initial value
    expect(result.current[0]).toBe("default");
  });

  it("handles objects correctly", () => {
    const initial = { a: 1, b: "two" };
    const { result } = renderHook(() =>
      useLocalStorage("obj-key", initial),
    );

    const updated = { a: 42, b: "updated" };
    act(() => {
      result.current[1](updated);
    });

    expect(result.current[0]).toEqual(updated);
    expect(JSON.parse(window.localStorage.getItem("obj-key")!)).toEqual(
      updated,
    );
  });
});
