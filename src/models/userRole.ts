import { Schema, model } from 'mongoose';
import { IUserRole, UserRoleOption } from '../types';

const userRoleSchema = new Schema<IUserRole>({
  name: {
    type: String,
    enum: UserRoleOption,
    default: UserRoleOption.General,
  },
});

const UserRole = model('UserRole', userRoleSchema);

export default UserRole;
