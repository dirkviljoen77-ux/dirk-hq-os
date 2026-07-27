"use client";

import { useState } from "react";

import { useProject } from "../store/ProjectContext";
import {
  addTask,
  completeTask,
  deleteTask,
} from "../store/actions/ProjectActions";

type Props = {
  projectName: string;
};

export default function TasksPanel({
  projectName,
}: Props) {
  const { project, setProject } = useProject();

  const [newTask, setNewTask] = useState("");

  return (
    <>
      <h2 style={{ marginTop: 0 }}>Tasks</h2>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <input
          value={newTask}
          onChange={(e) =>
            setNewTask(e.target.value)
          }
          placeholder={`New task for ${projectName}`}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #475569",
            background: "#0F172A",
            color: "white",
          }}
        />

        <button
          onClick={() => {
            if (!newTask.trim()) return;

            setProject((prev) =>
              addTask(prev, newTask)
            );

            setNewTask("");
          }}
          style={{
            padding: "10px 18px",
            border: "none",
            borderRadius: 8,
            background: "#2563EB",
            color: "white",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>

      {project.tasks.map((task) => (
        <div
          key={task.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 12,
            borderBottom:
              "1px solid #334155",
          }}
        >
          <div>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() =>
                setProject((prev) =>
                  completeTask(prev, task.id)
                )
              }
            />

            <span
              style={{
                marginLeft: 10,
                textDecoration:
                  task.completed
                    ? "line-through"
                    : "none",
              }}
            >
              {task.title}
            </span>
          </div>

          <button
            onClick={() =>
              setProject((prev) =>
                deleteTask(prev, task.id)
              )
            }
            style={{
              border: "none",
              background: "transparent",
              color: "#EF4444",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </>
  );
}