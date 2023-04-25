import { useState } from "react";
import {
  Button,
  Checkbox,
  Group,
  Modal,
  Stack,
  TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { CreateTaskInput } from "@taskify/shared-service-types";
import { useCreateTaskMutation } from "~/feature/task";

interface Props {
  open: boolean;
  onClose: () => void;
  listId: string;
}

type FormValues = Omit<CreateTaskInput, "listId">;

export const CreateTaskModal = ({ open, onClose, listId }: Props) => {
  const [createAnother, setCreateAnother] = useState(false);
  const { mutateAsync: createTask, isLoading } = useCreateTaskMutation();

  const form = useForm<FormValues>({
    initialValues: {
      name: "",
      description: "",
      dueDate: "",
    },
  });

  const handleSubmit = (values: FormValues) => {
    createTask({
      listId,
      ...values,
    }).then(() => {
      if (!createAnother) {
        form.reset();
        onClose();
      } else {
        form.reset();
      }
    });
  };

  const { name, description, dueDate } = form.values;

  return (
    <Modal opened={open} onClose={onClose} title="Create new task" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Task name"
            name="name"
            placeholder="My new task"
            required
            disabled={isLoading}
            {...form.getInputProps("name")}
          />
          <TextInput
            label="Task description"
            name="description"
            placeholder="This task should..."
            required
            disabled={isLoading}
            {...form.getInputProps("description")}
          />
          <DatePickerInput
            size="sm"
            label="Due date"
            placeholder="Task due date"
            value={dueDate ? new Date(dueDate) : null}
            disabled={isLoading}
            clearable
            popoverProps={{ withinPortal: true }}
            onChange={(val) =>
              form.setFieldValue("dueDate", val?.toISOString())
            }
          />
          <Checkbox
            mt="lg"
            checked={createAnother}
            label="Create another"
            onChange={(e) => setCreateAnother(e.target.checked)}
          />
          <Group>
            <Button variant="subtle" color="red" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="filled"
              type="submit"
              disabled={!name || !description}
              loading={isLoading}
            >
              Create task
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
