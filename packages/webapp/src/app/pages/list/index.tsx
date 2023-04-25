import { ActionIcon, Container, Group, Stack, Title } from "@mantine/core";
import { IoChevronBack } from "react-icons/io5";
import { TbCircleCheckFilled, TbCircle } from "react-icons/tb";
import { useHistory, useParams } from "react-router";
import { FullscreenLoader } from "~/components";
import { useListQuery } from "~/feature/list";
import { useListTasksQuery } from "~/feature/task";
import { OverflowMenu, TaskItem } from "./components";

const ListPage = () => {
  const { listId } = useParams<{ listId: string }>();
  const history = useHistory();
  const { data: list, isLoading: isLoadingList } = useListQuery(listId);
  const { data: tasks, isLoading: isLoadingTasks } = useListTasksQuery(listId);

  if (isLoadingList || isLoadingTasks) {
    return <FullscreenLoader />;
  }

  // TODO: Render an actually nice error message
  if (!list) {
    return <Title>Something went wrong with loading list</Title>;
  }

  // TODO: Move this check to only the task list when util components are in place.
  if (!tasks) {
    return <Title>No tasks</Title>;
  }

  const hasWritePermission = list.permissions.includes("list:w");

  const notCompletedTasks = tasks.filter((task) => task.status === false);

  const completedTasks = tasks.filter((task) => task.status === true);

  return (
    <Stack w="100%" h="100%" my="xl">
      <Container w="40%">
        <Group mb={50} position="apart">
          <Group>
            <ActionIcon
              size="xl"
              radius="md"
              variant="light"
              onClick={history.goBack}
            >
              <IoChevronBack />
            </ActionIcon>
            <Title>{list.name}</Title>
          </Group>
          <OverflowMenu isAbleToCreateTask={hasWritePermission} />
        </Group>

        <Stack>
          <Title order={2} size="sm">
            Tasks - {notCompletedTasks.length}
          </Title>
          {notCompletedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              icon={TbCircle}
              color={list.meta.color}
              canEdit={hasWritePermission}
            />
          ))}
        </Stack>

        <Stack mt={32}>
          <Title order={2} size="sm">
            Completed - {completedTasks.length}
          </Title>
          {completedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              icon={TbCircleCheckFilled}
              color={list.meta.color}
              canEdit={hasWritePermission}
            />
          ))}
        </Stack>
      </Container>
    </Stack>
  );
};

export default ListPage;
