import { HttpStatusCode } from '../types/enums';
import { AppErrorArgs } from '../types';
import { ErrorType } from '../types/enums';

class AppError extends Error {
  public statusCode: HttpStatusCode;
  public type: ErrorType = ErrorType.APP;
  constructor(args: AppErrorArgs) {
    super(args.message);
    this.statusCode = args.statusCode;
    if (args.type) this.type = args.type;
  }
}

export default AppError;
