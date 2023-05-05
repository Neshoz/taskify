import { IoMdTrash } from "react-icons/io";
import { TbCircleCheckFilled, TbCircle } from "react-icons/tb";
import {
  ActionIcon,
  createStyles,
  Group,
  Loader,
  Paper,
  Stack,
  Title,
} from "@mantine/core";
import { TaskBase } from "@taskify/shared-service-types";
import { useDeleteTaskMutation, useUpdateTaskMutation } from "~/feature/task";
import { some } from "~/util";

const useStyles = createStyles((theme, isDone: boolean) => ({
  root: {
    background: theme.colors.dark[6],
  },
  text: {
    textDecoration: isDone ? "line-through" : "none",
  },
  icon: {
    color: isDone ? theme.colors.teal[5] : theme.colors.blue[5],
  },
}));

interface Props {
  task: TaskBase;
  canEdit: boolean;
}

export const TaskItem = ({ task, canEdit }: Props) => {
  const { classes } = useStyles(task.status);
  const { mutate: updateTask, status: updateTaskStatus } =
    useUpdateTaskMutation();
  const { mutateAsync: deleteTask, status: deleteTaskStatus } =
    useDeleteTaskMutation(task.listId, task.id);

  const toggleTaskCompletion = () => {
    updateTask({
      listId: task.listId,
      taskId: task.id,
      status: !task.status,
    });
  };

  const handleDeleteTaskClick = () => {
    deleteTask();
  };

  const isLoading = some("loading", updateTaskStatus, deleteTaskStatus);
  const Icon = task.status ? TbCircleCheckFilled : TbCircle;

  return (
    <Paper p="md" radius="sm" className={classes.root}>
      <Group position="apart">
        <Group align={task.status ? "center" : "flex-start"}>
          <ActionIcon
            size="md"
            variant="subtle"
            onClick={toggleTaskCompletion}
            disabled={!canEdit}
          >
            <Icon size={24} className={classes.icon} />
          </ActionIcon>
          <Stack spacing={0}>
            <Title order={3} size="sm" className={classes.text}>
              {task.name}
            </Title>
            {!task.status && (
              <Title order={4} weight={500} size={12} color="dimmed">
                {task.description}
              </Title>
            )}
          </Stack>
        </Group>
        <Group>
          {canEdit && (
            <ActionIcon
              size="lg"
              variant="subtle"
              color="gray"
              onClick={handleDeleteTaskClick}
            >
              <IoMdTrash size={22} />
            </ActionIcon>
          )}
          {isLoading && <Loader size="sm" />}
        </Group>
      </Group>
    </Paper>
  );
};
