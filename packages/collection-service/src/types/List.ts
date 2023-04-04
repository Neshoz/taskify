import { EntityBase } from "@taskify/backend-common";

export type ListPermission = "list:r" | "list:w";
export interface ListDao extends EntityBase {
  name: string;
  permissions: ListPermission;
}
