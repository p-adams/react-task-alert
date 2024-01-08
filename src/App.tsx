import { useState } from "react";
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

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState<string>("");
  function addTask() {
    setTasks((v) => [...v, { id: nanoid(), label: task }]);
    setTask("");
  }
  function removeTask(task: Task) {
    setTasks(($tasks) => $tasks.filter(($task) => $task.id !== task.id));
  }
  function markAsComplete(task: Task) {
    setTasks(($tasks) =>
      $tasks.map(($task) =>
        $task.id === task.id ? { ...$task, completed: !$task.completed } : $task
      )
    );
  }
  return (
    <>
      <h1>React Task Alert</h1>
      <div className="card">
        <div className="task-operations">
          <button>modify all</button>
          <button>complete all</button>
          <button>delete all</button>
        </div>
        <div className="task-display">
          <ul>
            {tasks.map((task, i) => (
              <li key={i}>
                <div>
                  <input type="checkbox" />
                  <div
                    className={`task-label ${
                      task.completed ? "completed" : ""
                    }`}
                  >
                    {task.label}
                  </div>
                </div>
                <div>
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
