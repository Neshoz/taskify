import { useState } from "react";
import { useParams } from "react-router";
import { TbDots } from "react-icons/tb";
import { RiUserAddLine } from "react-icons/ri";
import { MdAddTask } from "react-icons/md";
import { IoMdTrash } from "react-icons/io";
import { ActionIcon, Menu } from "@mantine/core";
import { CreateTaskModal } from "./CreateTaskModal";
import { ManageUsersModal } from "./ManageUsersModal";

interface Props {
  isAbleToCreateTask: boolean;
}

export const OverflowMenu = ({ isAbleToCreateTask }: Props) => {
  const { listId } = useParams<{ listId: string }>();
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isManagingUsers, setIsManagingUsers] = useState(false);

  return (
    <>
      <Menu withArrow>
        <Menu.Target>
          <ActionIcon
            size="xl"
            radius="md"
            variant="subtle"
            disabled={!isAbleToCreateTask}
          >
            <TbDots size={18} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            icon={<MdAddTask size={18} />}
            onClick={() => setIsCreatingTask(true)}
          >
            Create task
          </Menu.Item>
          <Menu.Item
            icon={<RiUserAddLine size={18} />}
            onClick={() => setIsManagingUsers(true)}
          >
            Manage users
          </Menu.Item>
          <Menu.Item color="red.5" icon={<IoMdTrash size={18} />}>
            Delete list
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <CreateTaskModal
        listId={listId}
        open={isCreatingTask}
        onClose={() => setIsCreatingTask(false)}
      />
      <ManageUsersModal
        listId={listId}
        open={isManagingUsers}
        onClose={() => setIsManagingUsers(false)}
      />
    </>
  );
};
