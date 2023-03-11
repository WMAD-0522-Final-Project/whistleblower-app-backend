import { Schema, model } from 'mongoose';
import { IUser } from '../types';
import {
  validEmailAdress,
  specialCharactorExistence,
  numsExistence,
} from '../utils/validator';

const userSchema = new Schema<IUser>({
  roleId: {
    type: Schema.Types.ObjectId,
    ref: 'UserRole',
    // required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validEmailAdress,
      message: 'Please provide valid email address.',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must have more than 8 charactars.'],
    validate: [
      {
        validator: specialCharactorExistence,
        msg: 'Password must contain at least one special characters (Example: !, @, %).',
      },
      { validator: numsExistence, msg: 'uh oh' },
    ],
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
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
