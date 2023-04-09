import { FormEvent, useState } from "react";
import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { ColorPicker, IconPicker } from "~/app/components";
import { randomColor } from "~/util";
import { useCreateListMutation } from "~/feature/list";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CreateListModal = ({ open, onClose }: Props) => {
  const [icon, setIcon] = useState("");
  const [name, setName] = useState("");
  const [color, setColor] = useState(randomColor());
  const { mutateAsync: createList, isLoading } = useCreateListMutation();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createList({ name, meta: { color, icon } }).then(() => onClose());
  };

  return (
    <Modal opened={open} onClose={onClose} title="Create new list" centered>
      <form onSubmit={handleSubmit}>
        <Stack>
          <IconPicker color={color} value={icon} onChange={setIcon} />
          <ColorPicker value={color} onChange={setColor} />
          <TextInput
            label="List name"
            name="name"
            value={name}
            placeholder="My new list"
            required
            onChange={(e) => setName(e.target.value)}
          />
          <Group mt="lg">
            <Button variant="subtle" color="red" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="filled"
              type="submit"
              disabled={!name || !icon}
              loading={isLoading}
            >
              Create list
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
