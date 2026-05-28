import { describe, it, expect, beforeEach } from "vitest";
import {
  initStorage,
  getStorageItem,
  setStorageItem,
  getStorageString,
  setStorageString,
  removeStorageItem,
  STORAGE_KEYS,
} from "@/lib/storage";

beforeEach(() => {
  localStorage.clear();
});

describe("initStorage", () => {
  it("sets schema version on first call", async () => {
    expect(localStorage.getItem(STORAGE_KEYS.SCHEMA_VERSION)).toBeNull();
    await initStorage();
    expect(localStorage.getItem(STORAGE_KEYS.SCHEMA_VERSION)).toBe("1");
  });

  it("does not overwrite existing schema version", async () => {
    localStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, "1");
    await initStorage();
    expect(localStorage.getItem(STORAGE_KEYS.SCHEMA_VERSION)).toBe("1");
  });

  it("handles corrupt version gracefully", async () => {
    localStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, "not-a-number");
    await initStorage();
    expect(localStorage.getItem(STORAGE_KEYS.SCHEMA_VERSION)).toBe("1");
  });
});

describe("getStorageItem", () => {
  it("returns fallback for missing key", () => {
    expect(getStorageItem(STORAGE_KEYS.HISTORY, [])).toEqual([]);
  });

  it("returns parsed JSON for existing key", () => {
    const data = [{ id: "1", text: "test" }];
    setStorageItem(STORAGE_KEYS.HISTORY, data);
    expect(getStorageItem(STORAGE_KEYS.HISTORY, [])).toEqual(data);
  });

  it("returns fallback for corrupt data", () => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, "not-json");
    expect(getStorageItem(STORAGE_KEYS.HISTORY, [])).toEqual([]);
  });
});

describe("setStorageItem", () => {
  it("writes JSON-serialized data", () => {
    setStorageItem(STORAGE_KEYS.GEMINI_KEY, "test-key");
    expect(localStorage.getItem(STORAGE_KEYS.GEMINI_KEY)).toBe('"test-key"');
  });

  it("writes objects correctly", () => {
    const obj = { a: 1, b: [2, 3] };
    setStorageItem(STORAGE_KEYS.CUSTOM_TEMPLATES, obj);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_TEMPLATES)!) ).toEqual(obj);
  });
});

describe("getStorageString", () => {
  it("returns fallback for missing key", () => {
    expect(getStorageString(STORAGE_KEYS.GEMINI_KEY, "default")).toBe("default");
  });

  it("returns raw string for existing key", () => {
    localStorage.setItem(STORAGE_KEYS.PROVIDER, "gemini");
    expect(getStorageString(STORAGE_KEYS.PROVIDER, "gemini")).toBe("gemini");
  });
});

describe("removeStorageItem", () => {
  it("removes the key", () => {
    localStorage.setItem(STORAGE_KEYS.GEMINI_KEY, "test");
    removeStorageItem(STORAGE_KEYS.GEMINI_KEY);
    expect(localStorage.getItem(STORAGE_KEYS.GEMINI_KEY)).toBeNull();
  });
});
