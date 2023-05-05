import React, { FormEvent, useEffect, useRef, useState } from "react";
import { MdClose, MdEdit } from "react-icons/md";
import {
  ActionIcon,
  Box,
  createStyles,
  Group,
  TextInput,
  Button,
  Loader,
  MantineSize,
  Text,
} from "@mantine/core";
import { PolymorphicComponentProps } from "~/types";

const useStyles = createStyles((theme) => ({
  group: {
    borderRadius: theme.radius.sm,
    padding: 6,
    "&:hover": {
      background: theme.colors.dark[5],
    },
  },
}));

type Props = {
  onSubmit?: (value: string) => Promise<unknown>;
  loading?: boolean;
  iconSize?: number;
  inputSize?: MantineSize;
  initialValue: string;
};

export function EditableContent<Element extends React.ElementType>({
  onSubmit,
  as,
  loading,
  initialValue = "",
  iconSize = 20,
  inputSize = "md",
  ...rest
}: PolymorphicComponentProps<Element, Props>) {
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [hovered, setHovered] = useState(false);
  const { classes } = useStyles();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (edit) {
      inputRef.current?.focus();
    }
  }, [edit]);

  const handleReset = () => {
    setValue(initialValue);
    setEdit(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(value)
      .then(() => setEdit(false))
      .catch((error: unknown) => {
        throw error;
      });
  };

  const handleContentClick = () => {
    setEdit(true);
    setHovered(false);
  };

  const Component = as || Text;

  return (
    <Box w="max-content">
      <form onSubmit={handleSubmit}>
        {edit ? (
          <TextInput
            ref={inputRef}
            size={inputSize}
            m={0}
            p={0}
            name="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={loading}
            rightSection={
              loading ? (
                <Loader size="xs" />
              ) : (
                <ActionIcon onClick={handleReset}>
                  <MdClose />
                </ActionIcon>
              )
            }
          />
        ) : (
          <Group
            spacing="xs"
            className={classes.group}
            onClick={handleContentClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Component {...rest}>{initialValue}</Component>
            {!edit && hovered && <MdEdit size={iconSize} />}
          </Group>
        )}
        {edit && <Button display="none" type="submit"></Button>}
      </form>
    </Box>
  );
}
