import { MdList, MdDashboard } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { Group, Header, Title, useMantineTheme } from "@mantine/core";
import { routes } from "~/app/routes";

const items = [
  {
    label: "Dashboard",
    path: routes.dashboard.path,
    icon: (color: string) => <MdDashboard color={color} size={20} />,
  },
  {
    label: "Lists",
    path: routes.lists.path,
    icon: (color: string) => <MdList color={color} size={26} />,
  },
];

export const AppHeader = () => {
  const theme = useMantineTheme();
  const location = useLocation();

  const isItemActive = (path: string) => {
    if (path === "/") {
      return location.pathname === path;
    }

    return location.pathname.startsWith(path);
  };

  return (
    <Header px="xl" bg="dark.6" height={60}>
      <Group spacing="xl" h="100%">
        {items.map((item) => (
          <Link key={item.path} to={item.path}>
            <Group spacing="xs" align="center">
              {item.icon(
                isItemActive(item.path)
                  ? theme.colors.gray[3]
                  : theme.colors.gray[6]
              )}
              <Title
                order={5}
                weight={500}
                color={isItemActive(item.path) ? "gray.3" : "gray.6"}
              >
                {item.label}
              </Title>
            </Group>
          </Link>
        ))}
      </Group>
    </Header>
  );
};
