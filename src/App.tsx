import { useState } from "react";
import "./App.css";

interface Task {
  label: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState<string>("");
  function addTask() {
    setTasks((v) => [...v, { label: task }]);
    setTask("");
  }
  function removeTask(task: Task) {
    setTasks(($tasks) => $tasks.filter(($task) => $task.label !== task.label));
  }
  return (
    <>
      <h1>React Task Alert</h1>
      <div className="card">
        <div className="task-display">
          <ul>
            {tasks.map((task, i) => (
              <li key={i}>
                <div>{task.label}</div>
                <div>
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
