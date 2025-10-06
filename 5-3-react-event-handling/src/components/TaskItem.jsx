import React from "react";

export default function TaskItem({ id, text, onDelete }) {
  return (
    <li className="item">
      {/* Task 2 – Display Task Text */}
      <span className="item__text">{text}</span>

      {/* Task 3 – Delete Button */}
      <div className="item__actions">
        <button
          className="iconBtn iconBtn--danger"
          aria-label="Delete task"
          title="Delete"
          // TODO: onClick={() => onDelete(id)}
          onClick={() => onDelete(id)}
        >
          🗑️
        </button>
      </div>
    </li>
  );
}
