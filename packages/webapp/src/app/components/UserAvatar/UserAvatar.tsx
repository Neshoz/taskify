import { Avatar, Center, Skeleton } from "@mantine/core";
import { useCurrentUserQuery } from "~/feature/user";

export const UserAvatar = () => {
  const { data, isLoading } = useCurrentUserQuery();

  if (isLoading) {
    return <Skeleton w={40} h={40} radius="lg" />;
  }

  const [first, last] = data?.fullName?.split(" ") ?? [];

  return (
    <Avatar>
      {first}
      {last}
    </Avatar>
  );
};
