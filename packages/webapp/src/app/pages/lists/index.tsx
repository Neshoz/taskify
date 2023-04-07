import { Link } from "react-router-dom";
import {
  Box,
  Center,
  Container,
  createStyles,
  Grid,
  Group,
  MantineColor,
  Paper,
  Progress,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { FaBuilding, FaUser, FaShoppingCart, FaChild } from "react-icons/fa";
import { routes } from "~/app/routes";
import { FullscreenLoader } from "~/components";
import { useListsQuery } from "~/feature/list";
import { IconType } from "react-icons";

const useStyles = createStyles((theme) => ({
  paper: {
    background: theme.colors.dark[5],
    "&:hover": {
      background: theme.colors.dark[4],
      cursor: "pointer",
    },
  },
  link: {
    textDecoration: "inherit",
    color: "inherit",
  },
  title: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: theme.colors.gray[3],
  },
}));

const mockListMetaByIndex: Array<{ icon: IconType; color: MantineColor }> = [
  { icon: FaBuilding, color: "blue" },
  { icon: FaUser, color: "cyan" },
  { icon: FaShoppingCart, color: "yellow" },
  { icon: FaChild, color: "grape" },
];

const ListsPage = () => {
  const { data = [], isLoading } = useListsQuery();
  const { classes } = useStyles();

  if (isLoading) {
    return <FullscreenLoader />;
  }

  return (
    <Center w="100%" h="100%">
      <Container w="45%">
        <Grid>
          {data.map((list, index) => {
            const { color, icon: Icon } = mockListMetaByIndex[index];
            return (
              <Grid.Col key={list.id} span={4}>
                <Paper p="md" radius="lg" className={classes.paper}>
                  <Link to={routes.list.path(list.id)} className={classes.link}>
                    <Stack>
                      <ThemeIcon
                        color={color}
                        variant="filled"
                        size="xl"
                        radius="md"
                      >
                        <Icon />
                      </ThemeIcon>
                      <Box w="100%">
                        <Title
                          color="gray.3"
                          mt="md"
                          order={2}
                          className={classes.title}
                        >
                          {list.name}
                        </Title>
                      </Box>
                      <Group position="apart">
                        <Text sx={{ flex: 1 }}>4/8 done</Text>
                        <Progress value={50} color={color} sx={{ flex: 1 }} />
                      </Group>
                    </Stack>
                  </Link>
                </Paper>
              </Grid.Col>
            );
          })}
        </Grid>
      </Container>
    </Center>
  );
};

export default ListsPage;
