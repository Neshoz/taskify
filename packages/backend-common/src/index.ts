import { db } from "./db";
import {
  AuthenticationError,
  InvalidCredentialsError,
  ApiError,
} from "./errors";
import { authMiddleware } from "./middlewares/auth-middleware";
import { errorMiddleware } from "./middlewares/error-middleware";
import { EntityBase, ApiRequest } from "./types";
import { authClient } from "./clients";

export {
  AuthenticationError,
  ApiError,
  InvalidCredentialsError,
  authMiddleware,
  errorMiddleware,
  db,
  EntityBase,
  ApiRequest,
  authClient,
};
