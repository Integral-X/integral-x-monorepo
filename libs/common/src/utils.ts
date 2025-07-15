export function maskSensitive(obj: Record<string, any>, keys: string[] = ['password', 'token', 'secret']): Record<string, any> {
  const clone = { ...obj };
  for (const key of keys) {
    if (clone[key]) clone[key] = '***';
  }
  return clone;
} 