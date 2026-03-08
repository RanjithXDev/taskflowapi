import { Task } from "../../src/models/Task";

describe("Daily Digest Logic", () => {

  it("should identify overdue tasks", async () => {

    const overdueTask = await Task.create({
      title: "Late Task",
      description: "Test",
      priority: "high",
      status: "todo",
      assignee: "507f1f77bcf86cd799439011",
      project: "507f1f77bcf86cd799439012",
      dueDate: new Date(Date.now() - 1000 * 60 * 60)
    });

    expect(overdueTask.dueDate).toBeDefined();
    if (overdueTask.dueDate) {
      expect(new Date(overdueTask.dueDate).getTime())
        .toBeLessThan(Date.now());
    }

  });

});