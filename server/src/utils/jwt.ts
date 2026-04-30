import jwt from 'jsonwebtoken';
import { envConfig } from '../config/environment';
import { SignOptions } from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, envConfig.jwt.secret, {
    expiresIn: envConfig.jwt.expiresIn
  } as SignOptions);
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, envConfig.jwt.secret) as TokenPayload;
};