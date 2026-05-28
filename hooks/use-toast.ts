"use client";

import { useState, useCallback, useRef } from "react";

export interface ToastState {
  message: string;
  type: "success" | "info";
}

/**
 * Manages toast notification state with auto-dismiss.
 */
export function useToast(dismissMs = 3000) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (message: string, type: "success" | "info" = "success") => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setToast({ message, type });
      timerRef.current = setTimeout(() => setToast(null), dismissMs);
    },
    [dismissMs],
  );

  const dismissToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setToast(null);
  }, []);

  return { toast, showToast, dismissToast };
}
