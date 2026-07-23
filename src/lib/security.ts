import { argon2id, argon2Verify } from "hash-wasm";
import crypto from "crypto";

/**
 * Hashes a plain-text password using Argon2id.
 * Returns a standard PHC-encoded hash string.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  return argon2id({
    password: new TextEncoder().encode(password),
    salt,
    iterations: 3,
    memorySize: 65536, // 64 MB
    parallelism: 1,
    hashLength: 32,
    outputType: "encoded",
  });
}

/**
 * Verifies a password against a standard PHC-encoded Argon2id hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return argon2Verify({
    password: new TextEncoder().encode(password),
    hash,
  });
}
