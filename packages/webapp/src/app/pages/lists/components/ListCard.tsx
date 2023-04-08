import * as Icons from "react-icons/fa";
import {
  Box,
  createStyles,
  Group,
  Paper,
  Progress,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { ApiList } from "@taskify/shared-service-types";
import { Link } from "react-router-dom";
import { routes } from "~/app/routes";

const useStyles = createStyles((theme) => ({
  paper: {
    background: theme.colors.dark[5],
    "&:hover": {
      background: theme.colors.dark[6],
    },
  },
  title: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: theme.colors.gray[3],
  },
}));

interface Props {
  list: ApiList;
}

export const ListCard = ({ list }: Props) => {
  const { classes } = useStyles();
  // @ts-ignore
  const Icon = Icons[list.meta.icon];

  return (
    <Paper p="md" radius="lg" className={classes.paper}>
      <Link to={routes.list.path(list.id)}>
        <Stack>
          <ThemeIcon
            color={list.meta.color}
            variant="filled"
            size="xl"
            radius="md"
          >
            <Icon />
          </ThemeIcon>
          <Box w="100%">
            <Title mt="md" order={2} className={classes.title}>
              {list.name}
            </Title>
          </Box>
          <Group position="apart" align="center">
            <Text>x/y done</Text>
            <Progress value={50} color={list.meta.color} sx={{ flex: 1 }} />
          </Group>
        </Stack>
      </Link>
    </Paper>
  );
};
