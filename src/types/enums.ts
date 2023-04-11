export enum ClaimStatus {
  UNHANDLED = 'unHandled',
  IN_PROCESS = 'inProcess',
  DONE = 'done',
  ARCHIVED = 'archived',
}

export enum UserRoleOption {
  GENERAL = 'general',
  ADMIN = 'admin',
}

export enum UserPermissionOption {
  SYSTEM_MANAGEMENT = 'systemManagement',
  CASE_MANAGEMENT = 'caseManagement',
  REPORT_VIEWING = 'reportViewing',
  USER_MANAGEMENT = 'userManagement',
}

// error
export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum ErrorType {
  APP = 'AppError',
  DUPLICATE = 'DuplicateKeyError',
  VALIDATION = 'ValidationError',
}
