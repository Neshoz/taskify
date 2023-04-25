import { ApiError, db } from "@taskify/backend-common";
import { ApiUser } from "@taskify/shared-service-types";
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

export async function getUsersByIds(ids: string[]): Promise<ApiUser[]> {
  const result = await db.query<ApiUser>({
    text: `
      SELECT
        id,
        email,
        full_name as "fullName",
        created,
        modified
      FROM
        account.user
      WHERE
        id
      IN (${ids.map((_, i) => `$${i + 1}`).join(",")})
    `,
    values: ids,
  });

  return result.rows;
}

export async function searchUsers(term: string): Promise<ApiUser[]> {
  term = `%${term}%`;
  const result = await db.query<ApiUser>(
    SQL`
      SELECT
        id,
        email,
        full_name as fullName,
        created,
        modified
      FROM
        account.user
      WHERE
        email ILIKE ${term}
      OR full_name ILIKE ${term}
    `
  );

  return result.rows;
}
