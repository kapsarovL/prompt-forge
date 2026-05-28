"use client";

import { useEffect } from "react";
import { initStorage } from "@/lib/storage";

/**
 * Initializes the versioned localStorage schema on mount.
 * Must be rendered inside a client component tree.
 */
export function StorageInit() {
  useEffect(() => {
    initStorage();
  }, []);

  return null;
}
