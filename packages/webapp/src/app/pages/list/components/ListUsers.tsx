import React, { useState } from "react";
import { IoMdTrash } from "react-icons/io";
import {
  ActionIcon,
  Avatar,
  Button,
  Divider,
  Grid,
  Group,
  Loader,
  Paper,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { ListPermission, ListUser } from "@taskify/shared-service-types";
import {
  useListUsersQuery,
  useRemoveListUserMutation,
  useUpdateListUserPermissionsMutation,
} from "~/feature/list";
import { randomColor } from "~/util";
import { InviteUserModal } from "./InviteUserModal";

interface Props {
  listId: string;
}

export const ListUsers = ({ listId }: Props) => {
  const [isAddingUser, setIsAddingUser] = useState(false);
  const { data: users = [] } = useListUsersQuery(listId);

  return (
    <>
      <Grid gutter={50}>
        <Grid.Col span={4}>
          <Stack>
            <Title order={2}>Users</Title>
            <Text>
              Invite more collaborators, configure their permissions and level
              up your collaboration!
            </Text>
            <Button w="max-content" onClick={() => setIsAddingUser(true)}>
              Invite collaborator
            </Button>
          </Stack>
        </Grid.Col>
        <Grid.Col span={8}>
          <Stack
            spacing={0}
            sx={(theme) => ({
              border: `1px solid ${theme.colors.dark[4]}`,
              borderRadius: theme.radius.sm,
            })}
          >
            {users.map((user, i) => (
              <React.Fragment key={user.id}>
                <UserItem user={user} listId={listId} />
                {i < users.length - 1 && <Divider color="dark.4" />}
              </React.Fragment>
            ))}
          </Stack>
        </Grid.Col>
      </Grid>
      <InviteUserModal
        listId={listId}
        open={isAddingUser}
        onClose={() => setIsAddingUser(false)}
      />
    </>
  );
};

const UserItem = ({ user, listId }: { user: ListUser; listId: string }) => {
  const { mutate: updateUserPermissions, isLoading } =
    useUpdateListUserPermissionsMutation();
  const { mutate: removeUser, isLoading: isRemovingUser } =
    useRemoveListUserMutation();

  const [first, last] = user.fullName.split(" ");
  const avatar = last
    ? `${first.charAt(0)}${last.charAt(0)}`
    : `${first.substring(0, 2)}`.toUpperCase();

  const handleChange = (value: string) => {
    const permissions: ListPermission[] =
      value === "editor" ? ["list:r", "list:w"] : ["list:r"];

    updateUserPermissions({
      listId,
      permissions,
      userId: user.id,
    });
  };

  const onRemoveClick = () => {
    removeUser({
      listId,
      userId: user.id,
    });
  };

  return (
    <Paper bg="dark.6" radius={0}>
      <Group p="lg" position="apart" align="center">
        <Group>
          <Avatar size="lg" radius="xl" bg={randomColor()}>
            {avatar}
          </Avatar>
          <Stack spacing={0}>
            <Text size="md" fw="bold" color="gray.3">
              {user.fullName}
            </Text>
            <Text size="sm" color="dimmed">
              {user.email}
            </Text>
          </Stack>
        </Group>
        <Group>
          <Select
            data={[
              { value: "editor", label: "Editor" },
              { value: "viewer", label: "Viewer" },
            ]}
            value={user.permissions.includes("list:w") ? "editor" : "viewer"}
            onChange={handleChange}
            rightSection={isLoading && <Loader size="sm" />}
          />
          <ActionIcon
            variant="subtle"
            size="md"
            onClick={onRemoveClick}
            disabled={isRemovingUser}
          >
            <IoMdTrash size={22} />
          </ActionIcon>
        </Group>
      </Group>
    </Paper>
  );
};
