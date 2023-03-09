import { Schema, model } from 'mongoose';
import { IUserRole } from '../types';

enum UserRoleOption {
  General = 'general',
  Admin = 'admin',
  SuperAdmin = 'superAdmin',
}

const userRoleSchema = new Schema<IUserRole>({
  name: {
    type: String,
    enum: UserRoleOption,
    default: UserRoleOption.General,
  },
});

const UserRole = model('UserRole', userRoleSchema);

export default UserRole;
