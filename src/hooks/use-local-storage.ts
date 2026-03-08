"use client";

import { useState, useCallback } from "react";

/**
 * A React hook that syncs state with localStorage.
 *
 * Uses lazy initialization in useState to read the stored value
 * on the first render (client-side only). Subsequent calls to setValue
 * persist the new value to localStorage.
 *
 * Falls back to `initialValue` if:
 * - localStorage is not available (SSR)
 * - The stored JSON is malformed
 * - No value has been stored yet
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  // Lazy initializer reads from localStorage on the first render.
  // This avoids calling setState inside an effect.
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item) as T;
      }
    } catch {
      // localStorage unavailable or JSON parse error
    }
    return initialValue;
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue =
          value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(nextValue));
        } catch {
          // localStorage full or unavailable — state still updates in memory
        }
        return nextValue;
      });
    },
    [key],
  );

  return [storedValue, setValue];
}
