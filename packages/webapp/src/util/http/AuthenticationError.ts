export class AuthenticationError extends Error {
  constructor(response: Response) {
    super(response.statusText);
    this.name = "AuthenticationError";
  }
}
