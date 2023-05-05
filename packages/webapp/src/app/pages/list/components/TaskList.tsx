import { Box, Button, Skeleton, Stack } from "@mantine/core";
import { ListMeta } from "@taskify/shared-service-types";
import { useState } from "react";
import { useListTasksQuery } from "~/feature/task";
import { CreateTaskModal } from "./CreateTaskModal";
import { TaskItem } from "./TaskItem";

interface Props {
  listId: string;
  listMeta: ListMeta;
  hasWritePermission: boolean;
}

export const TaskList = ({ listId, listMeta, hasWritePermission }: Props) => {
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const { data = [], isLoading } = useListTasksQuery(listId);

  if (isLoading) {
    return (
      <>
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} w="100%" p="md" />
        ))}
      </>
    );
  }

  return (
    <>
      <Stack>
        <Button w="max-content" onClick={() => setIsCreatingTask(true)}>
          Create task
        </Button>
        {data.map((task) => (
          <TaskItem key={task.id} task={task} canEdit={hasWritePermission} />
        ))}
      </Stack>
      <CreateTaskModal
        listId={listId}
        open={isCreatingTask}
        onClose={() => setIsCreatingTask(false)}
      />
    </>
  );
};
