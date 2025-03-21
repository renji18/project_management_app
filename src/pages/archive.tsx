import Header from "@/components/Header";
import Layout from "@/components/Layout";
import React from "react";
import { useSelector } from "react-redux";
import { type RootState } from "@/store";
import SingleTask from "@/components/SingleTask";

const Archive = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  return (
    <>
      <Header title="Archived Tasks" />
      <Layout>
        {tasks?.length > 0 ? (
          <div className="relative flex h-full flex-col items-center">
            <div className="w-full max-w-3xl p-5">
              <h1 className="mb-4 text-center text-2xl font-bold">
                Your Tasks
              </h1>
              <ul className="space-y-3">
                {tasks
                  .filter((t) => t.status === "completed")
                  .map((task) => (
                    <SingleTask key={task.id} task={task} />
                  ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <h1 className="text-center text-lg">
              You don&apos;t have any archived tasks
            </h1>
          </div>
        )}
      </Layout>
    </>
  );
};

export default Archive;
