import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import AppError from '../error/AppError';
import { HttpStatusCode } from '../types/enums';
import User from '../models/user';
import generateToken from '../utils/generateToken';
import verifyRefreshToken from '../utils/verifyRefreshToken';
import RefreshToken from '../models/refreshToken';

export const verifyToken: RequestHandler = async (req, res, next) => {
  // token gets verified in middleware
  return res.status(HttpStatusCode.OK).json({
    message: 'Token successfully verified.',
    user: req.userData!,
  });
};

export const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).populate('roleId');
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

    const { accessToken, refreshToken } = await generateToken(user._id);

    return res.status(HttpStatusCode.OK).json({
      message: 'User logged in successfully!',
      user: { ...user._doc, role: user.roleId, password: undefined },
      token: accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  const { _id: userId } = req.userData!;
  try {
    await RefreshToken.deleteOne({ userId });

    return res.status(HttpStatusCode.OK).json({
      message: 'User logged out successfully!',
    });
  } catch (err) {
    next(err);
  }
};

export const refreshToken: RequestHandler = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      throw new AppError({
        message: 'Please provide authorization header.',
        statusCode: HttpStatusCode.UNAUTHORIZED,
      });
    }
    const refreshToken = authorizationHeader.split(' ')[1];

    const verifiedToken = await verifyRefreshToken(refreshToken);

    const { accessToken, refreshToken: newRefreshToken } = await generateToken(
      verifiedToken.userId
    );

    res.status(HttpStatusCode.CREATED).json({
      accessToken,
      refreshToken: newRefreshToken,
      message: 'Nes token created successfully',
    });
  } catch (err) {
    next(err);
  }
};
