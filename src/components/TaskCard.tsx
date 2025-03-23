import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTaskApi, updateTaskApi } from "@/utils/taskUtils";
import { toast } from "sonner";
import { type RootState } from "@/store";
import { X } from "lucide-react";

const TaskCard = ({
  setOpenModal,
  taskId,
}: {
  setOpenModal: (arg: boolean) => void;
  taskId?: string;
}) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "medium",
    deadline: "",
  });

  const [userEmails, setUserEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");

  const handleTaskData = async () => {
    if (!taskData.title) return toast.info("Task title is required!");

    const taskPayload = {
      title: taskData.title,
      description: taskData.description || "",
      priority: taskData.priority as "low" | "medium" | "high",
      deadline: taskData.deadline
        ? new Date(taskData.deadline).toISOString()
        : null,
      userEmails,
    };

    if (taskId) await updateTaskApi(dispatch, taskId, taskPayload);
    else await createTaskApi(dispatch, taskPayload);

    setTaskData({
      title: "",
      description: "",
      priority: "medium",
      deadline: "",
    });

    setUserEmails([]);

    setOpenModal(false);
  };

  const addUserEmail = () => {
    if (emailInput && !userEmails.includes(emailInput)) {
      setUserEmails([...userEmails, emailInput]);
      setEmailInput("");
    }
  };

  useEffect(() => {
    if (!tasks || !taskId) return;
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setTaskData({
        title: task.title,
        description: task.description ?? "",
        priority: task.priority,
        deadline: task.deadline ?? "",
      });
    }
  }, [taskId, tasks]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        {/* Modal Header */}
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          <h2 className="text-lg font-semibold text-gray-800">
            {taskId ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={() => setOpenModal(false)}
            className="rounded-full bg-gray-200 p-1.5 transition hover:bg-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Task Title */}
          <label className="block">
            <span className="text-sm font-medium text-gray-700">
              Task Title
            </span>
            <input
              type="text"
              placeholder="Enter task title"
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              value={taskData.title}
              onChange={(e) =>
                setTaskData({ ...taskData, title: e.target.value })
              }
            />
          </label>

          {/* Description */}
          <label className="block">
            <span className="text-sm font-medium text-gray-700">
              Description
            </span>
            <textarea
              placeholder="Enter task description"
              className="mt-1 w-full resize-none rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              rows={3}
              value={taskData.description}
              onChange={(e) =>
                setTaskData({ ...taskData, description: e.target.value })
              }
            />
          </label>

          {/* Priority */}
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Priority</span>
            <select
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              value={taskData.priority}
              onChange={(e) =>
                setTaskData({ ...taskData, priority: e.target.value })
              }
            >
              <option value="low">🟢 Low Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="high">🔴 High Priority</option>
            </select>
          </label>

          {/* Deadline */}
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Deadline</span>
            <input
              type="date"
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              value={taskData.deadline}
              onChange={(e) =>
                setTaskData({ ...taskData, deadline: e.target.value })
              }
            />
          </label>

          {/* User Emails Input */}
          <label className="block">
            <span className="text-sm font-medium text-gray-700">
              Assign Users
            </span>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="email"
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="Enter user email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
              <button
                onClick={addUserEmail}
                className="rounded bg-green-600 px-3 py-2 text-sm text-white transition hover:bg-green-700"
              >
                Add
              </button>
            </div>

            {/* Assigned Users */}
            {userEmails.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {userEmails.map((email) => (
                  <span
                    key={email}
                    className="rounded bg-gray-200 px-3 py-1 text-xs text-gray-700"
                  >
                    {email}
                  </span>
                ))}
              </div>
            )}
          </label>

          {/* Save Task Button */}
          <button
            onClick={handleTaskData}
            className="mt-4 w-full rounded bg-blue-700 py-2 text-white transition hover:bg-blue-800"
          >
            {taskId ? "Update Task" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
