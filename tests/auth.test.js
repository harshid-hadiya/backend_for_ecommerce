const request = require('supertest');
const server = require('../server');

afterAll(() => {
  server.close(); // Close the server after tests
});

describe('Authentication Tests', () => {
  it('should register a new user', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'customer'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
  });

  it('should login the user', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});