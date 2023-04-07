import { Schema, model } from 'mongoose';
import { IUser } from '../types';
import {
  validEmailAdress,
  specialCharactorExistence,
  numsExistence,
  upperCaseExistence,
} from '../utils/validator';

const userSchema = new Schema<IUser>({
  roleId: {
    type: Schema.Types.ObjectId,
    ref: 'UserRole',
    // required: true,
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
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
        message:
          'Password must contain at least one special characters (Example: !, @, %).',
      },
      {
        validator: upperCaseExistence,
        message: 'Password must contain at least one uppercase charactar',
      },
      {
        validator: numsExistence,
        message: 'Password must contain at least one number.',
      },
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
  departmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
  },
  profileImg: String,
  permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
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
