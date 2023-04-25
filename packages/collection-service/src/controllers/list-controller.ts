import { NextFunction, Response } from "express";
import { DatabaseError } from "pg";
import {
  accountServiceClient,
  ApiError,
  ApiRequest,
} from "@taskify/backend-common";
import {
  AddUsersToListInput,
  ApiList,
  ListUser,
} from "@taskify/shared-service-types";
import * as listService from "../services/list-service";
import { validateUserInvitedAndPermission } from "../util";

export async function getLists(
  req: ApiRequest,
  res: Response<ApiList[]>,
  next: NextFunction
) {
  try {
    const userLists = await listService.getLists(req.userId!);
    const listsUsers = await listService.getListsUsers(
      userLists.map(({ id }) => id)
    );

    const mergedResult: ApiList[] = userLists.map((list) => {
      const index = listsUsers.findIndex((el) => el.listId === list.id);

      return {
        ...list,
        users: index === -1 ? [] : listsUsers[index].userIds,
      };
    });

    res.json(mergedResult);
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

    await validateUserInvitedAndPermission(req.userId!, listId, "list:r");

    const list = await listService.getList(listId);

    res.json(list);
  } catch (error) {
    next(error);
  }
}

export async function getListUsers(
  req: ApiRequest,
  res: Response<ListUser[]>,
  next: NextFunction
) {
  try {
    const { listId } = req.params;

    if (!listId) {
      throw new ApiError(400, "List id is required");
    }

    await validateUserInvitedAndPermission(req.userId!, listId, "list:r");

    const listUsers = await listService.getListUsers(listId);
    const users = await accountServiceClient.getUsers({
      headers: req.headers,
      users: listUsers.map(({ userId }) => userId),
    });

    const mergedResult: ListUser[] = users.map((user) => {
      const index = listUsers.findIndex(({ userId }) => user.id === userId);
      return {
        ...user,
        permissions: listUsers[index].permissions,
      };
    });

    res.json(mergedResult);
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

    await validateUserInvitedAndPermission(req.userId!, listId, "list:w");

    const list = await listService.updateList(listId, name);
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

    await validateUserInvitedAndPermission(req.userId!, listId, "list:w");
    await listService.deleteList(listId);

    res.status(204).json({ success: true });
  } catch (error) {
    next(error);
  }
}

export async function updateListUsers(
  req: ApiRequest,
  res: Response<AddUsersToListInput[]>,
  next: NextFunction
) {
  try {
    const { listId } = req.params;

    await validateUserInvitedAndPermission(req.userId!, listId, "list:w");

    const newListUsers = await listService.updateListUsers(
      req.userId!,
      listId,
      req.body
    );

    res.status(201).json(newListUsers);
  } catch (error) {
    next(error);
  }
}
