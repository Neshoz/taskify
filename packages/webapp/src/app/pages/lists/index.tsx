import {
  Center,
  createStyles,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Title,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { routes } from "~/app/routes";
import { FullscreenLoader } from "~/components";
import { useListsQuery } from "~/feature/list";
import { AccessBadge } from "./AccessBadge";

const useStyles = createStyles((theme) => ({
  paper: {
    background: theme.colors.dark[5],
    "&:hover": {
      background: theme.colors.dark[4],
      cursor: "pointer",
    },
  },
  link: {
    textDecoration: "none",
    "&:visited": {
      textDecoration: "none",
    },
  },
}));

const ListsPage = () => {
  const { data = [], isLoading } = useListsQuery();
  const { classes } = useStyles();

  if (isLoading) {
    return <FullscreenLoader />;
  }

  return (
    <SimpleGrid cols={4}>
      {data.map((list) => (
        <Paper p="sm" key={list.id} className={classes.paper}>
          <Link to={routes.list.path(list.id)} className={classes.link}>
            <Stack>
              <Group spacing="xs">
                {list.permissions.map((p) => (
                  <AccessBadge key={p} permission={p} />
                ))}
              </Group>
              <Center mb="md">
                <Title weight={500}>{list.name}</Title>
              </Center>
            </Stack>
          </Link>
        </Paper>
      ))}
    </SimpleGrid>
  );
};

export default ListsPage;
