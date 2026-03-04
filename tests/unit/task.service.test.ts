import { TaskService } from "../../src/services/task.services";
import { Task } from "../../src/models/Task";

jest.mock("../../src/models/Task");

const mockedTask = Task as jest.Mocked<typeof Task>;

describe("TaskService", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

 
  it("create passes correct data to database", async () => {

    const mockTask: any = { title: "Test Task" };

    mockedTask.create.mockResolvedValue(mockTask);

    const result = await TaskService.create(mockTask);

    expect(mockedTask.create).toHaveBeenCalledWith(mockTask);
    expect(result).toEqual(mockTask);

  });


  
  it("create throws error if dueDate is in past", async () => {

    const pastDate = new Date(Date.now() - 10000);

    await expect(
      TaskService.create({
        title: "Past Task",
        dueDate: pastDate
      } as any)
    ).rejects.toThrow("Due date must be in the future");

  });


 
  it("findAll passes pagination parameters", async () => {

    const mockTasks: any[] = [];

    const limitMock = jest.fn().mockResolvedValue(mockTasks);
    const skipMock = jest.fn().mockReturnValue({ limit: limitMock });
    const populateMock2 = jest.fn().mockReturnValue({ skip: skipMock });
    const populateMock1 = jest.fn().mockReturnValue({ populate: populateMock2 });

    mockedTask.find.mockReturnValue({
      populate: populateMock1
    } as any);

    mockedTask.countDocuments = jest.fn().mockResolvedValue(5) as any;

    await TaskService.findAll({ page: 2, limit: 10 });

    expect(skipMock).toHaveBeenCalledWith(10);
    expect(limitMock).toHaveBeenCalledWith(10);

  });


  it("findById returns task", async () => {

    const mockTask: any = { title: "Task" };

    const populateMock = jest.fn().mockResolvedValue(mockTask);

    mockedTask.findOne.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: populateMock
      })
    } as any);

    const result = await TaskService.findById("123");

    expect(mockedTask.findOne).toHaveBeenCalled();
    expect(result).toEqual(mockTask);

  });


  
  it("update merges partial data correctly", async () => {

    const task: any = {
      title: "Old Title",
      save: jest.fn()
    };

    mockedTask.findOne.mockResolvedValue(task);

    await TaskService.update("123", { title: "New Title" });

    expect(task.title).toBe("New Title");
    expect(task.save).toHaveBeenCalled();

  });


it("delete sets deletedAt instead of removing document", async () => {

  const task: any = {
    deletedAt: null,
    save: jest.fn()
  };

  mockedTask.findById.mockResolvedValue(task);

  await TaskService.delete("123");

  expect(mockedTask.findById).toHaveBeenCalledWith("123");
  expect(task.deletedAt).not.toBeNull();
  expect(task.save).toHaveBeenCalled();

});

});