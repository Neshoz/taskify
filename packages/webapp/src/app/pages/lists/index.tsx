import { Center, Container, Grid } from "@mantine/core";
import { Link } from "react-router-dom";
import { routes } from "~/app/routes";
import { FullscreenLoader } from "~/components";
import { useListsQuery } from "~/feature/list";
import { ListCard } from "./components";

const ListsPage = () => {
  const { data = [], isLoading } = useListsQuery();

  if (isLoading) {
    return <FullscreenLoader />;
  }

  return (
    <Center w="100%" h="100%">
      <Container w="45%">
        <Grid>
          {data.map((list) => (
            <Grid.Col key={list.id} span={4}>
              <Link to={routes.list.path(list.id)}>
                <ListCard list={list} />
              </Link>
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </Center>
  );
};

export default ListsPage;
