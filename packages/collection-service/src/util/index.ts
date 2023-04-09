import { ApiError, AuthorizationError, db } from "@taskify/backend-common";
import { ListPermission } from "@taskify/shared-service-types";
import SQL from "sql-template-strings";

export async function validateUserInvitedAndPermission(
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
      SELECT user_id as "userId", permissions, list_id from collection.list_user WHERE list_id = ${listId}
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
