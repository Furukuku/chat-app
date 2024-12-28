import 'dotenv/config';
import jwt from 'jsonwebtoken';

type Payload = {[key: string]: any | undefined};

const secretKey = process.env.JWT_SECRET || '';

export const signToken = (payload: Payload) => {
  const token = jwt.sign(payload, secretKey, { expiresIn: '15d' });
  return token;
};

export const verifyToken = (token: string) => {
  const decoded = jwt.verify(token, secretKey);
  return decoded;
};