import { Text } from "@mantine/core";
import { useParams } from "react-router";
import { FullscreenLoader } from "~/components";
import { useListQuery } from "~/feature/list";

const ListPage = () => {
  const { listId } = useParams<{ listId: string }>();
  const { data, isLoading } = useListQuery(listId);

  if (isLoading) {
    return <FullscreenLoader />;
  }

  return <Text>{JSON.stringify(data)}</Text>;
};

export default ListPage;
