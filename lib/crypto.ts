/**
 * Browser-side API key encryption using the Web Crypto API.
 *
 * Uses AES-GCM (256-bit) with PBKDF2 key derivation.
 * The user's passphrase is never stored — it is held in memory only.
 *
 * Security properties:
 * - Encrypted values are stored in localStorage
 * - Each encryption generates a unique random salt and IV
 * - Without the passphrase, data is unrecoverable
 * - PBKDF2 iteration count: 600,000 (OWASP 2024 recommendation)
 */

import { getStorageString, setStorageString, removeStorageItem, STORAGE_KEYS } from "@/lib/storage";

const PBKDF2_ITERATIONS = 600_000;
const SALT_LENGTH = 32;    // bytes
const IV_LENGTH = 12;      // bytes (96 bits — recommended for AES-GCM)
const KEY_LENGTH = 256;    // bits

/**
 * Whether the user has set up passphrase-based encryption.
 * This is purely a flag — the passphrase itself is never persisted.
 */
export function isEncryptionActive(): boolean {
  return getStorageString(STORAGE_KEYS.ENCRYPTION_ACTIVE, "") === "true";
}

function setEncryptionActive(active: boolean): void {
  setStorageString(STORAGE_KEYS.ENCRYPTION_ACTIVE, active ? "true" : "false");
}

/**
 * Derives an AES-GCM key from a passphrase and salt using PBKDF2.
 */
async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt.buffer as ArrayBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"],
  );
}

/**
 * Encrypts a plaintext string.
 * Returns a base64-encoded string containing salt + IV + ciphertext.
 */
export async function encrypt(plaintext: string, passphrase: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveKey(passphrase, salt);
  const encoder = new TextEncoder();

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(plaintext),
  );

  // Pack salt + iv + ciphertext into a single base64 string
  const combined = new Uint8Array(SALT_LENGTH + IV_LENGTH + ciphertext.byteLength);
  combined.set(salt, 0);
  combined.set(iv, SALT_LENGTH);
  combined.set(new Uint8Array(ciphertext), SALT_LENGTH + IV_LENGTH);

  return arrayBufferToBase64(combined.buffer);
}

/**
 * Decrypts a ciphertext string previously produced by `encrypt`.
 */
export async function decrypt(ciphertext: string, passphrase: string): Promise<string> {
  const combined = base64ToArrayBuffer(ciphertext);
  const combinedBytes = new Uint8Array(combined);

  const salt = combinedBytes.slice(0, SALT_LENGTH);
  const iv = combinedBytes.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const data = combinedBytes.slice(SALT_LENGTH + IV_LENGTH);

  const key = await deriveKey(passphrase, salt);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    data,
  );

  return new TextDecoder().decode(decrypted);
}

// --- Encrypted key bundle management ---

interface EncryptedKeyBundle {
  gemini: string | null;
  opencode: string | null;
  anthropic: string | null;
  codex: string | null;
}

/**
 * Initializes encryption with the given passphrase.
 * Encrypts any existing plaintext API keys and stores them in the encrypted bundle.
 */
export async function initEncryption(
  passphrase: string,
  currentKeys: {
    gemini: string | null;
    opencode: string | null;
    anthropic: string | null;
    codex: string | null;
  },
): Promise<void> {
  const bundle: EncryptedKeyBundle = {
    gemini: currentKeys.gemini ? await encrypt(currentKeys.gemini, passphrase) : null,
    opencode: currentKeys.opencode ? await encrypt(currentKeys.opencode, passphrase) : null,
    anthropic: currentKeys.anthropic ? await encrypt(currentKeys.anthropic, passphrase) : null,
    codex: currentKeys.codex ? await encrypt(currentKeys.codex, passphrase) : null,
  };

  setStorageString(STORAGE_KEYS.ENCRYPTED_KEY_BUNDLE, JSON.stringify(bundle));
  setEncryptionActive(true);
}

/**
 * Decrypts all stored API keys using the given passphrase.
 * Returns null if the passphrase is incorrect.
 */
export async function decryptAllKeys(
  passphrase: string,
): Promise<{
  gemini: string | null;
  opencode: string | null;
  anthropic: string | null;
  codex: string | null;
} | null> {
  try {
    const raw = getStorageString(STORAGE_KEYS.ENCRYPTED_KEY_BUNDLE, "");
    if (!raw) return null;

    const bundle: EncryptedKeyBundle = JSON.parse(raw);
    const result: { gemini: string | null; opencode: string | null; anthropic: string | null; codex: string | null } = {
      gemini: null,
      opencode: null,
      anthropic: null,
      codex: null,
    };

    if (bundle.gemini) result.gemini = await decrypt(bundle.gemini, passphrase);
    if (bundle.opencode) result.opencode = await decrypt(bundle.opencode, passphrase);
    if (bundle.anthropic) result.anthropic = await decrypt(bundle.anthropic, passphrase);
    if (bundle.codex) result.codex = await decrypt(bundle.codex, passphrase);

    return result;
  } catch {
    // Decryption failed — likely wrong passphrase or corrupted data
    return null;
  }
}

/**
 * Clears all encrypted key data and disables encryption.
 */
export function clearEncryption(): void {
  removeStorageItem(STORAGE_KEYS.ENCRYPTED_KEY_BUNDLE);
  setEncryptionActive(false);
}

// --- Base64 helpers (browser-compatible) ---

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
