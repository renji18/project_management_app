import CreateNewTask from "@/components/CreateNewTask";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import { type RootState } from "@/store";
import { setTasks, type Task } from "@/store/slices/taskSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  console.log(tasks, "task");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        if (!res.ok) throw new Error("Failed to fetch tasks");

        const data = (await res.json()) as Task[];
        dispatch(setTasks(data));
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      }
    };

    void fetchTasks();
  }, [dispatch]);

  return (
    <>
      <Header title="Dashboard" />
      <Layout>
        <div className="flex h-full flex-col items-center justify-center">
          {tasks?.length > 0 ? (
            <div className="w-full max-w-3xl p-5">
              <h1 className="mb-4 text-center text-2xl font-bold">
                Your Tasks
              </h1>
              <ul className="space-y-3">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between rounded border bg-white p-4 shadow-sm"
                  >
                    <div>
                      <h2 className="text-lg font-semibold">{task.title}</h2>
                      <p className="text-gray-600">
                        {task.description ?? "No description"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Priority:{" "}
                        <span className="font-semibold">{task.priority}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Status:{" "}
                        <span className="font-semibold">{task.status}</span>
                      </p>
                      {task.deadline && (
                        <p className="text-sm text-gray-500">
                          Deadline:{" "}
                          <span className="font-semibold">
                            {new Date(task.deadline).toDateString()}
                          </span>
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex justify-center">
                <CreateNewTask />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h1 className="text-center">You don&apos;t have any tasks</h1>
              <CreateNewTask />
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
