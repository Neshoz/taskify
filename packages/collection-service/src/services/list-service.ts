import { db } from "@taskify/backend-common";
import { ApiList, CreateListInput } from "@taskify/shared-service-types";
import SQL from "sql-template-strings";
import { validateUserInvitedAndPermission } from "../util";

export async function getLists(userId: string): Promise<ApiList[]> {
  const result = await db.query<ApiList>(
    SQL`
      SELECT
        id,
        name,
        created,
        modified,
        permissions,
        to_json(clm.*) as meta
      FROM
        collection.list cl
      INNER JOIN collection.list_user clu ON cl.id = clu.list_id
      LEFT JOIN collection.list_meta clm ON cl.id = clm.list_id
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
  await validateUserInvitedAndPermission(userId, listId, "list:r");

  const result = await db.query<ApiList>(
    SQL`
      SELECT
        id,
        name,
        created,
        modified,
        permissions,
        to_json(clm.*) as meta
      FROM
        collection.list cl
      INNER JOIN collection.list_user clu ON cl.id = clu.list_id
      INNER JOIN collection.list_meta clm ON cl.id = clm.list_id
      WHERE
        clu.user_id = ${userId} AND cl.id = ${listId}
    `
  );

  return result.rows[0];
}

export async function createList(
  userId: string,
  input: CreateListInput
): Promise<ApiList> {
  try {
    const { name, meta } = input;
    await db.query(SQL`BEGIN`);

    const result = await db.query<ApiList>(
      SQL`
        INSERT INTO
          collection.list (name)
        VALUES
          (${name})
        RETURNING *;
      `
    );

    const list = result.rows[0];

    await db.query(
      SQL`
        INSERT INTO
          collection.list_meta (list_id, icon, color)
        VALUES
          (${list.id}, ${meta.icon}, ${meta.color})
      `
    );

    await db.query(
      SQL`
        INSERT INTO
          collection.list_user (list_id, user_id, permissions)
        VALUES
          (${list.id}, ${userId}, ARRAY['list:r', 'list:w'])
      `
    );

    await db.query(SQL`COMMIT`);

    return list;
  } catch (error) {
    await db.query(SQL`ROLLBACK`);
    console.error(error);
    throw error;
  }
}

export async function updateList(userId: string, listId: string, name: any) {
  await validateUserInvitedAndPermission(userId, listId, "list:w");

  const result = await db.query<ApiList>(
    SQL`
      UPDATE collection.list SET
        name = ${name}
      WHERE
        id = ${listId}
      RETURNING *
    `
  );

  return result.rows[0];
}

export async function deleteList(userId: string, listId: string) {
  await validateUserInvitedAndPermission(userId, listId, "list:w");

  const result = await db.query(
    SQL`
      DELETE FROM collection.list WHERE id = ${listId}
    `
  );

  return result.rowCount;
}
