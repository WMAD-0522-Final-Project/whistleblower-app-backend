import { Types } from 'mongoose';
import RefreshToken from '../models/refreshToken';
import jwt from 'jsonwebtoken';

const generateToken = async (userId: Types.ObjectId) => {
  const payload = { userId };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '10s',
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: '5m',
  });

  await RefreshToken.deleteOne({ userId });

  await RefreshToken.create({
    userId,
    token: refreshToken,
  });
  return { accessToken, refreshToken };
};

export default generateToken;
