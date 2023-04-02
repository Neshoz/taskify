import { NextFunction, Request, Response } from "express";
import * as userService from "../services/user-service";

export async function getSessionUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { password, ...rest } = await userService.getUserById(
      req.session.userId
    );
    return res.status(200).json({ ...rest });
  } catch (error) {
    next(error);
  }
}
