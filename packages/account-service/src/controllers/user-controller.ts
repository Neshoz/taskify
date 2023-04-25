import { NextFunction, Request, Response } from "express";
import { ApiUser } from "@taskify/shared-service-types";
import * as userService from "../services/user-service";
import { ApiError } from "@taskify/backend-common";

export async function getSessionUser(
  req: Request,
  res: Response<ApiUser>,
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

export async function searchUsers(
  req: Request,
  res: Response<ApiUser[]>,
  next: NextFunction
) {
  try {
    const term = req.query.term as string;

    const users = await userService.searchUsers(term);

    return res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function getUsersByIds(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = req.body.users as string[];

    if (!users) {
      throw new ApiError(400, "Missing users in request body");
    }

    const foundUsers = await userService.getUsersByIds(users);
    res.json(foundUsers);
  } catch (error) {
    next(error);
  }
}
