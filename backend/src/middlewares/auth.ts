import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET
export const authMiddleware = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.token as string;

    if (!token) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    const payload = jwt.verify(token, JWT_SECRET!) as any;

    req.user = payload;
    req.userId = payload.id
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token expired' });
      return;
    }
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Role-based authorization middleware
export const checkRoles = (allowedRoles: ('admin' | 'employee')[]): any => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }
    next();
  };
};

// Admin only middleware
export const adminOnly = checkRoles(['admin']);

// Employee and admin middleware
export const employeeOrAdmin = checkRoles(['admin', 'employee']);

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Check if user is authenticated (should be set by authMiddleware)
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
      error: 'UNAUTHORIZED'
    });
    return;
  }

  // Check if user has admin role
  if (req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      message: 'Admin access required',
      error: 'INSUFFICIENT_PERMISSIONS'
    });
    return;
  }

  next();
};