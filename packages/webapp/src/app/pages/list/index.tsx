import { useHistory, useParams } from "react-router";
import {
  ActionIcon,
  Box,
  Button,
  Center,
  Group,
  Stack,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import { IoChevronBack } from "react-icons/io5";
import { FullscreenLoader } from "~/components";
import { useListQuery, useUpdateListMutation } from "~/feature/list";
import { EditableContent } from "~/app/components";
import { TaskList, ListUsers } from "./components";

const ListPage = () => {
  const { listId } = useParams<{ listId: string }>();
  const history = useHistory();
  const { data: list, isLoading: isLoadingList } = useListQuery(listId);
  const { mutateAsync, isLoading: isUpdatingList } = useUpdateListMutation();

  if (isLoadingList) {
    return <FullscreenLoader />;
  }

  // TODO: Render an actually nice error message
  if (!list) {
    return <Title>Something went wrong with loading list</Title>;
  }

  const hasWritePermission = list.permissions.includes("list:w");

  return (
    <Stack w="100%" h="100%" my="xl">
      <Center>
        <Box w="65%">
          <Group mb={40}>
            <ActionIcon
              size="xl"
              radius="md"
              variant="subtle"
              onClick={history.goBack}
            >
              <IoChevronBack />
            </ActionIcon>
            <EditableContent
              initialValue={list.name}
              loading={isUpdatingList}
              as={Title}
              onSubmit={(name) => mutateAsync({ listId, name })}
            />
          </Group>

          <Tabs defaultValue="tasks">
            <Tabs.List mb={40}>
              <Tabs.Tab value="tasks">Tasks</Tabs.Tab>
              <Tabs.Tab value="users">Users</Tabs.Tab>
              <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="tasks">
              <TaskList
                listId={list.id}
                hasWritePermission={hasWritePermission}
                listMeta={list.meta}
              />
            </Tabs.Panel>
            <Tabs.Panel value="users">
              <ListUsers listId={list.id} />
            </Tabs.Panel>
            <Tabs.Panel value="notifications">
              <></>
            </Tabs.Panel>
          </Tabs>
        </Box>
      </Center>
    </Stack>
  );
};

export default ListPage;
