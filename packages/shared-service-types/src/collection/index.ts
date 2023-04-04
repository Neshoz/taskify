import { EntityBase } from "../entity";

export type ListPermission = "list:r" | "list:w";

export interface ApiList extends EntityBase {
  name: string;
  permissions: ListPermission[];
}
