/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
export function maskSensitive(
  obj: Record<string, any>,
  keys: string[] = ["password", "token", "secret"],
): Record<string, any> {
  const clone = { ...obj };
  for (const key of keys) {
    if (clone[key]) clone[key] = "***";
  }
  return clone;
}
