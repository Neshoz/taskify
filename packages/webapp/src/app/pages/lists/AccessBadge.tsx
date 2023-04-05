import { Badge, MantineColor } from "@mantine/core";
import { ListPermission } from "@taskify/shared-service-types";

const badgeByPermission: Record<
  ListPermission,
  { label: string; color: MantineColor }
> = {
  "list:r": {
    label: "View",
    color: "blue",
  },
  "list:w": {
    label: "Create",
    color: "teal",
  },
};

interface Props {
  permission: ListPermission;
}

export const AccessBadge = ({ permission }: Props) => {
  const badge = badgeByPermission[permission];

  return (
    <Badge w={90} size="lg" color={badge.color}>
      {badge.label}
    </Badge>
  );
};
