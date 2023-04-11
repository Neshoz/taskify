import { UpdateTaskInput } from "@taskify/shared-service-types";

export interface UpdateTaskVariables extends UpdateTaskInput {
  listId: string;
  taskId: string;
}

export interface TaskFilters {
  status: boolean;
}
