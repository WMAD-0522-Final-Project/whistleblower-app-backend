import { Schema, model } from 'mongoose';
import { IRefreshToken } from '../types';

const refreshTokenSchema = new Schema<IRefreshToken>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  token: String,
  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
});

const RefreshToken = model('RefreshToken', refreshTokenSchema);

export default RefreshToken;
