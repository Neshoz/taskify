export class InvalidCredentialsError extends Error {}
export class AuthenticationError extends Error {}
export class AuthorizationError extends Error {}

export class ClientError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export class ApiError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
