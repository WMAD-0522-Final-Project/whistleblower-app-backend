import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import AppError from '../error/AppError';
import { HttpStatusCode } from '../types/enums';
import User from '../models/user';

export const signup: RequestHandler = async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT!)
    );

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.AUTH_EXPIRESIN!,
    });
    return res.status(HttpStatusCode.CREATED).json({
      message: 'New user registered successfully!',
      user: {
        ...user._doc,
        password: undefined,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError({
        statusCode: HttpStatusCode.NOT_FOUND,
        message: 'User with provided credentials are not found.',
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError({
        message: 'Invalid credentials',
        statusCode: HttpStatusCode.UNAUTHORIZED,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.AUTH_EXPIRESIN!,
    });
    return res.status(HttpStatusCode.OK).json({
      message: 'User logged in successfully!',
      user: { ...user._doc, password: undefined },
      token,
    });
  } catch (err) {
    next(err);
  }
};
