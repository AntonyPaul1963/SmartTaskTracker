
import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskCard from "../components/TaskCard";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [priority, setPriority] = useState("");
  const [duplicateWarning, setDuplicateWarning] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:8000/tasks",{withCredentials: true});
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      await axios.post("http://localhost:8000/tasks", {
        title: newTask.title,
        description: newTask.description,
        category: newTask.category,
        },
        {
          withCredentials: true,
        }
      );
      setNewTask({ title: "", description: "", category: "" });
      setPriority("");
      setDuplicateWarning(false);
      fetchTasks();
    } catch (err) {
      console.error("Error adding task", err);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(tasks);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setTasks(reordered);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!newTask.title.trim()) {
        setPriority("");
        setDuplicateWarning(false);
        return;
      }

      // Fetch AI Priority
      axios
        .post("http://localhost:8000/ai/priority", null, {
          params: { title: newTask.title },
          withCredentials: true,
        })
        .then((res) => setPriority(res.data.priority))
        .catch((err) => console.error("Priority error", err));

      // Check for Duplicates
      axios
        .post("http://localhost:8000/ai/duplicate", null, {
          params: { title: newTask.title },
          withCredentials: true,
        })
        .then((res) => setDuplicateWarning(res.data.is_duplicate))
        .catch((err) => console.error("Duplicate check error", err));
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [newTask.title]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Task Dashboard</h2>

      {/* 🔹 Add Task Form */}
      <form onSubmit={handleAddTask} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) =>
            setNewTask({ ...newTask, title: e.target.value })
          }
          required
          style={{ padding: "8px", marginRight: "10px", width: "200px" }}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          style={{ padding: "8px", marginRight: "10px", width: "300px" }}
        />
        <input
          type="text"
          placeholder="Category (optional)"
          value={newTask.category}
          onChange={(e) =>
            setNewTask({ ...newTask, category: e.target.value })
          }
          style={{ padding: "8px", marginRight: "10px", width: "200px" }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>
          Add Task
        </button>

        {/* AI Features */}
        {priority && (
          <div style={{ marginTop: "10px", color: "green" }}>
            🔮 Suggested Priority: <strong>{priority}</strong>
          </div>
        )}
        {duplicateWarning && (
          <div style={{ marginTop: "5px", color: "red" }}>
            ⚠️ Duplicate task detected!
          </div>
        )}
      </form>
{/* 🔹 Drag-and-drop task list */}
      {tasks.length === 0 ? (
        <p style={{ color: "gray" }}>No tasks found. Add a task to get started.</p>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="task-list">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ minHeight: "200px" }}
              >
                {tasks.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={String(task.id)}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          marginBottom: "10px",
                        }}
                      >
                        <TaskCard task={task} onUpdate={fetchTasks} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}