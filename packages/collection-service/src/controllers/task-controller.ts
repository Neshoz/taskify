import { NextFunction, Response } from "express";
import { ApiError, ApiRequest } from "@taskify/backend-common";
import { TaskBase } from "@taskify/shared-service-types";
import * as taskService from "../services/task-service";
import { validateUserInvitedAndPermission } from "../util";

export async function getTasks(
  req: ApiRequest,
  res: Response<TaskBase[]>,
  next: NextFunction
) {
  try {
    const { listId } = req.params;
    const status = req.query?.status as boolean | undefined;

    if (!listId) {
      throw new ApiError(400, "List id is required");
    }

    const tasks = await taskService.getTasks(req.userId!, listId, status);
    const json = tasks.map(({ list_id, ...rest }) => ({
      ...rest,
      listId,
    }));

    res.json(json);
  } catch (error) {
    next(error);
  }
}

export async function createTask(
  req: ApiRequest,
  res: Response<TaskBase>,
  next: NextFunction
) {
  try {
    const { listId } = req.params;
    const { name, description, dueDate } = req.body;

    if (!listId) {
      throw new ApiError(400, "List id is required");
    }

    const { list_id, ...rest } = await taskService.createTask({
      listId,
      name,
      description,
      dueDate,
    });

    res.json({ ...rest, listId });
  } catch (error) {
    next(error);
  }
}

export async function updateTask(
  req: ApiRequest,
  res: Response<TaskBase>,
  next: NextFunction
) {
  try {
    const { listId, taskId } = req.params;
    const { name, description, status, dueDate } = req.body;

    await validateUserInvitedAndPermission(req.userId!, listId, "list:w");

    const { list_id, ...rest } = await taskService.updateTask(taskId, {
      description,
      name,
      status,
      dueDate,
    });
    res.json({ ...rest, listId });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(
  req: ApiRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { listId, taskId } = req.params;

    await validateUserInvitedAndPermission(req.userId!, listId, "list:w");
    await taskService.deleteTask(taskId);

    res.status(202).json({ success: true });
  } catch (error) {
    next(error);
  }
}
