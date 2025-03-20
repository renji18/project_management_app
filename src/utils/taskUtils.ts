import {
  addTask,
  deleteTask,
  updateTask,
  type Task,
} from "@/store/slices/taskSlice";
import { type AppDispatch } from "@/store";

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  status?: "pending" | "in-progress" | "completed";
  deadline?: string | null;
}

export const createTaskApi = async (
  dispatch: AppDispatch,
  { title, description = "", priority = "medium", deadline }: CreateTaskInput,
) => {
  try {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        priority,
        deadline: deadline ? new Date(deadline).toISOString() : null,
      }),
    });

    console.log(res, "res");

    if (!res.ok) throw new Error("Failed to create task");

    const data = (await res.json()) as Task;
    dispatch(addTask(data));
  } catch (error) {
    console.error("Error creating task:", error);
  }
};

export const updateTaskApi = async (
  dispatch: AppDispatch,
  taskId: string,
  updates: Partial<CreateTaskInput>,
) => {
  try {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!res.ok) throw new Error("Failed to update task");

    const updatedTask = (await res.json()) as Task;

    dispatch(updateTask(updatedTask));
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

export const deleteTaskApi = async (dispatch: AppDispatch, taskId: string) => {
  try {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete task");

    dispatch(deleteTask(taskId));
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};
