import { EntityBase } from "../entity";

export interface TaskBase extends EntityBase {
  listId: string;
  dueDate: string;
  name: string;
  description: string;
  status: boolean;
}
