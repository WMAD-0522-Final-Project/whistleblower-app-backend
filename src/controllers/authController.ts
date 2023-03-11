import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import AppError from '../error/AppError';
import { HttpStatusCode } from '../types/enums';
import User from '../models/user';

export const signup: RequestHandler = async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    // if (!email || !password || !firstName || !lastName) {
    //   throw new AppError({
    //     statusCode: HttpStatusCode.BAD_REQUEST,
    //     message: 'Please fill all require input',
    //   });
    // }

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
    });

    return res.status(HttpStatusCode.CREATED).json({
      message: 'New user registered successfully!',
    });
  } catch (err) {
    next(err);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // if (!email || !password) {
    //   throw new AppError({
    //     statusCode: HttpStatusCode.BAD_REQUEST,
    //     message: 'Please fill all required input',
    //   });
    // }
    const user = await User.findOne({ email, password });
    if (!user) {
      throw new AppError({
        statusCode: HttpStatusCode.NOT_FOUND,
        message: 'User with provided credentials are not found.',
      });
    }
    // const token = jwt.sign({ user }, process.env.JWT_SECRET!, {
    //   expiresIn: process.env.AUTH_EXPIRESIN!,
    // });
    return res.status(HttpStatusCode.OK).json({
      message: 'User logged in successfully!',
      user,
      //   token
    });
  } catch (err) {
    next(err);
  }
};
