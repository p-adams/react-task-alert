import { UITask } from "../App";

export function orderedTasks(tasks: UITask[]) {
  return tasks
    .filter((task) => task.reminder?.date !== null)
    .sort((a, b) => {
      const dateA = a?.reminder?.date ? a?.reminder?.date.getTime() : 0;
      const dateB = b?.reminder?.date ? b?.reminder?.date.getTime() : 0;
      return dateA - dateB;
    });
}
