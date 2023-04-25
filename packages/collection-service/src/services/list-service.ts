import { db } from "@taskify/backend-common";
import {
  AddUsersToListInput,
  ApiList,
  CreateListInput,
  ListPermission,
} from "@taskify/shared-service-types";
import SQL from "sql-template-strings";

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
      SELECT user_id as "userId", permissions FROM collection.list_user WHERE list_id = ${listId}
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

export async function updateListUsers(
  userId: string,
  listId: string,
  users: AddUsersToListInput[]
): Promise<AddUsersToListInput[]> {
  try {
    await db.query(SQL`BEGIN`);
    const insertQuery = SQL``;

    if (users.length) {
      insertQuery.append(SQL`
        INSERT INTO
          collection.list_user (list_id, user_id, permissions)
        VALUES
      `);

      users.forEach(({ userId, permissions }, i) => {
        insertQuery.append(SQL` (${listId}, ${userId}, ${permissions})`);

        if (i++ !== users.length - 1) {
          insertQuery.append(SQL`,`);
        }
      });

      insertQuery.append(
        SQL` ON CONFLICT (list_id, user_id) DO UPDATE SET permissions = excluded.permissions`
      );

      insertQuery.append(SQL` RETURNING (user_id, permissions)`);
    }

    const result = await db.query(insertQuery);

    let delQuery = `
      DELETE FROM
        collection.list_user 
    `;

    if (users.length) {
      const ids = users.map((_, i) => `$${i + 1}`).join(",");
      delQuery += `
          WHERE
            user_id
          NOT IN
            (${ids})
          AND
            user_id != $${users.length + 1}
        `;
    } else {
      delQuery += ` WHERE user_id != $1`;
      delQuery;
    }

    await db.query({
      text: delQuery,
      values: [...users.map(({ userId }) => userId), userId],
    });

    await db.query(SQL`COMMIT`);

    return result.rows;
  } catch (error) {
    await db.query(SQL`ROLLBACK`);
    console.error(error);
    throw error;
  }
}
