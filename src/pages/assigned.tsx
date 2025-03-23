import Header from "@/components/Header";
import Layout from "@/components/Layout";
import SingleTask from "@/components/SingleTask";
import { type RootState } from "@/store";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import React from "react";

const Assigned = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const { data: session } = useSession();

  const assignedTasks = tasks?.filter(
    (task) =>
      task.userId !== session?.user.id &&
      task.status !== "completed" &&
      task.members?.some((member) => member.userId === session?.user.id),
  );

  return (
    <>
      <Header title="Assigned Tasks" />
      <Layout>
        <div className="relative flex h-full flex-col items-center px-5">
          <div className="w-full max-w-3xl">
            <h1 className="mb-5 text-center text-2xl font-semibold text-gray-800">
              Assigned Tasks
            </h1>

            {assignedTasks?.length > 0 ? (
              <ul className="space-y-3">
                {assignedTasks.map((task) => (
                  <SingleTask key={task.id} task={task} />
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 pt-10">
                <h2 className="text-center text-lg text-gray-600">
                  You don&apos;t have any assigned tasks
                </h2>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Assigned;
