import { useEffect, useState } from "react";

// useState that is mirrored to localStorage under `key`.
export function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can be unavailable (private mode, quota); keep in-memory state.
    }
  }, [key, value]);

  return [value, setValue];
}
