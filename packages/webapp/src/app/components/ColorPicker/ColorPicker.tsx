import {
  ActionIcon,
  ColorInput,
  MantineColor,
  useMantineTheme,
} from "@mantine/core";
import { MdRefresh } from "react-icons/md";
import { randomColor } from "~/util";

interface Props {
  value: MantineColor;
  onChange: (value: string) => void;
}

export const ColorPicker = ({ value, onChange }: Props) => {
  const theme = useMantineTheme();

  const swatches = Object.keys(theme.colors).map((key) => theme.colors[key][6]);

  return (
    <ColorInput
      placeholder="Pick color"
      label="Your favorite color"
      value={value}
      swatches={swatches}
      onChange={onChange}
      rightSection={
        <ActionIcon onClick={() => onChange(randomColor())}>
          <MdRefresh size="1rem" />
        </ActionIcon>
      }
    />
  );
};
