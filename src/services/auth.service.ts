import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { Service } from 'typedi';

import { Console } from '../utils/console.js';

@Service()
export class AuthService {
  // Default expiration time is 24 hours
  private expiresIn: number = 60 * 60 * 24;

  // Set expiration time in seconds
  setExpiresIn(expiresIn: number) {
    this.expiresIn = expiresIn;
  }

  generateToken(userId: string | Types.ObjectId) {
    if (!process.env.JWT_SECRET) {
      Console.error('❌ JWT_SECRET is not defined');
      process.exit(1);
    }

    return jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: this.expiresIn,
    });
  }

  setTokenCookie(res: any, token: string) {
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: this.expiresIn * 1000,
    });
  }

  clearTokenCookie(res: any) {
    res.clearCookie('token');
  }
}
