import { NextFunction, Response } from "express";
import { DatabaseError } from "pg";
import {
  accountServiceClient,
  ApiError,
  ApiRequest,
  RabbitMQClient,
} from "@taskify/backend-common";
import { ApiList, ListUser } from "@taskify/shared-service-types";
import * as listService from "../services/list-service";
import { validateUserInvitedAndPermission } from "../util";
import { AddUserToListQuery } from "../services/types";

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
    const client = new RabbitMQClient();
    const topic = await client.topic("collection:created");
    const { name, meta } = req.body;

    const list = await listService.createList(req.userId!, { name, meta });
    await topic.publishMessage({ list });
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

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

export async function deleteUserFromList(
  req: ApiRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { listId, userId } = req.params;

    await validateUserInvitedAndPermission(userId, listId, "list:w");
    await listService.deleteUserFromList(listId, userId);

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

export async function addUserToList(
  req: ApiRequest,
  res: Response<AddUserToListQuery>,
  next: NextFunction
) {
  try {
    const { listId } = req.params;
    const { email, permissions } = req.body;

    await validateUserInvitedAndPermission(req.userId!, listId, "list:w");

    const [user] = await accountServiceClient.searchUsers({
      headers: req.headers,
      searchTerm: email,
    });

    const result = await listService.addUserToList(listId, {
      userId: user.id,
      permissions,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateListUser(
  req: ApiRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { listId, userId } = req.params;
    const { permissions } = req.body;

    await validateUserInvitedAndPermission(req.userId!, listId, "list:w");

    const result = await listService.updateListUser(
      listId,
      userId,
      permissions
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
}
