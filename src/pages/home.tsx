import Header from "@/components/Header";
import Layout from "@/components/Layout";
import SingleTask from "@/components/SingleTask";
import TaskCard from "@/components/TaskCard";
import { type RootState } from "@/store";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Plus } from "lucide-react";

export default function Home() {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const { data: session } = useSession();

  const [openModal, setOpenModal] = useState(false);
  const [editTask, setEditTask] = useState<string | null>(null);

  const userTasks = tasks?.filter(
    (task) => task.userId === session?.user.id && task.status !== "completed",
  );

  return (
    <>
      <Header title="Your Tasks" />
      <Layout>
        <div className="relative flex h-full flex-col items-center px-5">
          <div className="w-full max-w-3xl">
            <h1 className="mb-5 text-center text-2xl font-semibold text-gray-800">
              Your Tasks
            </h1>

            {userTasks?.length > 0 ? (
              <ul className="space-y-3">
                {userTasks.map((task) => (
                  <SingleTask
                    key={task.id}
                    task={task}
                    setEditTask={setEditTask}
                    setOpenModal={setOpenModal}
                  />
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 pt-10">
                <h2 className="text-center text-lg text-gray-600">
                  You don&apos;t have any tasks
                </h2>
                <button
                  onClick={() => setOpenModal(true)}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
                >
                  Create Task
                </button>
              </div>
            )}
          </div>

          {/* Floating Create Task Button */}
          <button
            className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm text-white shadow-lg transition hover:bg-blue-700"
            onClick={() => setOpenModal(true)}
          >
            <Plus size={16} />
            Create Task
          </button>
        </div>

        {/* Task Modal */}
        {openModal && (
          <TaskCard
            setOpenModal={setOpenModal}
            taskId={editTask ?? undefined}
          />
        )}
      </Layout>
    </>
  );
}
