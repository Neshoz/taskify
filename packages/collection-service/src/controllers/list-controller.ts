import { NextFunction, Response } from "express";
import { DatabaseError } from "pg";
import { ApiError, ApiRequest } from "@taskify/backend-common";
import { ApiList } from "@taskify/shared-service-types";
import * as listService from "../services/list-service";

export async function getLists(
  req: ApiRequest,
  res: Response<ApiList[]>,
  next: NextFunction
) {
  try {
    const userLists = await listService.getLists(req.userId!);
    res.json(userLists);
  } catch (error) {
    next(error);
  }
}

export async function getList(
  req: ApiRequest,
  res: Response<ApiList>,
  next: NextFunction
) {
  try {
    const { listId } = req.params;

    if (!listId) {
      throw new ApiError(400, "List id is required");
    }

    const list = await listService.getList(req.userId!, listId);

    res.json(list);
  } catch (error) {
    next(error);
  }
}

export async function getListUsersCount(
  req: ApiRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { listId } = req.params;

    if (!listId) {
      throw new ApiError(400, "List id is required");
    }

    const listUsers = await listService.getListUsers(listId);

    res.json(listUsers);
  } catch (error) {
    next(error);
  }
}

export async function createList(
  req: ApiRequest,
  res: Response<ApiList>,
  next: NextFunction
) {
  try {
    const { name, meta } = req.body;

    const list = await listService.createList(req.userId!, { name, meta });
    res.status(200).json(list);
  } catch (error) {
    if (error instanceof DatabaseError) {
      if ((error.code = "23505")) {
        return next(new ApiError(409, "A list with that name already exists"));
      }
    }

    return next(error);
  }
}

export async function updateList(
  req: ApiRequest,
  res: Response<ApiList>,
  next: NextFunction
) {
  try {
    const { listId } = req.params;
    const { name } = req.body;

    const list = await listService.updateList(req.userId!, listId, name);
    res.status(200).json(list);
  } catch (error) {
    next(error);
  }
}

export async function deleteList(
  req: ApiRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { listId } = req.params;
    await listService.deleteList(req.userId!, listId);

    res.status(204).json({ success: true });
  } catch (error) {
    next(error);
  }
}
