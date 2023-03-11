import { ErrorRequestHandler, RequestHandler } from 'express';
import mongoose from 'mongoose';
import AppError from '../error/AppError';
import { ValidationErrors } from '../types';
import { HttpStatusCode } from '../types/enums';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('error: ', err);

  if (err instanceof mongoose.Error.ValidationError) {
    let errors: ValidationErrors = {};
    Object.keys(err.errors).forEach((key) => {
      switch (err.errors[key].kind) {
        case 'required':
          errors[key] = `${err.errors[key].path} field is required`;
          break;
        default:
          errors[key] = err.errors[key].message;
      }
    });
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      message: 'Validation error occured.',
      errors,
    });
  }

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
