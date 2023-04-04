import { NextFunction, Response } from "express";
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

export async function createList(
  req: ApiRequest,
  res: Response<ApiList>,
  next: NextFunction
) {
  try {
  } catch (error) {
    next(error);
  }
}

export async function updateList(
  req: ApiRequest,
  res: Response<ApiList>,
  next: NextFunction
) {
  try {
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
  } catch (error) {
    next(error);
  }
}
