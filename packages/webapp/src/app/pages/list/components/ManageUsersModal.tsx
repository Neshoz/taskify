import React, { useEffect } from "react";
import { IoMdTrash } from "react-icons/io";
import { useListState } from "@mantine/hooks";
import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  Modal,
  Paper,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import {
  ApiUser,
  ListPermission,
  ListUser,
} from "@taskify/shared-service-types";
import {
  useInviteUsersToListMutation,
  useListUsersQuery,
} from "~/feature/list";
import { UserSearchDropdown } from "./UserSearchDropdown";

interface Props {
  open: boolean;
  onClose: () => void;
  listId: string;
}

export const ManageUsersModal = ({ open, onClose, listId }: Props) => {
  const [users, handlers] = useListState<ListUser>([]);
  const { data: initialListUsers } = useListUsersQuery(listId);
  const { mutateAsync, isLoading } = useInviteUsersToListMutation();

  useEffect(() => {
    if (initialListUsers) {
      handlers.setState(initialListUsers);
    }
  }, [initialListUsers]);

  const handleUserSelect = (user: ApiUser) => {
    handlers.append({ ...user, permissions: ["list:r"] });
  };

  const handleRemoveUser = (index: number) => () => {
    handlers.remove(index);
  };

  const handlePermissionsChange = (
    index: number,
    permissions: ListPermission[]
  ) => {
    handlers.setItemProp(index, "permissions", permissions);
  };

  const submitUsers = () => {
    const u = users.map(({ id, permissions }) => ({ userId: id, permissions }));
    mutateAsync({ listId, users: u });
  };

  return (
    <Modal
      size="lg"
      opened={open}
      onClose={onClose}
      title="Manage users"
      centered
    >
      <Stack spacing="lg">
        <UserSearchDropdown onSelect={handleUserSelect} />
        <Stack
          spacing={0}
          sx={(theme) => ({
            border: `1px solid ${theme.colors.dark[4]}`,
            borderRadius: theme.radius.xs,
          })}
        >
          {users.map((user, i) => (
            <React.Fragment key={user.id}>
              <UserItem
                user={user}
                onRemove={handleRemoveUser(i)}
                onChange={(permissions) =>
                  handlePermissionsChange(i, permissions)
                }
              />
              {i < users.length - 1 && <Divider color="dark.4" />}
            </React.Fragment>
          ))}
        </Stack>
        <Group>
          <Button variant="subtle" color="gray" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submitUsers} loading={isLoading}>
            Invite
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

const UserItem = ({
  user,
  onRemove,
  onChange,
}: {
  user: ListUser;
  onRemove: () => void;
  onChange: (permissions: ListPermission[]) => void;
}) => {
  const handleChange = (value: string) => {
    const permissions: ListPermission[] =
      value === "editor" ? ["list:r", "list:w"] : ["list:r"];

    onChange(permissions);
  };

  return (
    <Paper bg="dark.6">
      <Group p="lg" position="apart" align="center">
        <Box>
          <Text size="md" fw="bold" color="gray.3">
            {user.email}
          </Text>
          <Text size="md" color="dimmed">
            {user.fullName}
          </Text>
        </Box>
        <Group>
          <Select
            data={[
              { value: "editor", label: "Editor" },
              { value: "viewer", label: "Viewer" },
            ]}
            value={user.permissions.includes("list:w") ? "editor" : "viewer"}
            onChange={handleChange}
          />
          <ActionIcon variant="subtle" size="md" onClick={onRemove}>
            <IoMdTrash size={20} />
          </ActionIcon>
        </Group>
      </Group>
    </Paper>
  );
};
