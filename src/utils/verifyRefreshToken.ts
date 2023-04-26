import jwt from 'jsonwebtoken';
import RefreshToken from '../models/refreshToken';
import { HttpStatusCode } from '../types/enums';
import AppError from '../error/AppError';
import { UserJwtPayload } from '../types';

const verifyRefreshToken = async (token: string) => {
  const refreshToken = await RefreshToken.find({ token });
  if (!refreshToken) {
    throw new AppError({
      statusCode: HttpStatusCode.UNAUTHORIZED,
      message: 'Invalid token provided.',
    });
  }
  const verifiedToken = jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET!
  ) as UserJwtPayload;

  return verifiedToken;
};

export default verifyRefreshToken;
