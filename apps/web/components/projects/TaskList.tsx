"use client";

import { Task } from "../../types/task";

type TaskListProps = {
  tasks: Task[];
  onToggle: (id: number) => void;
};

export default function TaskList({
  tasks,
  onToggle,
}: TaskListProps) {
  if (tasks.length === 0) {
    return <p>No tasks yet.</p>;
  }

  return (
    <div>
      {tasks.map((task) => (
        <div
          key={task.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 0",
            borderBottom: "1px solid #e5e5e5",
          }}
        >
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
          />

          <span
            style={{
              textDecoration: task.completed
                ? "line-through"
                : "none",
            }}
          >
            {task.title}
          </span>
        </div>
      ))}
    </div>
  );
}