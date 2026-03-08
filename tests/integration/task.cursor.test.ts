jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234-5678'
}));

import request from "supertest";
import app from "../../src/app";

describe("Cursor Pagination Traversal", () => {

  it("traverses dataset without duplicates", async () => {

    let cursor = null;
    let results: any[] = [];

    for (let i = 0; i < 5; i++) {

      const res = await request(app)
        .get(`/api/tasks?cursor=${cursor}&limit=5`);
        const tasks = res.body.data || [];
      results.push(...tasks);

      cursor = res.body.nextCursor;

      if (!res.body.hasMore) break;

    }

    const ids = results.map(r => r._id);

    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(ids.length);

  });

});