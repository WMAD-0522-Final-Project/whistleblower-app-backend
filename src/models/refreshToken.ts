import { Schema, model } from 'mongoose';
import { IRefreshToken } from '../types';

const refreshTokenSchema = new Schema<IRefreshToken>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Number,
    default: () => Date.now(),
  },
});

refreshTokenSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const RefreshToken = model('RefreshToken', refreshTokenSchema);

export default RefreshToken;
