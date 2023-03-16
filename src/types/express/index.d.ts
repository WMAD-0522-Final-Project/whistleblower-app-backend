import { IUser } from '../index';

// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/express-serve-static-core/index.d.ts#L18-L19
declare global {
  namespace Express {
    interface Request {
      userData?: IUser;
      file?: { filename: string };
    }
  }
}
