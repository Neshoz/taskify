import { EntityBase } from "@taskify/backend-common";

export interface UserDao extends EntityBase {
  email: string;
  password: string;
}

export type UserDto = Omit<UserDao, "password">;
