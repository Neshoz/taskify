import { db } from "@taskify/backend-common";
import {
  AddUsersToListInput,
  ApiList,
  CreateListInput,
  ListPermission,
} from "@taskify/shared-service-types";
import SQL from "sql-template-strings";
import { AddUserToListQuery } from "./types";

export async function getLists(userId: string): Promise<ApiList[]> {
  const result = await db.query<ApiList>(
    SQL`
      SELECT
        id,
        name,
        created,
        modified,
        to_json(clm)::jsonb - 'list_id' as meta
      FROM
        collection.list cl
      INNER JOIN collection.list_user clu ON cl.id = clu.list_id
      INNER JOIN collection.list_meta clm ON cl.id = clm.list_id
      WHERE
        clu.user_id = ${userId}
    `
  );

  return result.rows;
}

export async function getList(listId: string): Promise<ApiList> {
  const result = await db.query<ApiList>(
    SQL`
      SELECT
        id,
        name,
        created,
        modified,
        permissions,
        to_json(clm)::jsonb - 'list_id' as meta
      FROM
        collection.list cl
      INNER JOIN collection.list_user clu ON cl.id = clu.list_id
      INNER JOIN collection.list_meta clm ON cl.id = clm.list_id
      WHERE
        cl.id = ${listId}
    `
  );

  return result.rows[0];
}

export async function getListUsers(
  listId: string
): Promise<{ userId: string; permissions: ListPermission[] }[]> {
  const result = await db.query<{
    userId: string;
    permissions: ListPermission[];
  }>(
    SQL`
      SELECT
        user_id as "userId",
        permissions
      FROM
        collection.list_user
      WHERE
        list_id = ${listId}
    `
  );

  return result.rows;
}

type ListsUsersQuery = {
  listId: string;
  userIds: string[];
};

export async function getListsUsers(
  listIds: string[]
): Promise<ListsUsersQuery[]> {
  const result = await db.query<ListsUsersQuery>({
    text: `
      SELECT
        list_id as "listId",
        array_agg(user_id) as "userIds"
      FROM
        collection.list_user
      WHERE
        list_id
      IN
        (${listIds.map((_, i) => `$${i + 1}`).join(",")})
      GROUP BY list_id
    `,
    values: listIds,
  });

  return result.rows;
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

export async function updateList(listId: string, name: string) {
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

export async function deleteList(listId: string) {
  const result = await db.query(
    SQL`
      DELETE FROM collection.list WHERE id = ${listId}
    `
  );

  return result.rowCount;
}

export async function deleteUserFromList(
  listId: string,
  userId: string
): Promise<number> {
  const result = await db.query(
    SQL`DELETE FROM collection.list_user WHERE list_id = ${listId} AND user_id = ${userId}`
  );

  return result.rowCount;
}

export async function addUserToList(
  listId: string,
  payload: AddUserToListQuery
): Promise<AddUserToListQuery> {
  const { userId, permissions } = payload;

  const result = await db.query<AddUserToListQuery>(
    SQL`
      INSERT INTO
        collection.list_user (list_id, user_id, permissions)
      VALUES
        (${listId}, ${userId}, ${permissions})
      RETURNING user_id as "userId", permissions
    `
  );

  return result.rows[0];
}

export async function updateListUser(
  listId: string,
  userId: string,
  permissions: ListPermission[]
) {
  const result = await db.query(
    SQL`
      UPDATE
        collection.list_user
      SET
        permissions = ${permissions}
      WHERE
        list_id = ${listId} AND user_id = ${userId}
      RETURNING user_id as "userId", permissions
    `
  );

  return result.rows[0];
}
