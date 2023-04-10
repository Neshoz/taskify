import { EntityBase } from "../entity";

export type ListPermission = "list:r" | "list:w";

interface ListBase extends EntityBase {
  name: string;
}

export interface ApiList extends ListBase {
  permissions: ListPermission[];
  meta: ListMeta;
  users: string[];
}

export interface ListMeta {
  color: string;
  icon: string;
}

export interface CreateListInput {
  name: string;
  meta: ListMeta;
}
