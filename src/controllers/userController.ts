import { RequestHandler } from 'express';
import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import AppError from '../error/AppError';
import User from '../models/user';
import { HttpStatusCode, UserRoleOption } from '../types/enums';
import uploadFile from '../utils/uploadFile';
import { APP_NAME, SERVER_TMP_DIRECTORY } from '../config/constants';
import { getPermissionIds, getRoleId } from '../utils/getId';
import sendEmail from '../utils/sendEmail';
import { UserDetail } from '../types';

export const createNewUser: RequestHandler = async (req, res, next) => {
  const { companyId } = req.userData!;
  const {
    email,
    password,
    firstName,
    lastName,
    role,
    permissions,
    departmentId,
  } = req.body;
  try {
    const roleId = await getRoleId(role);
    let user;

    if (role === UserRoleOption.ADMIN) {
      const permissionIds = await getPermissionIds(permissions);
      user = await User.create({
        email,
        password,
        firstName,
        lastName,
        companyId,
        roleId,
        permissions: permissionIds,
        departmentId,
      });
    } else {
      user = await User.create({
        email,
        password,
        firstName,
        lastName,
        companyId,
        roleId,
        departmentId,
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT!)
    );

    // to utilize mongoose validation, we have to save hashed password after saving database
    // using update query so that validation hook will not execute again in case hashed password doesn't meet validation
    // TODO: this could be change by removing mongoose password validation and validate here
    await User.updateOne({ email }, { password: hashedPassword });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.AUTH_EXPIRESIN!,
    });

    return res.status(HttpStatusCode.CREATED).json({
      message: 'New user registered successfully!',
      user: {
        ...user._doc,
        password: undefined,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserInfo: RequestHandler = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = (
      (await User.aggregate([
        { $match: { _id: new Types.ObjectId(userId) } },
        {
          $lookup: {
            from: 'userroles',
            localField: 'roleId',
            foreignField: '_id',
            as: 'role',
          },
        },
        { $unwind: '$role' },
        {
          $lookup: {
            from: 'permissions',
            localField: 'permissions',
            foreignField: '_id',
            as: 'permissions',
          },
        },
        {
          $lookup: {
            from: 'departments',
            localField: 'departmentId',
            foreignField: '_id',
            as: 'department',
            pipeline: [{ $project: { companyId: 0 } }],
          },
        },
        { $unwind: '$department' },
        { $project: { roleId: 0, departmentId: 0 } },
      ])) as UserDetail[]
    )[0];

    if (!user) {
      throw new AppError({
        statusCode: HttpStatusCode.NOT_FOUND,
        message: 'User with provided Id not found.',
      });
    }
    return res.status(HttpStatusCode.OK).json({
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const updateUserInfo: RequestHandler = async (req, res, next) => {
  const { userId } = req.params;
  const { email, firstName, lastName, departmentId, permissions, role } =
    req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError({
        statusCode: HttpStatusCode.NOT_FOUND,
        message: 'User with provided Id not found.',
      });
    }

    if (email) user.email = email;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (departmentId) user.departmentId = new Types.ObjectId(departmentId);

    if (permissions) {
      const permissionIds = await getPermissionIds(permissions);
      user.permissions = permissionIds;
    }

    if (role) {
      const roleId = await getRoleId(role);
      user.roleId = roleId;
    }

    await user.save();

    return res.status(HttpStatusCode.OK).json({
      message: "User's information updated successfully!",
    });
  } catch (err) {
    next(err);
  }
};

export const updateUserPasssword: RequestHandler = async (req, res, next) => {
  const { userId } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError({
        statusCode: HttpStatusCode.NOT_FOUND,
        message: 'User with provided Id not found.',
      });
    }

    user.password = password;
    await user.save();

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT!)
    );

    // to utilize mongoose validation, we have to save hashed password after saving database
    // using update query so that validation hook will not execute again in case hashed password doesn't meet validation
    // TODO: this could be change by removing mongoose password validation and validate here
    await User.updateOne({ _id: userId }, { password: hashedPassword });

    const subject = 'New password is issued';

    const mailBody = `
    <h2>Your password is changed.</h2>
    <p>Hello, ${user.firstName} ${user.lastName}</p>
    <p>This is your new password for ${APP_NAME}</p>
    <p><b>${password}</b></p>
    `;

    await sendEmail(user.email, subject, mailBody);

    res.status(HttpStatusCode.OK).json({
      message: 'User password updated successfully!',
    });
  } catch (err) {
    next(err);
  }
};

export const updateUserProfileImg: RequestHandler = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError({
        statusCode: HttpStatusCode.NOT_FOUND,
        message: 'User with provided Id not found.',
      });
    }
    if (!req.file) {
      throw new AppError({
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: 'Please upload profile image.',
      });
    }

    const { url } = await uploadFile(
      `/${SERVER_TMP_DIRECTORY}/${req.file.filename}`,
      user._id.toHexString(),
      'user'
    );

    user.profileImg = url;
    await user.save();

    return res.status(HttpStatusCode.OK).json({
      message: 'User profle img updated successfully!',
    });
  } catch (err) {
    next(err);
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const { deletedCount } = await User.deleteOne({ _id: userId });
    if (deletedCount === 0) {
      throw new AppError({
        statusCode: HttpStatusCode.NOT_FOUND,
        message: 'User with provided Id not found.',
      });
    }

    return res.status(HttpStatusCode.OK).json({
      message: 'User deleted successfully!',
    });
  } catch (err) {
    next(err);
  }
};
