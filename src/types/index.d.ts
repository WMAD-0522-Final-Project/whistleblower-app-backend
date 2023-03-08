import { Types } from 'mongoose';

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

export enum UserRoleOption {
  General = 'general',
  Admin = 'admin',
  SuperAdmin = 'superAdmin',
}

export interface IUserRole extends MongoDoc {
  _id: Types.ObjectId;
  name: UserRoleOption;
}

export interface IDepartment extends MongoDoc {
  _id: Types.ObjectId;
  name: string;
}

// claim
export enum ClaimStatus {
  Unhandled = 'unHandled',
  InProgress = 'inProcess',
  Done = 'done',
  Archived = 'archived',
}
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
}
