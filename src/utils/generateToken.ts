import RefreshToken from '../models/refreshToken';
import { IUser } from '../types';
import jwt from 'jsonwebtoken';

const generateToken = async (user: IUser) => {
  const payload = { userId: user._id };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '10s',
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: '5m',
  });

  await RefreshToken.deleteOne({ userId: user._id });

  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
  });
  return { accessToken, refreshToken };
};

export default generateToken;
