import Header from "@/components/Header";
import Layout from "@/components/Layout";
import SingleTask from "@/components/SingleTask";
import { type RootState } from "@/store";
import { useSelector } from "react-redux";
import React from "react";

const Archive = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  const completedTasks = tasks?.filter((task) => task.status === "completed");

  return (
    <>
      <Header title="Archived Tasks" />
      <Layout>
        <div className="relative flex h-full flex-col items-center px-5">
          <div className="w-full max-w-3xl">
            <h1 className="mb-5 text-center text-2xl font-semibold text-gray-800">
              Archived Tasks{" "}
              {completedTasks.length > 0 ? `(${completedTasks.length})` : ""}
            </h1>

            {completedTasks?.length > 0 ? (
              <ul className="space-y-3">
                {completedTasks.map((task) => (
                  <SingleTask key={task.id} task={task} />
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 pt-10">
                <h2 className="text-center text-lg text-gray-600">
                  No archived tasks found
                </h2>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Archive;
