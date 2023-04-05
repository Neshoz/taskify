import { Link, useLocation } from "react-router-dom";
import { MdChecklist } from "react-icons/md";
import { IoStatsChart } from "react-icons/io5";
import { ActionIcon, Navbar, Stack, Tooltip } from "@mantine/core";
import { routes } from "~/app/routes";

const items = [
  {
    label: "Dashboard",
    path: routes.dashboard.path,
    icon: <IoStatsChart size={22} />,
  },
  {
    label: "Lists",
    path: routes.lists.path,
    icon: <MdChecklist size={24} />,
  },
];

export const Sidebar = () => {
  const location = useLocation();

  const isItemActive = (path: string) => {
    if (path === "/") {
      return location.pathname === path;
    }

    return location.pathname.startsWith(path);
  };

  return (
    <Navbar sx={{ zIndex: "auto" }} height="100%" p="sm" width={{ base: 70 }}>
      <Navbar.Section grow>
        <Stack>
          {items.map((item) => (
            <Link key={item.path} to={item.path}>
              <Tooltip label={item.label} position="right" withArrow>
                <ActionIcon
                  color="primary"
                  size="xl"
                  variant={isItemActive(item.path) ? "light" : "subtle"}
                >
                  {item.icon}
                </ActionIcon>
              </Tooltip>
            </Link>
          ))}
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
};
