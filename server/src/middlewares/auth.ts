import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../helpers/token";

export interface AuthRequest extends Request {
  userId?: string;
}

const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).send('Unauthenticated');
      return;
    }

    const user: any = verifyToken(token);
    req.userId = user.id;
    next();
  } catch (err) {
    res.status(500).json({ error: err });
    return;
  }
};

export default auth;