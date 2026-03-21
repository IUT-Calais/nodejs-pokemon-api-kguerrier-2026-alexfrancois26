import request from 'supertest';
import { app } from '../src';
import { prismaMock } from './vitest.setup';
import { describe, expect, it } from 'vitest';

describe('PokemonCard API', () => {
  describe('GET /pokemon-cards', () => {
    it('get all cards', async () => {
      const mockPokemonCards = [
        { id: 1, name: 'Pikachu', pokedexId: 25, typeId: 1, lifePoints: 35, size: 0.4, weight: 6.0, imageUrl: 'https://example.com/pikachu.png' },
        { id: 2, name: 'Bulbasaur', pokedexId: 1, typeId: 2, lifePoints: 45, size: 0.7, weight: 6.9, imageUrl: 'https://example.com/bulbasaur.png' },
      ];
      prismaMock.pokemonCard.findMany.mockResolvedValue(mockPokemonCards);
      const response = await request(app).get('/pokemon-cards');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPokemonCards);
    });

    it('get 404 if no cards', async () => {
      prismaMock.pokemonCard.findMany.mockResolvedValue(null);
      const response = await request(app).get('/pokemon-cards');
      expect(response.status).toBe(404);
    });

    it ('get 500 on error', async () => {
      prismaMock.pokemonCard.findMany.mockRejectedValue(new Error('Database error'));
      const response = await request(app).get('/pokemon-cards');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Erreur lors de la récupération des cartes Pokémon.' });
    });
  });

  describe('GET /pokemon-cards/:pokemonCardId', () => {
    it('get card by id', async () => {
      const mockPokemonCard = {id : 1, name: 'Pikachu', pokedexId: 25, typeId: 1, lifePoints: 35, size: 0.4, weight: 6.0, imageUrl: 'https://example.com/pikachu.png' };
      prismaMock.pokemonCard.findUnique.mockResolvedValue(mockPokemonCard);
      const response = await request(app).get('/pokemon-cards/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPokemonCard);
    });

    it('get 404 if not found', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);
      const response = await request(app).get('/pokemon-cards/unknown-id');
      expect(response.status).toBe(404);
    });

    it('get 500 on error', async () => {
      prismaMock.pokemonCard.findUnique.mockRejectedValue(new Error('Database error'));
      const response = await request(app).get('/pokemon-cards/1');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Erreur lors de la récupération de la carte Pokémon.' });
    });
  });

  describe('POST /pokemon-cards', () => {
    beforeEach(() => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);
    });

    it('create card', async () => {
      const createdPokemonCard = { id: 1, name: 'Pikachu', pokedexId: 25, typeId: 1, lifePoints: 35, size: 0.4, weight: 6.0, imageUrl: 'https://example.com/pikachu.png' };
      const createInput = { name: 'Pikachu', pokedexId: 25, typeId: 1, lifePoints: 35, size: 0.4, weight: 6.0, imageUrl: 'https://example.com/pikachu.png' };

      prismaMock.type.findUnique.mockResolvedValue({ id: 1, name: 'Electric' });
      prismaMock.pokemonCard.create.mockResolvedValue(createdPokemonCard);

      const response = await request(app)
        .post('/pokemon-cards')
        .set('Authorization', 'Bearer test-token')
        .send(createInput);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdPokemonCard);
    });

    it('get 400 if fields missing', async () => {
      const incompleteInput = { name: 'Pikachu' };
      const response = await request(app)
        .post('/pokemon-cards')
        .set('Authorization', 'Bearer test-token')
        .send(incompleteInput);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Les champs name, pokedexId, typeId et lifePoints sont obligatoires' });
    });

    it('get 400 if type invalid', async () => {
      const createInput = { name: 'Pikachu', pokedexId: 25, typeId: 999, lifePoints: 35, size: 0.4, weight: 6.0, imageUrl: 'https://example.com/pikachu.png' };
      prismaMock.type.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/pokemon-cards')
        .set('Authorization', 'Bearer test-token')
        .send(createInput);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Le type n\'existe pas' });
    });

    it('get 400 if name exists', async () => {
      const createInput = { name: 'Pikachu', pokedexId: 25, typeId: 1, lifePoints: 35, size: 0.4, weight: 6.0, imageUrl: 'https://example.com/pikachu.png' };
      const existingCard = { id: 1, name: 'Pikachu', pokedexId: 25, typeId: 1, lifePoints: 35, size: 0.4, weight: 6.0, imageUrl: 'https://example.com/pikachu.png' };

      prismaMock.type.findUnique.mockResolvedValue({ id: 1, name: 'Electric' });
      prismaMock.pokemonCard.findUnique.mockResolvedValue(existingCard);

      const response = await request(app)
        .post('/pokemon-cards')
        .set('Authorization', 'Bearer test-token')
        .send(createInput);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Le nom ou le pokedexId de la carte Pokémon existe déjà' });
    });

    it('get 500 on db error', async () => {
      const createInput = { name: 'Pikachu', pokedexId: 25, typeId: 1, lifePoints: 35, size: 0.4, weight: 6.0, imageUrl: 'https://example.com/pikachu.png' };

      prismaMock.type.findUnique.mockResolvedValue({ id: 1, name: 'Electric' });
      prismaMock.pokemonCard.create.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/pokemon-cards')
        .set('Authorization', 'Bearer test-token')
        .send(createInput);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Erreur lors de la création de la carte Pokémon' });
    });
  });

  describe('PATCH /pokemon-cards/:pokemonCardId', () => {
    it('update card', async () => {
      const originalCard = { id: 1, name: 'Pikachu', pokedexId: 25, typeId: 1, lifePoints: 35, size: 0.4, weight: 6.0, imageUrl: 'https://example.com/pikachu.png' };
      const updatedPokemonCard = { id: 1, name: 'Pikachu', pokedexId: 25, typeId: 1, lifePoints: 40, size: 0.4, weight: 6.0, imageUrl: 'https://example.com/pikachu.png' };
      const updateInput = { lifePoints: 40 };

      prismaMock.pokemonCard.findUnique.mockResolvedValue(originalCard);
      prismaMock.pokemonCard.update.mockResolvedValue(updatedPokemonCard);

      const response = await request(app)
        .patch('/pokemon-cards/1')
        .set('Authorization', 'Bearer test-token')
        .send(updateInput);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedPokemonCard);
    });

    it('get 400 if not found', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);
      const updateInput = { lifePoints: 40 };

      const response = await request(app)
        .patch('/pokemon-cards/999')
        .set('Authorization', 'Bearer test-token')
        .send(updateInput);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "La carte Pokémon n'existe pas" });
    });

    it('get 400 if type invalid', async () => {
      const originalCard = { id: 1, name: 'Pikachu', pokedexId: 25, typeId: 1, lifePoints: 35, size: 0.4, weight: 6.0, imageUrl: 'https://example.com/pikachu.png' };
      const updateInput = { typeId: 999 };

      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(originalCard);
      prismaMock.type.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .patch('/pokemon-cards/1')
        .set('Authorization', 'Bearer test-token')
        .send(updateInput);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Le type n'existe pas" });
    });

    it('update typeId', async () => {
      const originalCard = { id: 1, name: 'Pikachu', pokedexId: 25, typeId: 1, lifePoints: 35, size: 0.4, weight: 6.0, imageUrl: 'https://example.com/pikachu.png' };
      const updatedCard = { id: 1, name: 'Pikachu', pokedexId: 25, typeId: 2, lifePoints: 35, size: 0.4, weight: 6.0, imageUrl: 'https://example.com/pikachu.png' };
      const updateInput = { typeId: 2 };

      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(originalCard);
      prismaMock.type.findUnique.mockResolvedValue({ id: 2, name: 'Water' });
      prismaMock.pokemonCard.update.mockResolvedValue(updatedCard);

      const response = await request(app)
        .patch('/pokemon-cards/1')
        .set('Authorization', 'Bearer test-token')
        .send(updateInput);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedCard);
    });

    it('get 400 if name exists', async () => {
      const originalCard = { id: 1, name: 'Pikachu', pokedexId: 25, typeId: 1, lifePoints: 35, size: 0.4, weight: 6.0, imageUrl: 'https://example.com/pikachu.png' };
      const existingCard = { id: 2, name: 'Bulbasaur', pokedexId: 1, typeId: 2, lifePoints: 45, size: 0.7, weight: 6.9, imageUrl: 'https://example.com/bulbasaur.png' };
      const updateInput = { name: 'Bulbasaur' };

      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(originalCard);
      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(existingCard);

      const response = await request(app)
        .patch('/pokemon-cards/1')
        .set('Authorization', 'Bearer test-token')
        .send(updateInput);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Le nom de la carte Pokémon existe déjà' });
    });

    it('update different name', async () => {
      const originalCard = { id: 1, name: 'Pikachu', pokedexId: 25, typeId: 1, lifePoints: 35, size: 0.4, weight: 6.0, imageUrl: 'https://example.com/pikachu.png' };
      const updatedCard = { id: 1, name: 'NewName', pokedexId: 25, typeId: 1, lifePoints: 35, size: 0.4, weight: 6.0, imageUrl: 'https://example.com/pikachu.png' };
      const updateInput = { name: 'NewName' };

      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(originalCard);
      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(null);
      prismaMock.pokemonCard.update.mockResolvedValue(updatedCard);

      const response = await request(app)
        .patch('/pokemon-cards/1')
        .set('Authorization', 'Bearer test-token')
        .send(updateInput);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedCard);
    });

    it('update same name', async () => {
      const originalCard = { id: 1, name: 'Pikachu', pokedexId: 25, typeId: 1, lifePoints: 35, size: 0.4, weight: 6.0, imageUrl: 'https://example.com/pikachu.png' };
      const updateInput = { name: 'Pikachu' };

      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(originalCard);
      prismaMock.pokemonCard.update.mockResolvedValue(originalCard);

      const response = await request(app)
        .patch('/pokemon-cards/1')
        .set('Authorization', 'Bearer test-token')
        .send(updateInput);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(originalCard);
    });

    it('get 400 if pokedexId exists', async () => {
      const originalCard = { id: 1, name: 'Pikachu', pokedexId: 25, typeId: 1, lifePoints: 35, size: 0.4, weight: 6.0, imageUrl: 'https://example.com/pikachu.png' };
      const existingCard = { id: 2, name: 'Bulbasaur', pokedexId: 1, typeId: 2, lifePoints: 45, size: 0.7, weight: 6.9, imageUrl: 'https://example.com/bulbasaur.png' };
      const updateInput = { pokedexId: 1 };

      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(originalCard);
      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(existingCard);

      const response = await request(app)
        .patch('/pokemon-cards/1')
        .set('Authorization', 'Bearer test-token')
        .send(updateInput);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Le pokedexId de la carte Pokémon existe déjà' });
    });

    it('update different pokedexId', async () => {
      const originalCard = { id: 1, name: 'Pikachu', pokedexId: 25, typeId: 1, lifePoints: 35, size: 0.4, weight: 6.0, imageUrl: 'https://example.com/pikachu.png' };
      const updatedCard = { id: 1, name: 'Pikachu', pokedexId: 50, typeId: 1, lifePoints: 35, size: 0.4, weight: 6.0, imageUrl: 'https://example.com/pikachu.png' };
      const updateInput = { pokedexId: 50 };

      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(originalCard);
      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(null);
      prismaMock.pokemonCard.update.mockResolvedValue(updatedCard);

      const response = await request(app)
        .patch('/pokemon-cards/1')
        .set('Authorization', 'Bearer test-token')
        .send(updateInput);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedCard);
    });

    it('update same pokedexId', async () => {
      const originalCard = { id: 1, name: 'Pikachu', pokedexId: 25, typeId: 1, lifePoints: 35, size: 0.4, weight: 6.0, imageUrl: 'https://example.com/pikachu.png' };
      const updateInput = { pokedexId: 25 };

      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(originalCard);
      prismaMock.pokemonCard.update.mockResolvedValue(originalCard);

      const response = await request(app)
        .patch('/pokemon-cards/1')
        .set('Authorization', 'Bearer test-token')
        .send(updateInput);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(originalCard);
    });

    it('get 500 on db error', async () => {
      const originalCard = { id: 1, name: 'Pikachu', pokedexId: 25, typeId: 1, lifePoints: 35, size: 0.4, weight: 6.0, imageUrl: 'https://example.com/pikachu.png' };
      const updateInput = { lifePoints: 40 };

      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(originalCard);
      prismaMock.pokemonCard.update.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .patch('/pokemon-cards/1')
        .set('Authorization', 'Bearer test-token')
        .send(updateInput);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Une erreur est surevenue lors de la modification de la carte Pokémon' });
    });
  });

  describe('DELETE /pokemon-cards/:pokemonCardId', () => {
    it('delete card', async () => {
      const deletedCard = { id: 1, name: 'Pikachu', pokedexId: 25, typeId: 1, lifePoints: 35, size: 0.4, weight: 6.0, imageUrl: 'https://example.com/pikachu.png' };
      
      prismaMock.pokemonCard.delete.mockResolvedValue(deletedCard);

      const response = await request(app)
        .delete('/pokemon-cards/1')
        .set('Authorization', 'Bearer test-token');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(deletedCard);
    });

    it('get 500 if not found', async () => {
      prismaMock.pokemonCard.delete.mockRejectedValue(new Error('Record to delete does not exist'));

      const response = await request(app)
        .delete('/pokemon-cards/999')
        .set('Authorization', 'Bearer test-token');
      expect(response.status).toBe(500);
    });

    it('handle null delete', async () => {
      prismaMock.pokemonCard.delete.mockResolvedValue(null);

      await request(app)
        .delete('/pokemon-cards/1')
        .set('Authorization', 'Bearer test-token')
        .catch(() => {
        
        });
    });
  });
});
