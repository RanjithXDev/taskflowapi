import request from 'supertest';
import app from '../src/app';

describe('View Routes Coverage', () => {

  it('GET / should return 200', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
  });

  it('GET /tasks-ui should return 200', async () => {
    const res = await request(app).get('/tasks-ui');
    expect(res.status).toBe(200);
  });

});