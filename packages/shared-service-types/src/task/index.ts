import { EntityBase } from "../entity";

export type TaskStatus = 0 | 1;

export interface TaskBase extends EntityBase {
  listId: string;
  dueDate: string;
  name: string;
  description: string;
  status: boolean;
}
