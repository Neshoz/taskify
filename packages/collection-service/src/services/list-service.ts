import { ApiError, AuthorizationError, db } from "@taskify/backend-common";
import { ApiList, ListPermission } from "@taskify/shared-service-types";
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
  await validateUserInvitedAndPermission(userId, listId, "list:r");

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

  return result.rows[0];
}

export async function createList(
  userId: string,
  name: string
): Promise<ApiList> {
  try {
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

async function validateUserInvitedAndPermission(
  userId: string,
  listId: string,
  requiredPermission: ListPermission
) {
  const result = await db.query<{
    userId: string;
    listId: string;
    permissions: ListPermission;
  }>(
    SQL`
      SELECT user_id as "userId", permissions, list_id from collection.list_user where list_id = ${listId}
    `
  );

  if (result.rowCount === 0) {
    console.error(`List with id ${listId} not found`);
    throw new ApiError(400, `Not found`);
  }

  const invitedUsers = result.rows.map(({ userId }) => userId);

  if (!invitedUsers.includes(userId)) {
    throw new AuthorizationError("Insufficient permissions");
  }

  const { permissions } = result.rows[0];

  if (!permissions.includes(requiredPermission)) {
    throw new AuthorizationError("Insufficient permissions");
  }
}
