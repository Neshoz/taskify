import { Center, Title } from "@mantine/core";
import { useCurrentUserQuery } from "~/feature/user";

const DashboardPage = () => {
  const { data } = useCurrentUserQuery();

  return (
    <Center w="100%" h="100%">
      <Title>Welcome {data?.email}</Title>
    </Center>
  );
};

export default DashboardPage;
