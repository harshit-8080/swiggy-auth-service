import { Request, NextFunction } from 'express';
import { AuthRequest } from '../types';
import createHttpError from 'http-errors';

export const canAccess = (roles: string[]) => {
  return (req: Request, next: NextFunction) => {
    const _req = req as AuthRequest;
    const roleFromToken = _req.auth.role;

    if (!roles.includes(roleFromToken)) {
      const error = createHttpError(
        403,
        'You dont have permission to access this',
      );

      next(error);
      return;
    }
    next();
  };
};
