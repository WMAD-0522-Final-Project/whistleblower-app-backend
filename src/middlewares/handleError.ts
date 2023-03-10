import { ErrorRequestHandler, RequestHandler } from 'express';
import AppError from '../error/AppError';
import { HttpStatusCode } from '../types/enums';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('error: ', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }
  return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    message: 'Something went wrong.',
  });
};

export const routeNotFoundHandler: RequestHandler = (req, res, next) => {
  const err = new AppError({
    message: 'Route not found',
    statusCode: HttpStatusCode.NOT_FOUND,
  });

  next(err);
};
