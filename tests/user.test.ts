import request from 'supertest';
import { app } from '../src';
import { prismaMock } from './vitest.setup';
import { describe, expect, it } from 'vitest';

describe('User API', () => {
  describe('POST /users', () => {
    it('should create a new user', async () => {
      const createdUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      prismaMock.user.create.mockResolvedValue(createdUser);

      const response = await request(app)
        .post('/users')
        .send({ email: 'test@example.com', password: 'truePassword' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdUser);
    });
  });

  describe('POST /login', () => {
    it('should login a user and return a token', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      const token = 'mockedToken';

      prismaMock.user.findUnique.mockResolvedValue(user);

      const response = await request(app)
        .post('/users/login')
        .send({ email: 'test@example.com', password: 'truePassword' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        token,
        message: 'Connexion réussie',
        user: {
          id: 1,
          email: 'test@example.com',
        },
      });
    });
  });
});
