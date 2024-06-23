import { Request, Response, NextFunction } from 'express';
import AppError from './AppError';

export const handleError = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  return res.status(statusCode).json({
    status,
    statusCode,
    message: err.message,
  });
};
