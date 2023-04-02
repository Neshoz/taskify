import { Response, NextFunction } from "express";
import { parse } from "cookie";
import { authClient } from "../clients";
import { AuthenticationError } from "../errors";
import { ApiRequest } from "../types";

const skipPaths = ["/signin", "/signup", "/signout"];

export async function authMiddleware(
  req: ApiRequest,
  res: Response,
  next: NextFunction
) {
  if (skipPaths.includes(req.path)) {
    return next();
  }

  const cookie = parse(req.headers.cookie || "");

  if (!cookie.session) {
    return next(new AuthenticationError());
  }

  try {
    const { sessionId, userId } = await authClient.getSession(cookie.session);
    req.userId = userId;
    req.sessionId = sessionId;
    next();
  } catch (error) {
    next(new AuthenticationError());
  }
}
