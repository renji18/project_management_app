import { type Task } from "@/store/slices/taskSlice";
import { deleteTaskApi, updateTaskStatusApi } from "@/utils/taskUtils";
import { Edit, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";
import { useDispatch } from "react-redux";

const SingleTask = ({
  task,
  setEditTask,
  setOpenModal,
}: {
  task: Task;
  setEditTask?: (arg: string) => void;
  setOpenModal?: (arg: boolean) => void;
}) => {
  const dispatch = useDispatch();
  const { data: session } = useSession();

  const handleStatusChange = async (newStatus: Task["status"]) => {
    if (newStatus === task.status) return;
    await updateTaskStatusApi(dispatch, task.id, newStatus);
  };

  const owner = task?.members?.find((member) => member.type === "owner");
  const members = task?.members?.filter((member) => member.type === "member");

  return (
    <li className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-5 shadow-md transition hover:shadow-lg">
      {/* Task Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{task.title}</h2>
          <p className="text-gray-600">
            {task.description ?? "No description"}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Priority:{" "}
            <span
              className={`font-semibold ${
                task.priority === "high"
                  ? "text-red-500"
                  : task.priority === "medium"
                    ? "text-yellow-500"
                    : "text-green-500"
              }`}
            >
              {task.priority}
            </span>
          </p>

          {/* Status Update Dropdown */}
          <div className="mt-3 flex items-center gap-2">
            <p className="text-sm font-medium text-gray-700">Status:</p>
            {task.status === "completed" ? (
              <span className="rounded bg-green-100 px-2 py-1 text-sm font-medium text-green-700">
                Completed
              </span>
            ) : (
              <select
                className="rounded border border-gray-300 px-3 py-1 text-sm focus:border-blue-500 focus:outline-none"
                value={task.status}
                onChange={(e) =>
                  handleStatusChange(e.target.value as Task["status"])
                }
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            )}
          </div>

          {task.deadline && (
            <p className="mt-2 text-sm text-gray-500">
              Deadline:{" "}
              <span className="font-semibold text-blue-600">
                {new Date(task.deadline).toDateString()}
              </span>
            </p>
          )}
        </div>

        {/* Edit & Delete Buttons (Only for owner) */}
        {task.userId === session?.user.id && task.status !== "completed" && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setEditTask?.(task.id);
                setOpenModal?.(true);
              }}
              className="rounded bg-blue-500 p-2 text-white transition hover:bg-blue-600"
            >
              <Edit size={18} />
            </button>

            <button
              onClick={async () =>
                void (await deleteTaskApi(dispatch, task.id))
              }
              className="rounded bg-red-500 p-2 text-white transition hover:bg-red-600"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Owner and Members List */}
      {(owner ?? members) && (
        <div className="mt-3 rounded-md bg-gray-100 p-3 text-sm">
          {owner && (
            <p className="font-medium">
              <span className="text-gray-700">Owner:</span>{" "}
              <span className="font-semibold text-gray-900">
                {owner?.user?.name} ({owner?.user?.email})
              </span>
            </p>
          )}
          {members?.length > 0 && (
            <div className="mt-2">
              <p className="font-medium text-gray-700">Assigned Members:</p>
              <ul className="mt-1 list-disc pl-5 text-gray-900">
                {members?.map((member) => (
                  <li key={member.userId}>
                    {member.user.name} ({member.user.email})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export default SingleTask;
