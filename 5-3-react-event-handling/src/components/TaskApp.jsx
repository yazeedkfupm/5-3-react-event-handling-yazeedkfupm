import React, { useState } from "react";
import TaskList from "./TaskList";

export default function TaskApp() {
   const [text, setText] = useState("");
   const [tasks, setTasks] = useState([]);
  const handleSubmit = () => {
       const value = text.trim();
    if (!value) return;

    setTasks([...tasks, { id: Date.now(), text: value }]);
    setText("");
  };

  
  const handleDelete = (id) => {
    // TODO: filter tasks by id to remove the clicked one
    setTasks(tasks.filter((task) => task.id !== id));
  };

  
  const handleClearAll = () => {
    // TODO: set tasks to empty array
     setTasks([]);
  };

  return (
    <section className="card">
      {/*Controlled Input */}
      <div className="inputRow">
        <input
          type="text"
          placeholder="Type a task..."
          className="input"
          // TODO: value={text}
          value={text}
          // TODO: onChange={(e) => setText(e.target.value)}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
        />
        <button className="btn btn--primary" onClick={handleSubmit}>
          Submit
        </button>
        <p>{text}</p>
      </div>

      {/*Render Task List and Enable Delete */}
      {/*Pass tasks and onDelete */}
      <TaskList  tasks={tasks} onDelete={handleDelete} />

      {/*Clear All */}
      <div className="footerRow">
        <button className="btn btn--ghost" onClick={handleClearAll}>
          Clear All
        </button>
      </div>
    </section>
  );
}
