import { AuthenticationError } from "@taskify/backend-common";
import { NextFunction, Request, Response } from "express";

const skipPaths = ["/signin", "/signup", "/signout"];

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (skipPaths.includes(req.path)) {
    return next();
  }
  if (!req.session.userId) {
    return next(new AuthenticationError());
  }
  next();
}
