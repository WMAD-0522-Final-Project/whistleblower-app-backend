import { Schema, model } from 'mongoose';
import { IUserRole } from '../types';
import { UserRoleOption } from '../types/enums';

const userRoleSchema = new Schema<IUserRole>({
  name: {
    type: String,
    enum: UserRoleOption,
    default: UserRoleOption.GENERAL,
  },
});

const UserRole = model('UserRole', userRoleSchema);

export default UserRole;
