import { Center, createStyles, Paper, SimpleGrid } from "@mantine/core";
import { Link } from "react-router-dom";
import { routes } from "~/app/routes";
import { FullscreenLoader } from "~/components";
import { useListsQuery } from "~/feature/list";

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
      color: "currentColor",
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
        <Paper key={list.id} className={classes.paper}>
          <Link to={routes.list.path(list.id)} className={classes.link}>
            <Center p="xl">{list.name}</Center>
          </Link>
        </Paper>
      ))}
    </SimpleGrid>
  );
};

export default ListsPage;
