import { ListPermission } from "@taskify/shared-service-types";

export interface AddUserToListQuery {
  userId: string;
  permissions: ListPermission[];
}
