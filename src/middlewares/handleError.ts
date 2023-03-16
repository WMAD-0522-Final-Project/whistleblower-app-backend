import { ErrorRequestHandler, RequestHandler, Response } from 'express';
import mongoose from 'mongoose';
import AppError from '../error/AppError';
import { ValidationErrors } from '../types';
import { HttpStatusCode, ErrorType } from '../types/enums';

const handleMongooseServerError = (err: any, res: Response) => {
  // duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    // return status code 200 ?  https://stackoverflow.com/a/53144807/18743540
    return res.status(HttpStatusCode.OK).json({
      message: `${field} already exists.`,
      type: ErrorType.DUPLICATE,
    });
  }
};

const handleMongooseValidationError = (
  err: mongoose.Error.ValidationError,
  res: Response
) => {
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
    type: ErrorType.VALIDATION,
  });
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('error: ', err);

  if (err.code) return handleMongooseServerError(err, res);

  if (err instanceof mongoose.Error.ValidationError)
    return handleMongooseValidationError(err, res);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      type: err.type,
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
