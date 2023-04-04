import { EntityBase } from "@taskify/shared-service-types";

export interface UserDao extends EntityBase {
  email: string;
  password: string;
}
