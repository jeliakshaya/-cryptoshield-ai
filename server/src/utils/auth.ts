import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export type JwtUser = { id: string; email: string; role: string };

export function signToken(user: JwtUser): string {
  return jwt.sign(user, config.jwtSecret, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtUser {
  return jwt.verify(token, config.jwtSecret) as JwtUser;
}
