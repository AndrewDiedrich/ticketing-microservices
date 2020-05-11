import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayLoad {
  id: string;
  email: string;
}

// put current User on express type Request, may or may not be logged in so ?
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayLoad;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayLoad;
    req.currentUser = payload;
  } catch (err) {}
  // continue onto next middleware
  next();
};
