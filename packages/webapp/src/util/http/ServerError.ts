interface ErrorDetails {
  message: string;
}

export class ServerError extends Error {
  status: number;
  details: ErrorDetails;

  constructor(response: Response, details: ErrorDetails) {
    super(response.statusText);
    this.name = "ServerError";
    this.status = response.status;
    this.details = details;
  }
}
