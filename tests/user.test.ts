import request from 'supertest';
import { app } from '../src';
import { prismaMock } from './vitest.setup';
import { describe, expect, it, beforeEach } from 'vitest';

describe('User API', () => {
  describe('POST /users', () => {
    beforeEach(() => {
      prismaMock.user.findUnique.mockResolvedValue(null);
    });

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

    it('should return 400 if email is missing', async () => {
      const response = await request(app)
        .post('/users')
        .send({ password: 'truePassword' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Email et MDP sont requis' });
    });

    it('should return 400 if password is missing', async () => {
      const response = await request(app)
        .post('/users')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Email et MDP sont requis' });
    });

    it('should return 400 if email already exists', async () => {
      const existingUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      prismaMock.user.findUnique.mockResolvedValue(existingUser);

      const response = await request(app)
        .post('/users')
        .send({ email: 'test@example.com', password: 'truePassword' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Mail déjà utilisé' });
    });

    it('should return 500 if database error occurs', async () => {
      prismaMock.user.create.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/users')
        .send({ email: 'test@example.com', password: 'truePassword' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Erreur lors de la création de l\'utilisateur' });
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

    it('should return 401 if user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/users/login')
        .send({ email: 'nonexistent@example.com', password: 'truePassword' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Email ou mot de passe incorrect' });
    });

    it('should return 401 if password is incorrect', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      prismaMock.user.findUnique.mockResolvedValue(user);

      const response = await request(app)
        .post('/users/login')
        .send({ email: 'test@example.com', password: 'wrongPassword' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Email ou mot de passe incorrect' });
    });

    it('should return 500 if database error occurs', async () => {
      prismaMock.user.findUnique.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/users/login')
        .send({ email: 'test@example.com', password: 'truePassword' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Erreur lors de la connexion' });
    });
  });

  describe('GET /users', () => {
    it('should fetch all users', async () => {
      const mockUsers = [
        { id: 1, email: 'user1@example.com' },
        { id: 2, email: 'user2@example.com' },
      ];

      prismaMock.user.findMany.mockResolvedValue(mockUsers);

      const response = await request(app).get('/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
    });

    it('should return 500 if database error occurs', async () => {
      prismaMock.user.findMany.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/users');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Erreur lors de la récupération des utilisateurs' });
    });
  });

  describe('GET /users/:id', () => {
    it('should fetch a user by ID', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const response = await request(app).get('/users/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    it('should return 404 if user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/users/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "L'utilisateur n'existe pas" });
    });

    it('should return 500 if database error occurs', async () => {
      prismaMock.user.findUnique.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/users/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Erreur lors de la récupération de l'utilisateur" });
    });
  });

  describe('PATCH /users/:id', () => {
    it('should update a user', async () => {
      const originalUser = { id: 1, email: 'old@example.com' };
      const updatedUser = { id: 1, email: 'new@example.com' };

      prismaMock.user.findUnique.mockResolvedValueOnce(originalUser);
      prismaMock.user.update.mockResolvedValue(updatedUser);

      const response = await request(app)
        .patch('/users/1')
        .send({ email: 'new@example.com' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedUser);
    });

    it('should return 404 if user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .patch('/users/999')
        .send({ email: 'new@example.com' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "L'utilisateur n'existe pas" });
    });

    it('should return 400 if new email already exists', async () => {
      const originalUser = { id: 1, email: 'old@example.com' };
      const existingUser = { id: 2, email: 'new@example.com' };

      prismaMock.user.findUnique.mockResolvedValueOnce(originalUser);
      prismaMock.user.findUnique.mockResolvedValueOnce(existingUser);

      const response = await request(app)
        .patch('/users/1')
        .send({ email: 'new@example.com' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Cet email est déjà utilisé' });
    });

    it('should return 500 if database error occurs', async () => {
      const originalUser = { id: 1, email: 'old@example.com' };

      prismaMock.user.findUnique.mockResolvedValueOnce(originalUser);
      prismaMock.user.update.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .patch('/users/1')
        .send({ email: 'new@example.com' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Erreur lors de la modification de l'utilisateur" });
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user', async () => {
      const deletedUser = { id: 1, email: 'test@example.com' };

      prismaMock.user.delete.mockResolvedValue(deletedUser);

      const response = await request(app).delete('/users/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(deletedUser);
    });

    it('should return 500 if user does not exist', async () => {
      prismaMock.user.delete.mockRejectedValue(new Error('Record to delete does not exist'));

      const response = await request(app).delete('/users/999');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Erreur lors de la suppression de l'utilisateur" });
    });
  });
});
