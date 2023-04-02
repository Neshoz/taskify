import { Request, Response, NextFunction } from "express";
import {
  AuthenticationError,
  InvalidCredentialsError,
  ClientError,
  ApiError,
} from "../errors";

export function errorMiddleware(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (response.headersSent) {
    return next(error);
  }

  switch (error.constructor) {
    case AuthenticationError:
      return response.status(401).json({ message: "Authentication required" });
    case InvalidCredentialsError:
      return response.status(400).json({ message: "Invalid credentials" });
    case ClientError:
      const clientError = error as ClientError;
      return response
        .status(clientError.status)
        .json({ message: clientError.message });
    case ApiError:
      const apiError = error as ApiError;
      return response
        .status(apiError.status)
        .json({ message: apiError.message });
    default:
      return response.status(500).json({ message: "Internal server error" });
  }
}
