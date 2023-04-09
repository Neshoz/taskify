import { Center, Container, Grid, Group } from "@mantine/core";
import { FullscreenLoader } from "~/components";
import { useListsQuery } from "~/feature/list";
import { ListCard, CreateListButton } from "./components";

const ListsPage = () => {
  const { data = [], isLoading } = useListsQuery();

  if (isLoading) {
    return <FullscreenLoader />;
  }

  return (
    <Center w="100%" h="100%">
      <Container w="45%">
        <Group mb="xl" position="right">
          <CreateListButton />
        </Group>
        <Grid>
          {data.map((list) => (
            <Grid.Col key={list.id} span={4}>
              <ListCard list={list} />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </Center>
  );
};

export default ListsPage;
