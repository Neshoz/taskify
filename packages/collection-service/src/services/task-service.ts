import { db } from "@taskify/backend-common";
import {
  CreateTaskInput,
  TaskBase,
  UpdateTaskInput,
} from "@taskify/shared-service-types";
import SQL from "sql-template-strings";
import { validateUserInvitedAndPermission } from "../util";

type TaskDao = Omit<TaskBase, "listId"> & {
  list_id: string;
};

export async function getTasks(
  userId: string,
  listId: string,
  status: boolean | undefined
): Promise<TaskDao[]> {
  await validateUserInvitedAndPermission(userId, listId, "list:r");

  const query = SQL`SELECT * FROM collection.task WHERE list_id = ${listId}`;

  if (status !== undefined) {
    query.append(SQL` AND status = ${status}`);
  }

  query.append(SQL`ORDER BY created ASC`);

  const result = await db.query<TaskDao>(query);

  return result.rows;
}

export async function createTask({
  listId,
  name,
  description,
  dueDate = null,
}: CreateTaskInput): Promise<TaskDao> {
  const result = await db.query<TaskDao>(
    SQL`
      INSERT INTO
        collection.task (list_id, name, description, due_date)
      VALUES
        (${listId}, ${name}, ${description}, ${dueDate})
      RETURNING *
    `
  );

  return result.rows[0];
}

export async function updateTask(
  taskId: string,
  { name, description, status, dueDate }: UpdateTaskInput
): Promise<TaskDao> {
  const query = SQL`UPDATE collection.task SET`;
  let hasValue = false;

  if (name !== undefined) {
    query.append(SQL` name = ${name}`);
    hasValue = true;
  }

  if (description !== undefined) {
    if (hasValue) {
      query.append(SQL`, description = ${description}`);
    } else {
      query.append(SQL` description = ${description}`);
    }
    hasValue = true;
  }

  if (status !== undefined) {
    if (hasValue) {
      query.append(SQL`, status = ${status}`);
    } else {
      query.append(SQL` status = ${status}`);
    }
    hasValue = true;
  }

  if (dueDate !== undefined) {
    if (hasValue) {
      query.append(SQL`, due_date = ${dueDate}`);
    } else {
      query.append(SQL` due_date = ${dueDate}`);
    }
  }

  query.append(SQL` WHERE id = ${taskId} RETURNING *`);

  const result = await db.query(query);

  return result.rows[0];
}

export async function deleteTask(taskId: string): Promise<number> {
  const result = await db.query(
    SQL`
      DELETE FROM collection.task WHERE id = ${taskId}
    `
  );

  return result.rowCount;
}
