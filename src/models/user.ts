import { Schema, model } from 'mongoose';
import { IUser } from '../types';

const userSchema = new Schema<IUser>({
  roleId: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
  },
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  department: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
  },
  profileImg: String,
  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Number,
    default: () => Date.now(),
  },
});

userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const User = model('User', userSchema);

export default User;
