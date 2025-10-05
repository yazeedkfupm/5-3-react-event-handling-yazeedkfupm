import TaskApp from "./components/TaskApp";
import "./index.css";

export default function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">📝 Task Tracker</h1>
      </header>
      <main className="app__main">
        <TaskApp />
      </main>
    </div>
  );
}
