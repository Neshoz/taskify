import { NextFunction, Request, Response } from "express";
import {
  ApiError,
  AuthenticationError,
  InvalidCredentialsError,
} from "@taskify/backend-common";
import * as authService from "../services/auth-service";
import * as userService from "../services/user-service";

export async function signInUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;

    const user = await authService.signInUser(email, password);
    const { password: _, ...rest } = user;

    req.session.regenerate((err) => {
      if (err) {
        console.debug(
          `Failed to regenerate session for user ${user.id} ${err}`
        );
      }

      req.session.userId = user.id;

      res.json(rest);
    });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return next(new ApiError(400, "Invalid credentials"));
    }
    next(error);
  }
}

export async function getSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.session.userId) {
    return next(new AuthenticationError());
  }

  try {
    const user = await userService.getUserById(req.session.userId);
    res.status(200).json({ sessionId: req.session.id, userId: user.id });
  } catch (error) {
    next(new AuthenticationError());
  }
}
