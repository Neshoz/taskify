import { db } from "./db";
import {
  AuthenticationError,
  AuthorizationError,
  InvalidCredentialsError,
  ApiError,
} from "./errors";
import { authMiddleware } from "./middlewares/auth-middleware";
import { errorMiddleware } from "./middlewares/error-middleware";
import { ApiRequest } from "./types";
import { accountServiceClient } from "./clients";
import { RabbitMQClient } from "./rabbitmq";

export {
  AuthenticationError,
  AuthorizationError,
  ApiError,
  InvalidCredentialsError,
  RabbitMQClient,
  authMiddleware,
  errorMiddleware,
  db,
  ApiRequest,
  accountServiceClient,
};
