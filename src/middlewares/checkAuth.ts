import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { RequestHandler } from 'express';
import AppError from '../error/AppError';
import { UserJwtPayload } from '../types';
import { HttpStatusCode } from '../types/enums';
import User from '../models/user';

const checkAuth: RequestHandler = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      throw new AppError({
        message: 'Please provide authorization header.',
        statusCode: HttpStatusCode.UNAUTHORIZED,
      });
    }
    const accessToken = authorizationHeader.split(' ')[1];

    const decodedToken = jwt.verify(
      accessToken,
      process.env.JWT_SECRET!
    ) as UserJwtPayload;

    const user = await User.findById(decodedToken.userId).populate('roleId');

    if (!user) {
      throw new AppError({
        message: 'Auth failed. User not exist.',
        statusCode: HttpStatusCode.UNAUTHORIZED,
      });
    }
    req.userData = {
      ...user._doc,
      role: user.roleId,
      password: undefined,
    };

    next();
  } catch (err) {
    next(err);
  }
};

export default checkAuth;
