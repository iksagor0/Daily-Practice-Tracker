/**
 * Recursively removes all keys with 'undefined' values from an object or array.
 * This is necessary because Firebase Realtime Database 'set' operations fail if
 * any nested property is 'undefined'.
 * 
 * @param data - The object or array to sanitize.
 * @returns A deep copy of the data without 'undefined' properties.
 */
export function sanitizeForFirebase<T>(data: T): T {
  if (data === null || typeof data !== "object") {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeForFirebase(item)) as unknown as T;
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      result[key] = sanitizeForFirebase(value);
    }
  }

  return result as unknown as T;
}
