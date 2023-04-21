import { RequestHandler } from 'express';
import User from '../models/user';
import sendEmail from '../utils/sendEmail';
import { IUser } from '../types';
import {
  HttpStatusCode,
  UserPermissionOption,
  inquiryOption,
} from '../types/enums';
import { getPermissionIds } from '../utils/getId';
import AppError from '../error/AppError';

export const contactAdmin: RequestHandler = async (req, res, next) => {
  const { email, inquiryType, message } = req.body;
  try {
    const contactedUser = await User.findOne({ email });
    if (!contactedUser) {
      throw new AppError({
        statusCode: HttpStatusCode.NOT_FOUND,
        message: "User with provided email doesn't exist.",
      });
    }

    let adminTeams: IUser[];

    if (
      inquiryType === inquiryOption.FORGOT_PASSWORD ||
      inquiryType === inquiryOption.CHANGE_USER_INFORMATION
    ) {
      adminTeams = await User.find({
        permissions: {
          $in: await getPermissionIds([UserPermissionOption.USER_MANAGEMENT]),
        },
      });
    } else if (inquiryType === inquiryOption.SYSTEM_ISSUE) {
      adminTeams = await User.find({
        permissions: {
          $in: await getPermissionIds([UserPermissionOption.SYSTEM_MANAGEMENT]),
        },
      });
    } else if (inquiryType === inquiryOption.OTHERS) {
      adminTeams = await User.find({});
    } else {
      throw new AppError({
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: 'Please provide valid iuquiry type.',
      });
    }

    contactedUser.inquiry = inquiryType;
    await contactedUser.save();

    if (adminTeams.length > 0) {
      const adminTeamsEmail = adminTeams.map((admin) => {
        return admin.email;
      });

      const subject = `User contacted  ${
        inquiryType !== inquiryOption.OTHERS && 'about ' + inquiryType
      } `;

      const mailBody = `
          <h1>Hello, Admin team.</h1>
          <p>General user (<b>${email}</b>) contacted you ${
        inquiryType !== inquiryOption.OTHERS && 'about ' + inquiryType
      }.</p>
          <p>message:<p>
          <p><b>${message}</b></p>
          <p>Please check contact page.</p>
          
        `;
      await sendEmail(adminTeamsEmail, subject, mailBody);
    }

    res.status(HttpStatusCode.OK).json({
      message: 'Contact information sent admin team correctly!',
    });
  } catch (err) {
    next(err);
  }
};
