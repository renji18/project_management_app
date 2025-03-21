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

  // Find the owner from the taskMembers array
  const owner = task?.members?.find((member) => member.type === "owner");
  const members = task?.members?.filter((member) => member.type === "member");

  return (
    <li className="flex flex-col rounded border bg-white p-4 shadow-sm">
      {/* Task Details */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">{task.title}</h2>
          <p className="text-gray-600">
            {task.description ?? "No description"}
          </p>
          <p className="text-sm text-gray-500">
            Priority: <span className="font-semibold">{task.priority}</span>
          </p>

          {/* Status Update Dropdown */}
          <div className="mt-2 flex items-center gap-2">
            <p className="text-sm text-gray-500">Status:</p>
            {task.status === "completed" ? (
              <p className="font-semibold">Completed</p>
            ) : (
              <select
                className="rounded border px-2 py-1 text-sm"
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
            <p className="text-sm text-gray-500">
              Deadline:{" "}
              <span className="font-semibold">
                {new Date(task.deadline).toDateString()}
              </span>
            </p>
          )}
        </div>

        {/* Edit & Delete Buttons (Only for owner) */}
        {task.userId === session?.user.id && task.status !== "completed" && (
          <div className="flex gap-3">
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
        <div className="mt-4 rounded-md bg-gray-100 p-2 text-sm">
          {owner && (
            <p className="font-semibold">
              Owner: {owner?.user?.name} ({owner?.user?.email})
            </p>
          )}
          {members?.length > 0 && (
            <div className="mt-2">
              <p className="font-semibold">Assigned Members:</p>
              <ul className="list-disc pl-5">
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
