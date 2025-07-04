import React, { useState } from "react";
import axios from "axios";

export default function TaskCard({ task, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTask, setEditTask] = useState({
    title: task.title,
    description: task.description,
    category: task.category,
  });

  const toggleComplete = async () => {
    try {
      await axios.put(`http://localhost:8000/tasks/${task.id}`, {
        completed: !task.completed,
      });
      onUpdate();
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  const deleteTask = async () => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await axios.delete(`http://localhost:8000/tasks/${task.id}`);
      onUpdate();
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const saveEdits = async () => {
    try {
      await axios.put(`http://localhost:8000/tasks/${task.id}`, {
        title: editTask.title,
        description: editTask.description,
        category: editTask.category,
      });
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      console.error("Failed to save edits", err);
    }
  };

  return (
    <div className={`task-card ${task.completed ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={!!task.completed}
        onChange={toggleComplete}
        style={{ marginRight: "10px" }}
      />

      {isEditing ? (
        <div style={{ flexGrow: 1 }}>
          <input
            type="text"
            value={editTask.title}
            onChange={(e) =>
              setEditTask({ ...editTask, title: e.target.value })
            }
            style={{ width: "100%", marginBottom: "5px" }}
          />
          <input
            type="text"
            value={editTask.description}
            onChange={(e) =>
              setEditTask({ ...editTask, description: e.target.value })
            }
            style={{ width: "100%", marginBottom: "5px" }}
          />
          <input
            type="text"
            value={editTask.category}
            onChange={(e) =>
              setEditTask({ ...editTask, category: e.target.value })
            }
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <button onClick={saveEdits} style={{ marginRight: "5px" }}>
            Save
          </button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div style={{ flexGrow: 1 }}>
          <strong>{task.title}</strong>
          <p>{task.description}</p>
          <small>Category: {task.category}</small>
          <br />
          <button
            onClick={() => setIsEditing(true)}
            style={{ marginRight: "5px" }}
          >
            Edit
          </button>
          <button
            onClick={deleteTask}
            style={{ background: "#ffdddd", border: "1px solid red" }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
