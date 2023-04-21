import { Types } from 'mongoose';
import {
  HttpStatusCode,
  UserRoleOption,
  UserPermissionOption,
} from '../types/enums';
import { UserRoleOptionType } from '../types';
import AppError from '../error/AppError';
import Permission from '../models/permission';
import UserRole from '../models/userRole';

export const getPermissionIds = async (permissions: UserPermissionOption[]) => {
  if (permissions === undefined) {
    throw new AppError({
      statusCode: HttpStatusCode.BAD_REQUEST,
      message: 'Please provide permission.',
    });
  }
  permissions.forEach((permission: UserPermissionOption) => {
    if (
      !(Object.values(UserPermissionOption) as string[]).includes(permission)
    ) {
      throw new AppError({
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: 'Please provide valid permission.',
      });
    }
  });

  const permissionIds = (
    (await Permission.find({
      name: { $in: permissions },
    }).select({ _id: 1 })) as { _id: Types.ObjectId }[]
  ).map((obj) => {
    return obj._id;
  });

  return permissionIds;
};

export const getRoleId = async (roleName: UserRoleOptionType) => {
  if (
    !(Object.values(UserRoleOption) as UserRoleOptionType[]).includes(roleName)
  ) {
    throw new AppError({
      statusCode: HttpStatusCode.BAD_REQUEST,
      message: 'Please provide valid role.',
    });
  }

  const role = await UserRole.findOne({ name: roleName });

  return role!._id;
};
