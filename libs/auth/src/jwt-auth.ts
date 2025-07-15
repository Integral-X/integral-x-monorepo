import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export function signJwt(payload: object, options?: SignOptions): string {
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyJwt<T = any>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch {
    return null;
  }
} 