import  request  from "supertest";
import app from '../src/app';

describe("Health Test for API" ,  ()=>{
    it("should return stautscode 200 and proper struture", async ()=>{
        const res = await request (app).get('/api/health');
        console.log(res.status);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('timestamp');
        expect(res.body).toHaveProperty('uptime');
    });
    it("should return 404 error msg", async()=>{
        const res = await request(app).get('/random');
        expect(res.status).toBe(404);
    });
});