import { IoChevronDown } from "react-icons/io5";
import * as Icons from "react-icons/fa";
import { useState } from "react";
import {
  ActionIcon,
  Box,
  Group,
  Popover,
  Text,
  TextInput,
} from "@mantine/core";

interface Props {
  value: string;
  color?: string;
  onChange: (value: string) => void;
}

export const IconPicker = ({ value, onChange }: Props) => {
  const [search, setSearch] = useState("");

  const icons = Object.entries(Icons).filter(([name]) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  // @ts-ignore
  const ChosenIcon = Icons[value];

  return (
    <Popover width={240}>
      <Popover.Target>
        <Box w="max-content">
          <Text size="sm" weight={500} sx={{ pointerEvents: "none" }}>
            Choose icon
          </Text>
          <ActionIcon variant="filled" size="xl" radius="md" color="primary">
            {value ? <ChosenIcon /> : <IoChevronDown />}
          </ActionIcon>
        </Box>
      </Popover.Target>
      <Popover.Dropdown h={500} sx={{ overflow: "auto" }}>
        <TextInput
          placeholder="Search icon..."
          mb="md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Group sx={{ position: "absolute" }}>
          {icons.map(([name, Icon]) => (
            <ActionIcon
              key={name}
              variant="subtle"
              color="gray"
              size="md"
              onClick={() => onChange(name)}
            >
              <Icon size={22} />
            </ActionIcon>
          ))}
        </Group>
      </Popover.Dropdown>
    </Popover>
  );
};
