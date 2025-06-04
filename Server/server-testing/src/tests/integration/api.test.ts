import request from 'supertest';
import app from '../../app';

describe('API Integration Tests', () => {
  it('should return a 200 status for the root endpoint', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  it('should create a new resource and return a 201 status', async () => {
    const newResource = { name: 'Test Resource' };
    const response = await request(app).post('/api/resource').send(newResource);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newResource.name);
  });

  it('should return a 404 status for a non-existing endpoint', async () => {
    const response = await request(app).get('/api/non-existing');
    expect(response.status).toBe(404);
  });
});