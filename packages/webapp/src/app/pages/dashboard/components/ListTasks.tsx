import { useListTasksQuery } from "~/feature/task";


type ListTasksProps = {
  listId: string;
};
export const ListTasks = ({ listId }: ListTasksProps) => {
  const { data: tasks } = useListTasksQuery(listId);

  return <div>
    {tasks?.map(task => <div key={task.id}>{task.name}</div>)}
  </div>
}
