/**
 * Versioned localStorage wrapper with schema migration support.
 *
 * Schema versioning enables safe data migration when the shape of stored
 * data changes between releases. On first load of a versioned schema, the
 * `STORAGE_VERSION` constant is written to localStorage. Future releases
 * increment this version and supply a `runMigrations` function to transform
 * old data shapes forward.
 */

const STORAGE_VERSION_KEY = "promptforge_schema_version";

/** Current storage schema version. Increment when making breaking changes. */
const STORAGE_VERSION = 1;

/** All localStorage keys managed by this module. */
export const STORAGE_KEYS = {
  SCHEMA_VERSION: STORAGE_VERSION_KEY,
  GEMINI_KEY: "promptforge_api_key",
  ANTHROPIC_KEY: "pf_anthropic_key",
  ANTHROPIC_MODEL: "pf_anthropic_model",
  CODEX_KEY: "pf_codex_key",
  CODEX_MODEL: "pf_codex_model",
  OPENCODE_KEY: "promptforge_opencode_api_key",
  OPENCODE_MODEL: "promptforge_opencode_model",
  OPENCODE_BASE_URL: "promptforge_opencode_base_url",
  PROVIDER: "promptforge_provider",
  HISTORY: "promptforge_history",
  CUSTOM_TEMPLATES: "promptforge_custom_templates",
  VERSIONS: "promptforge_versions",
  FEEDBACK: "promptforge_feedback",
  ENCRYPTED_KEY_BUNDLE: "pf_encrypted_keys",
  ENCRYPTION_ACTIVE: "pf_encryption_active",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/**
 * Initializes the storage layer: reads the current schema version and
 * runs any pending migrations. Call once at application startup.
 */
export async function initStorage(): Promise<void> {
  if (typeof window === "undefined") return;

  const currentVersion = getCurrentVersion();
  if (currentVersion >= STORAGE_VERSION) return;

  // Run migrations sequentially from current → target
  for (let version = currentVersion + 1; version <= STORAGE_VERSION; version++) {
    await runMigration(version);
  }

  setVersion(STORAGE_VERSION);
}

function getCurrentVersion(): number {
  try {
    const raw = localStorage.getItem(STORAGE_VERSION_KEY);
    if (raw === null) return 0;
    const v = Number(raw);
    return Number.isFinite(v) && v >= 0 ? v : 0;
  } catch {
    return 0;
  }
}

function setVersion(version: number): void {
  try {
    localStorage.setItem(STORAGE_VERSION_KEY, String(version));
  } catch {
    // Silently fail — localStorage may be full or unavailable
  }
}

/**
 * Migration registry. Add new entries here when STORAGE_VERSION is incremented.
 * Each migration receives the previous version's data and returns migrated data.
 */
async function runMigration(targetVersion: number): Promise<void> {
  switch (targetVersion) {
    case 1:
      // v0 → v1: Initial schema versioning.
      // No data transformation needed — the schema hasn't changed yet.
      // Future migrations will go here.
      break;
    default:
      break;
  }
}

/**
 * Safely reads a value from localStorage with JSON parsing.
 * Returns `fallback` if the key is missing, corrupt, or localStorage is unavailable.
 */
export function getStorageItem<T>(key: StorageKey, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Writes a value to localStorage with JSON serialization.
 * Silently catches quota errors.
 */
export function setStorageItem<T>(key: StorageKey, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded or storage unavailable — silently skip
  }
}

/**
 * Removes a key from localStorage.
 */
export function removeStorageItem(key: StorageKey): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {
    // Silently skip
  }
}

/**
 * Reads a raw string from localStorage (no JSON parsing).
 * Returns `fallback` if the key is missing.
 */
export function getStorageString(key: StorageKey, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

/**
 * Writes a raw string to localStorage (no JSON serialization).
 */
export function setStorageString(key: StorageKey, value: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // Silently skip
  }
}
