import Header from "@/components/Header";
import Layout from "@/components/Layout";
import SingleTask from "@/components/SingleTask";
import React from "react";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { type RootState } from "@/store";

const Assigned = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const { data: session } = useSession();

  return (
    <>
      <Header title="Assigned Tasks" />
      <Layout>
        {tasks?.length > 0 &&
        tasks.some(
          (t) => t.status !== "completed" && t.userId !== session?.user.id,
        ) ? (
          <div className="flex h-full flex-col items-center">
            <div className="w-full max-w-3xl p-5">
              <h1 className="mb-4 text-center text-2xl font-bold">
                Assigned Tasks
              </h1>
              <ul className="space-y-3">
                {tasks
                  .filter(
                    (t) =>
                      t.userId !== session?.user.id && t.status !== "completed",
                  )
                  .map((task) => (
                    <SingleTask key={task.id} task={task} />
                  ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            <h1 className="text-center text-lg">
              You don&apos;t have any assigned tasks
            </h1>
          </div>
        )}
      </Layout>
    </>
  );
};

export default Assigned;
