import Header from "@/components/Header";
import Layout from "@/components/Layout";
import SingleTask from "@/components/SingleTask";
import TaskCard from "@/components/TaskCard";
import { type RootState } from "@/store";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const { data: session } = useSession();

  const [openModal, setOpenModal] = useState(false);
  const [editTask, setEditTask] = useState<string | null>(null);

  return (
    <>
      <Header title="Your Tasks" />
      <Layout>
        {tasks?.length > 0 &&
        tasks.some(
          (t) => t.status !== "completed" && t.userId === session?.user.id,
        ) ? (
          <div className="relative flex h-full flex-col items-center">
            <div className="w-full max-w-3xl p-5">
              <h1 className="mb-4 text-center text-2xl font-bold">
                Your Tasks
              </h1>
              <ul className="space-y-3">
                {tasks
                  .filter(
                    (t) =>
                      t.userId === session?.user.id && t.status !== "completed",
                  )
                  .map((task) => (
                    <SingleTask
                      key={task.id}
                      task={task}
                      setEditTask={setEditTask}
                      setOpenModal={setOpenModal}
                    />
                  ))}
              </ul>

              <button
                className="absolute right-0 top-0 rounded-md bg-gray-800 px-3 py-1 text-sm text-white"
                onClick={() => setOpenModal(true)}
              >
                Create Task
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <h1 className="text-center text-lg">
              You don&apos;t have any tasks
            </h1>
            <button
              onClick={() => setOpenModal(true)}
              className="rounded-md bg-gray-800 px-3 py-1 text-sm text-white"
            >
              Create Task
            </button>
          </div>
        )}

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
