import { Types } from 'mongoose';
import { HttpStatusCode, ErrorType } from './enums';

interface MongoDoc {
  _doc: any;
}

// user
export interface IUser extends MongoDoc {
  _id: Types.ObjectId;
  roleId: Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department: Types.ObjectId;
  profileImg: string;
  createdAt: number;
  updatedAt: number;
}

export interface IUserRole extends MongoDoc {
  _id: Types.ObjectId;
  name: string;
}

export interface IDepartment extends MongoDoc {
  _id: Types.ObjectId;
  name: string;
}

export interface UserJwtPayload {
  userId: Types.ObjectId;
}

// claim
export interface IClaim extends MongoDoc {
  _id: Types.ObjectId;
  inChargeAdminIds: Types.ObjectId[];
  title: string;
  status: string;
  categoryIds: Types.ObjectId[];
  hasNewComment: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface IClaimCategory extends MongoDoc {
  _id: Types.ObjectId;
  name: string;
}

export interface ICommentMessage extends MongoDoc {
  _id: Types.ObjectId;
  claimId: Types.ObjectId;
  userId: Types.ObjectId;
  message: string;
  createdAt: number;
  updatedAt: number;
}

// log
export interface ILog extends MongoDoc {
  _id: Types.ObjectId;
  content: string;
  userId: Types.ObjectId;
  createdAt: number;
  updatedAt: number;
}

// token
export interface IRefreshToken extends MongoDoc {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  token: string;
  createdAt: number;
  updatedAt: number;
}

// error
export interface AppErrorArgs {
  statusCode: HttpStatusCode;
  message: string;
  type?: ErrorType;
}
export interface ValidationErrors {
  [key: string]: string;
}
