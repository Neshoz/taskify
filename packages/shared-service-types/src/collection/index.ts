import { EntityBase } from "../entity";

export type ListPermission = "list:r" | "list:w";

export interface ListMeta {
  color: string;
  icon: string;
}

export interface ApiList extends EntityBase {
  name: string;
  permissions: ListPermission[];
  meta: ListMeta;
}
