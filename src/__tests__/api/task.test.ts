import { createTaskApi } from "@/utils/taskUtils";

describe("Task API", () => {
  it("should create a new task without errors", async () => {
    const mockTask = {
      title: "Test Task",
      description: "Task for testing",
      priority: "medium" as "low" | "medium" | "high",
      deadline: new Date().toISOString(),
      userEmails: [],
    };

    await expect(createTaskApi(jest.fn(), mockTask)).resolves.not.toThrow();
  });
});
