import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../helpers/token";

export interface AuthRequest extends Request {
  userId?: string;
}

const guest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(200).send('Authorized');
      next();
      return;
    }

    const user: any = verifyToken(token);
    
    res.status(403).send('Unauthorized');
    return;
  } catch (err) {
    res.status(200).json('Authorized');
    next();
    return;
  }
};

export default guest;