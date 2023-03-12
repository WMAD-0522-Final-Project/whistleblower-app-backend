export enum ClaimStatus {
  Unhandled = 'unHandled',
  InProcess = 'inProcess',
  Done = 'done',
  Archived = 'archived',
}

export enum UserRoleOption {
  General = 'general',
  Admin = 'admin',
  SuperAdmin = 'superAdmin',
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
