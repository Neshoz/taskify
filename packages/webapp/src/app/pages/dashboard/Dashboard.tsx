import { Center, Title } from "@mantine/core";
import { useCurrentUserQuery } from "~/feature/user";

export const Dashboard = () => {
  const { data } = useCurrentUserQuery();

  return (
    <Center w="100%" h="100%">
      <Title>Welcome {data?.email}</Title>
    </Center>
  );
};
