import { updateTaskStatusApi } from "@/utils/taskUtils";

describe("Task Utilities", () => {
  it("should update task status without errors", async () => {
    const dispatchMock = jest.fn();
    const taskId = "1";
    const newStatus = "completed";

    await expect(
      updateTaskStatusApi(dispatchMock, taskId, newStatus),
    ).resolves.not.toThrow();
  });
});
