import { ChangeEvent, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import "./App.css";
import { orderedTasks } from "./utils/tasks";

interface Task {
  id: string;
  label: string;
  completed?: boolean;
  reminder?: {
    date: Date | null;
  };
}

export interface UITask extends Task {
  selected?: boolean;
}

function App() {
  const [tasks, setTasks] = useState<UITask[]>([]);
  const [tasksToModify, setTasksToModify] = useState<UITask[]>([]);
  const [task, setTask] = useState<string>("");
  const [showSelectActions, setShowSelectActions] = useState<boolean>(false);
  const [showModifyDialog, setShowModifyDialog] = useState<boolean>(false);
  const [currentReminder, setCurrentReminder] = useState<UITask | null>(null);

  useEffect(() => {
    const $iv = setInterval(() => {
      const $tasks = orderedTasks(tasks);
      for (const task of $tasks) {
        const timestamp = task.reminder?.date?.getTime() ?? 0;
        const currentTimestamp = new Date().getTime();
        // Check if the timestamps are within a small range (e.g., 1000 milliseconds)
        if (Math.abs(currentTimestamp - timestamp) < 1000) {
          setCurrentReminder(task);
          console.log("Current time is equal to the timestamp.");
          // Break out of the loop after finding a matching task
          break;
        }
      }
    }, 1000);
    return () => {
      clearInterval($iv);
    };
  }, [tasks]);

  function addTask() {
    setTasks((v) => [
      ...v,
      { id: nanoid(), label: task, selected: false, reminder: { date: null } },
    ]);
    setTask("");
  }

  function removeTask(task: UITask) {
    setTasks(($tasks) => $tasks.filter(($task) => $task.id !== task.id));
  }

  function markAsComplete(task: UITask) {
    setTasks(($tasks) =>
      $tasks.map(($task) =>
        $task.id === task.id ? { ...$task, completed: !$task.completed } : $task
      )
    );
  }

  function toggleSelectAll() {
    setTasks(($tasks) =>
      $tasks.map(($task) => ({ ...$task, selected: !$task.selected }))
    );
    setShowSelectActions(($v) => !$v);
  }

  function toggleSelectTask(task: UITask) {
    setTasks(($tasks) =>
      $tasks.map(($task) =>
        $task.id === task.id ? { ...$task, selected: !$task.selected } : $task
      )
    );
  }

  function enterModifyTaskMode() {
    setShowModifyDialog(true);
    setTasksToModify(tasks.filter(($task) => $task.selected));
  }

  function modifyTaskLabel(e: ChangeEvent<HTMLInputElement>, task: UITask) {
    const $task = { ...tasksToModify.find(($task) => $task.id === task.id) };
    $task.label = e.target.value;
    setTasksToModify(($tasks) =>
      $tasks.map(($t) => {
        return $t.id === $task.id ? { ...$t, ...$task } : $t;
      })
    );
  }

  function modifyTaskReminder(e: ChangeEvent<HTMLInputElement>, task: UITask) {
    const $task = { ...tasksToModify.find(($task) => $task.id === task.id) };
    $task.reminder = { date: new Date(e.target.value) };
    setTasksToModify(($tasks) =>
      $tasks.map(($t) => {
        return $t.id === $task.id ? { ...$t, ...$task } : $t;
      })
    );
  }

  function confirmModification() {
    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        const modifiedTask = tasksToModify.find((t) => t.id === task.id);
        return modifiedTask ? { ...task, ...modifiedTask } : task;
      })
    );
    setShowModifyDialog(false);
  }

  return (
    <>
      <h1>React Task Alert</h1>
      <div className="card">
        {!!currentReminder && (
          <div className="reminder">Time for: {currentReminder.label}</div>
        )}
        {showModifyDialog && (
          <dialog open={showModifyDialog}>
            {/* implement task modify dialog */}
            <ul>
              {tasksToModify.map((task) => (
                <li key={task.id}>
                  <div>
                    <input
                      name="label"
                      value={task.label}
                      onChange={(e) => modifyTaskLabel(e, task)}
                    />
                    <div>{task.label}</div>
                  </div>
                  <div>
                    <input
                      name="date"
                      type="datetime-local"
                      onChange={(e) => modifyTaskReminder(e, task)}
                    />
                    <div>{task.reminder?.date?.toLocaleString()}</div>
                  </div>
                </li>
              ))}
            </ul>

            <button onClick={() => setShowModifyDialog(false)}>cancel</button>
            <button onClick={() => confirmModification()}>confirm</button>
          </dialog>
        )}
        {showSelectActions && (
          <div className="task-operations">
            <button onClick={() => enterModifyTaskMode()}>modify all</button>
            <button>complete all</button>
            <button>delete all</button>
          </div>
        )}
        <div className="task-display">
          <ul>
            {tasks.length > 0 && (
              <label>
                Select all
                <input type="checkbox" onChange={() => toggleSelectAll()} />
              </label>
            )}
            {tasks.map((task, i) => (
              <li key={i} className="task-list-item">
                <div className="task-name">
                  <input
                    type="checkbox"
                    checked={task.selected}
                    onChange={() => toggleSelectTask(task)}
                  />
                  <div
                    className={`task-label ${
                      task.completed ? "completed" : ""
                    }`}
                  >
                    {task.label}
                  </div>
                </div>

                <div className="task-actions">
                  {task.reminder?.date && (
                    <div>{task.reminder.date.toLocaleString()}</div>
                  )}
                  {task.selected && (
                    <button onClick={() => enterModifyTaskMode()}>
                      modify
                    </button>
                  )}
                  <button onClick={() => markAsComplete(task)}>complete</button>
                  <button onClick={() => removeTask(task)}>remove</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="task-inputs">
          <label htmlFor="task-input">
            <input
              id="task-input"
              placeholder="Enter task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
          </label>
          <button onClick={() => addTask()}>add</button>
        </div>
      </div>
      <p className="read-the-docs"></p>
    </>
  );
}

export default App;
