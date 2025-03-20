import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createTaskApi } from "@/utils/taskUtils";
import { toast } from "sonner";

const CreateNewTask = () => {
  const dispatch = useDispatch();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "medium",
    deadline: "",
  });

  const handleCreateTask = async () => {
    if (!taskData.title) return toast.info("Task title is required!");

    await createTaskApi(dispatch, {
      title: taskData.title,
      description: taskData.description || "",
      priority: taskData.priority as "low" | "medium" | "high",
      deadline: taskData.deadline
        ? new Date(taskData.deadline).toISOString()
        : null,
    });

    setTaskData({
      title: "",
      description: "",
      priority: "medium",
      deadline: "",
    });
  };

  return (
    <div className="rounded border bg-white p-5 shadow-md">
      <h2 className="mb-3 text-lg font-bold">Create New Task</h2>

      <input
        type="text"
        placeholder="Task Title"
        className="mb-2 w-full border p-2"
        value={taskData.title}
        onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Description"
        className="mb-2 w-full border p-2"
        value={taskData.description}
        onChange={(e) =>
          setTaskData({ ...taskData, description: e.target.value })
        }
      />
      <select
        className="mb-2 w-full border p-2"
        value={taskData.priority}
        onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
      >
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>
      <input
        type="date"
        className="mb-3 w-full border p-2"
        value={taskData.deadline}
        onChange={(e) => setTaskData({ ...taskData, deadline: e.target.value })}
      />

      <button
        onClick={handleCreateTask}
        className="w-full rounded bg-blue-700 py-2 text-white transition hover:bg-blue-800"
      >
        Create Task
      </button>
    </div>
  );
};

export default CreateNewTask;
