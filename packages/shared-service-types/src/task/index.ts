import { EntityBase } from "../entity";

export interface TaskBase extends EntityBase {
  listId: string;
  dueDate: string | null;
  name: string;
  description: string;
  status: boolean;
}

export interface CreateTaskInput {
  listId: string;
  name: string;
  description: string;
  dueDate?: string | null;
}

export interface UpdateTaskInput {
  name?: string;
  description?: string;
  status?: boolean;
  dueDate?: string;
}
