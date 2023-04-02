import { ApiError, db } from "@taskify/backend-common";
import SQL from "sql-template-strings";
import { UserDao } from "../types";

export async function getUserById(id: string | undefined): Promise<UserDao> {
  if (!id) {
    console.error(`Missing id for user`);
    throw new ApiError(400, "Missing id for user");
  }
  const result = await db.query<UserDao>(
    SQL`SELECT * FROM account.user WHERE id = ${id}`
  );

  if (result.rowCount === 0) {
    console.error(`A user with id ${id} does not exist`);
    throw new ApiError(400, `No user with ${id} found`);
  }

  return result.rows[0];
}
