import { NextFunction, Response } from "express";
import { ApiError, ApiRequest } from "@taskify/backend-common";
import { TaskBase } from "@taskify/shared-service-types";
import * as taskService from "../services/task-service";

export async function getTasks(
  req: ApiRequest,
  res: Response<TaskBase[]>,
  next: NextFunction
) {
  try {
    const { listId } = req.params;
    const status = req.query?.status as string | undefined;

    if (!listId) {
      throw new ApiError(400, "List id is required");
    }

    const tasks = await taskService.getTasks(req.userId!, listId, status);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
}
