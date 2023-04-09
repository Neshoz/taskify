import { Center, Title, Button, Stack, Group } from "@mantine/core";
import { useCurrentUserQuery } from "~/feature/user";
import { useState } from "react";
import { useListsQuery } from "~/feature/list";
import { ListTasks } from "~/app/pages/dashboard/components/ListTasks";

const DashboardPage = () => {
  const { data } = useCurrentUserQuery();
  const [showStats, setShowStats] = useState(false);
  const { data: lists } = useListsQuery();

  return (
    <Center w="100%" h="100%">

      <Stack spacing="md">
        <Title>Welcome {data?.email}</Title>
        <Group>
          <Button variant="default" style={{ backgroundColor: !showStats ? "#414052" : "#1a1b1e"}} onClick={() => setShowStats(false)}>Daily Overview</Button>
          <Button variant="default" style={{backgroundColor: showStats ? "#414052" : "#1a1b1e"}} onClick={() => setShowStats(true)}>Statistics</Button>
        </Group>
        {!showStats && lists?.map((list) => (<ListTasks key={list.id} listId={list.id} />))}
      </Stack>
    </Center>
  );
};

export default DashboardPage;
