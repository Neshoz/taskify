import { ApiError, db } from "@taskify/backend-common";
import { ApiList } from "@taskify/shared-service-types";
import SQL from "sql-template-strings";

export async function getLists(userId: string): Promise<ApiList[]> {
  const result = await db.query<ApiList>(
    SQL`
      SELECT
        id,
        name,
        created,
        modified,
        permissions
      FROM
        collection.list cl
      INNER JOIN
        collection.list_user clu
      ON
        cl.id = clu.list_id
      WHERE
        clu.user_id = ${userId}
    `
  );
  return result.rows;
}

export async function getList(
  userId: string,
  listId: string
): Promise<ApiList> {
  const result = await db.query<ApiList>(
    SQL`
      SELECT
        id,
        name,
        created,
        modified,
        permissions
      FROM
        collection.list cl
      INNER JOIN
        collection.list_user clu
      ON
        cl.id = clu.list_id
      WHERE
        clu.user_id = ${userId} AND cl.id = ${listId}
    `
  );

  const list = result.rows[0];

  if (!list) {
    throw new ApiError(400, `No list with id ${listId} found`);
  }

  return list;
}

export async function createList(list: any) {}

export async function updateList(name: any) {}

export async function deleteList(listId: string) {}
