import { ListPermission } from "@taskify/shared-service-types";

export interface UpdateListUserPermissionsVariables {
  listId: string;
  userId: string;
  permissions: ListPermission[];
}

export interface RemoveListUserVariables {
  listId: string;
  userId: string;
}

export interface UpdateListVariables {
  listId: string;
  name: string;
}
