import { HttpStatusCode } from '../types/enums';
import { AppErrorArgs } from '../types';

class AppError extends Error {
  public statusCode: HttpStatusCode;
  constructor(args: AppErrorArgs) {
    super(args.message);
    this.statusCode = args.statusCode;
  }
}

export default AppError;
