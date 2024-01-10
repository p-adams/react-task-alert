import { ChangeEvent, useState } from "react";
import { nanoid } from "nanoid";
import "./App.css";

interface Task {
  id: string;
  label: string;
  completed?: boolean;
  reminder?: {
    date: Date;
  };
}

interface UITask extends Task {
  selected?: boolean;
}

function App() {
  const [tasks, setTasks] = useState<UITask[]>([]);
  const [tasksToModify, setTasksToModify] = useState<UITask[]>([]);
  const [task, setTask] = useState<string>("");
  const [showSelectActions, setShowSelectActions] = useState<boolean>(false);
  const [showModifyDialog, setShowModifyDialog] = useState<boolean>(false);

  function addTask() {
    setTasks((v) => [...v, { id: nanoid(), label: task, selected: false }]);
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
    // const _key = e.target.name;
    const $task = { ...tasksToModify.find(($task) => $task.id === task.id) };
    $task.label = e.target.value;
    setTasksToModify(($tasks) =>
      $tasks.map(($t) => {
        return $t.id === $task.id ? { ...$t, ...$task } : $t;
      })
    );
  }

  function confirmModification() {
    /* TODO merge tasks with modified tasks */
  }

  return (
    <>
      <h1>React Task Alert</h1>
      <div className="card">
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
                  </div>
                  <div>{task.label}</div>
                </li>
              ))}
            </ul>

            <button onClick={() => setShowModifyDialog(false)}>cancel</button>
            <button onClick={() => setShowModifyDialog(false)}>confirm</button>
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
                  <button onClick={() => markAsComplete(task)}>complete</button>
                  <button onClick={() => removeTask(task)}>remove</button>
                  {task.selected && (
                    <button onClick={() => enterModifyTaskMode()}>
                      modify
                    </button>
                  )}
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
