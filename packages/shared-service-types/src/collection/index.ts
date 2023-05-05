import { ApiUser } from "../account";
import { EntityBase } from "../entity";

export type ListPermission = "list:r" | "list:w";

interface ListBase extends EntityBase {
  name: string;
}

export interface ApiList extends ListBase {
  permissions: ListPermission[];
  meta: ListMeta;
  users?: string[];
}

export interface ListUser extends ApiUser {
  permissions: ListPermission[];
}

export interface ListMeta {
  color: string;
  icon: string;
}

export interface CreateListInput {
  name: string;
  meta: ListMeta;
}

export interface AddUsersToListInput {
  email: string;
  permissions: ListPermission[];
}

export interface UpdateListUserPermissionsResponse {
  userId: string;
  permissions: ListPermission[];
}
