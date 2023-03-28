import { Types } from 'mongoose';
import { HttpStatusCode, ErrorType } from './enums';

interface MongoDoc {
  _doc: any;
}

// user
export interface IUser extends MongoDoc {
  _id: Types.ObjectId;
  roleId: Types.ObjectId;
  companyId: Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department: Types.ObjectId;
  permissions: Types.ObjectId[];
  profileImg: string;
  createdAt: number;
  updatedAt: number;
}

export type UserProfile = Pick<
  IUser,
  '_id' | 'profileImg' | 'firstName' | 'lastName'
>;

export interface IUserRole extends MongoDoc {
  _id: Types.ObjectId;
  name: string;
}

export interface IPermission extends MongoDoc {
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
  companyId: Types.ObjectId;
  inChargeAdmins: Types.ObjectId[];
  title: string;
  body: string;
  status: string;
  categories: Types.ObjectId[];
  labels: Types.ObjectId[];
  hasNewComment: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ClaimDetail
  extends Omit<IClaim, 'inChargeAdmins' | 'labels' | 'categories'> {
  inChargeAdmins: UserProfile[];
  labels: Omit<ILabel, 'companyId'>[];
  categories: IClaimCategory[];
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

export interface ILabel extends MongoDoc {
  _id: Types.ObjectId;
  name: string;
  color: string;
  companyId: Types.ObjectId;
}

// company
export interface ICompany extends MongoDoc {
  _id: Types.ObjectId;
  name: string;
  logoImg: string;
  themeColors: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
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
