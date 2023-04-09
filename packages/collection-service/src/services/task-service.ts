import { db } from "@taskify/backend-common";
import { TaskBase } from "@taskify/shared-service-types";
import SQL from "sql-template-strings";
import { validateUserInvitedAndPermission } from "../util";

export async function getTasks(
  userId: string,
  listId: string,
  status: string | undefined
): Promise<TaskBase[]> {
  await validateUserInvitedAndPermission(userId, listId, "list:r");

  const query = SQL`SELECT * FROM collection.task WHERE list_id = ${listId}`;

  if (status) {
    const completed = parseInt(status, 10) === 1;
    query.append(`AND status = ${completed}`);
  }

  const result = await db.query<TaskBase>(query);

  return result.rows;
}
