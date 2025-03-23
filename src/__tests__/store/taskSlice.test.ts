import {
  addTask,
  deleteTask,
  taskReducer,
  type Task,
} from "@/store/slices/taskSlice";

describe("Task Slice", () => {
  it("should add a task", () => {
    const initialState: { tasks: Task[] } = { tasks: [] };

    const newTask: Task = {
      id: "1",
      title: "New Task",
      description: "Test description",
      priority: "medium",
      status: "pending",
      deadline: undefined,
      userId: "123",
      members: [],
    };

    const state = taskReducer(initialState, addTask(newTask));
    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0]?.title).toBe("New Task");
  });

  it("should remove a task", () => {
    const initialState: { tasks: Task[] } = {
      tasks: [
        {
          id: "1",
          title: "New Task",
          description: "Test description",
          priority: "medium",
          status: "pending",
          deadline: undefined,
          userId: "123",
          members: [],
        },
      ],
    };

    const state = taskReducer(initialState, deleteTask("1"));
    expect(state.tasks).toHaveLength(0);
  });
});
