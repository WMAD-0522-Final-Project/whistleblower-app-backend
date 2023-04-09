import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import AppError from '../error/AppError';
import { HttpStatusCode } from '../types/enums';
import User from '../models/user';

export const verifyToken: RequestHandler = async (req, res, next) => {
  // token gets verified in middleware
  return res.status(HttpStatusCode.OK).json({
    message: 'Token successfully verified.',
  });
};

export const signup: RequestHandler = async (req, res, next) => {
  const { email, password, firstName, lastName, companyId } = req.body;
  try {
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      companyId,
    });

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT!)
    );

    // to utilize mongoose validation, we have to save hashed password after saving database
    // using update query so that validation hook will not execute again in case hashed password doesn't meet validation
    await User.updateOne({ email }, { password: hashedPassword });

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

export const logout: RequestHandler = (req, res, next) => {
  try {
  } catch (err) {}
};
