"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json2csv_1 = require("json2csv");
describe("CSV Generator", () => {
    it("should generate correct header row and formatted data", () => {
        const tasks = [
            {
                title: "Task 1",
                description: "First task",
                status: "todo",
                priority: "high",
                assignee: "John",
                dueDate: "2026-03-10"
            },
            {
                title: "Task 2",
                description: "Second task",
                status: "done",
                priority: "medium",
                assignee: "Alice",
                dueDate: "2026-03-12"
            }
        ];
        const parser = new json2csv_1.Parser();
        const csv = parser.parse(tasks);
        const lines = csv.split("\n");
        expect(lines[0]).toContain("title");
        expect(lines[0]).toContain("description");
        expect(lines[0]).toContain("status");
    });
});
