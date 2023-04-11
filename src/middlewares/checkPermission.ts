import { RequestHandler } from 'express';
import AppError from '../error/AppError';
import Permission from '../models/permission';
import { IPermission } from '../types';
import { HttpStatusCode, UserPermissionOption } from '../types/enums';

// this middlewares must be used after checkAuth middleware so we can extract userData from reqest object

const checkPermission = (
  permissionName: UserPermissionOption
): RequestHandler => {
  return async (req, res, next) => {
    const { permissions } = req.userData!;
    try {
      const userPermissions = (await Permission.find({
        _id: { $in: permissions },
      }).select('name')) as Omit<IPermission, '_id'>[];

      const permissionNames = userPermissions.map((permission) => {
        return permission.name;
      });

      if (!permissionNames.includes(permissionName)) {
        throw new AppError({
          statusCode: HttpStatusCode.FORBIDDEN,
          message: `Access denied. Please request with ${permissionName} permission.`,
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default checkPermission;
