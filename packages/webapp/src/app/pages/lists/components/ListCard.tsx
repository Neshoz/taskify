import * as Icons from "react-icons/fa";
import { TbUsers } from "react-icons/tb";
import {
  Badge,
  Box,
  Center,
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
      <Stack>
        <Group align="flex-start" position="apart">
          <ThemeIcon
            color={list.meta.color}
            variant="filled"
            size="xl"
            radius="md"
          >
            <Icon />
          </ThemeIcon>
          {list.users?.length && list.users.length > 1 && (
            <Badge
              color="gray"
              variant="filled"
              size="lg"
              rightSection={
                <Center>
                  <TbUsers size={14} />
                </Center>
              }
            >
              {list.users.length}
            </Badge>
          )}
        </Group>
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
    </Paper>
  );
};
