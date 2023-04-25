import { useState } from "react";
import {
  createStyles,
  Group,
  Loader,
  Popover,
  Text,
  TextInput,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { ApiUser } from "@taskify/shared-service-types";
import { useSearchUsersQuery } from "~/feature/user";

const useStyles = createStyles((theme) => ({
  item: {
    padding: theme.spacing.xs,
    borderRadius: theme.radius.xs,
    "&:hover": {
      background: theme.colors.dark[4],
      cursor: "pointer",
    },
  },
}));

interface Props {
  onSelect: (user: ApiUser) => void;
}

export const UserSearchDropdown = ({ onSelect }: Props) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 200);
  const { data = [], isLoading } = useSearchUsersQuery(debouncedSearch);
  const { classes } = useStyles();

  const handleChange = (user: ApiUser) => {
    onSelect(user);
  };

  return (
    <Popover
      width="target"
      opened={open && data.length > 0}
      onChange={setOpen}
      withinPortal
    >
      <Popover.Target>
        <TextInput
          onFocus={() => setOpen(true)}
          label="Search users"
          placeholder="Email or name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          rightSection={isLoading && <Loader size="sm" />}
        />
      </Popover.Target>
      <Popover.Dropdown p={4}>
        {data.map((user) => (
          <Group
            key={user.id}
            className={classes.item}
            onClick={() => handleChange(user)}
          >
            <Text>{user.email}</Text>
          </Group>
        ))}
      </Popover.Dropdown>
    </Popover>
  );
};
