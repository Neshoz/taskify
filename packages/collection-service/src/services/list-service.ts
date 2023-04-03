import { db } from "@taskify/backend-common";
import SQL from "sql-template-strings";
import { ListDao } from "../types";

export async function getLists(userId: string): Promise<ListDao[]> {
  const result = await db.query<ListDao>(
    SQL`
      SELECT
        id,
        name,
        created,
        modified
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
): Promise<ListDao | undefined> {
  const result = await db.query<ListDao>(
    SQL`
      SELECT
        id,
        name,
        created,
        modified
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

export async function createList(list: any) {}

export async function updateList(name: any) {}

export async function deleteList(listId: string) {}
