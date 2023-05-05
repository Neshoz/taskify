import { Button, Group, Modal, Radio, Stack, TextInput } from "@mantine/core";
import { ListPermission } from "@taskify/shared-service-types";
import { FormEvent, useState } from "react";
import { useAddUserToListMutation } from "~/feature/list";
import { UserSearchDropdown } from "./UserSearchDropdown";

interface Props {
  listId: string;
  open: boolean;
  onClose: () => void;
}

export const InviteUserModal = ({ listId, open, onClose }: Props) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const { mutateAsync } = useAddUserToListMutation(listId);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const permissions: ListPermission[] =
      role === "viewer" ? ["list:r"] : ["list:r", "list:w"];

    mutateAsync({
      email,
      permissions,
    }).then(onClose);
  };

  return (
    <Modal title="Invite Collaborators" opened={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <Stack>
          <UserSearchDropdown
            onSelect={(user) => setEmail(user.email)}
            label="Email Address"
          />

          <Radio.Group
            label="Role"
            labelProps={{ fw: "bold", pb: 6 }}
            value={role}
            onChange={setRole}
          >
            <Stack>
              <Radio
                value="editor"
                label="Editor"
                description="Editors can create new tasks, complete tasks and delete tasks. Editors can also invite new or remove collaborators from this list."
              />
              <Radio
                value="viewer"
                label="Viewer"
                description="Viewers will not be able to create, update or delete anything in the list. They can only view the list."
              />
            </Stack>
          </Radio.Group>
          <Group mt="xl" position="right">
            <Button variant="subtle" color="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Invite</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
