import request from 'supertest';
import app from '../src/app';

describe('Health API Integration Tests', () => {

  it('GET /api/health should return 200 and correct structure', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('uptime');
  });

  it('GET /nonexistent should return 404', async () => {
    const res = await request(app).get('/random-route');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
  });

  it('Health endpoint should include security headers (helmet)', async () => {
    const res = await request(app).get('/api/health');

    expect(res.headers).toHaveProperty('x-content-type-options');
  });
  it('should return proper 404 structure', async () => {
    const res = await request(app).get('/unknown-route');

     expect(res.status).toBe(404);
     expect(res.body.status).toBe('Fail');
    });

});