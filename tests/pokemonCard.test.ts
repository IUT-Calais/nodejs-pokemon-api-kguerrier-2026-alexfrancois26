import request from 'supertest';
import { app } from '../src';
import { prismaMock } from './vitest.setup';
import { describe, expect, it } from 'vitest';

describe('PokemonCard API', () => {
  describe('GET /pokemon-cards', () => {
    it('should fetch all PokemonCards', async () => {
      const mockPokemonCards = [
        { id: 1, name: 'Pikachu', pokedexId: 25, typeId: 1, lifePoints: 35, size: 0.4, weight: 6.0, imageUrl: 'https://example.com/pikachu.png' },
        { id: 2, name: 'Bulbasaur', pokedexId: 1, typeId: 2, lifePoints: 45, size: 0.7, weight: 6.9, imageUrl: 'https://example.com/bulbasaur.png' },
      ];
      prismaMock.pokemonCard.findMany.mockResolvedValue(mockPokemonCards);
      const response = await request(app).get('/pokemon-cards');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPokemonCards);
    });

    it ('should return 500 if there is a server error', async () => {
      prismaMock.pokemonCard.findMany.mockRejectedValue(new Error('Database error'));
      const response = await request(app).get('/pokemon-cards');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Erreur lors de la récupération des cartes Pokémon.' });
    });
  });

  describe('GET /pokemon-cards/:pokemonCardId', () => {
    it('should fetch a PokemonCard by ID', async () => {
      const mockPokemonCard = {id : 1, name: 'Pikachu', pokedexId: 25, typeId: 1, lifePoints: 35, size: 0.4, weight: 6.0, imageUrl: 'https://example.com/pikachu.png' };
      prismaMock.pokemonCard.findUnique.mockResolvedValue(mockPokemonCard);
      const response = await request(app).get('/pokemon-cards/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPokemonCard);
    });

    it('should return 404 if PokemonCard is not found', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);
      const response = await request(app).get('/pokemon-cards/unknown-id');
      expect(response.status).toBe(404);
    });
  });

  describe('POST /pokemon-cards', () => {
    it('should create a new PokemonCard', async () => {
      const createdPokemonCard = { id: 1, name: 'Pikachu', pokedexId: 25, typeId: 1, lifePoints: 35, size: 0.4, weight: 6.0, imageUrl: 'https://example.com/pikachu.png' };
      const createInput = { name: 'Pikachu', pokedexId: 25, typeId: 1, lifePoints: 35, size: 0.4, weight: 6.0, imageUrl: 'https://example.com/pikachu.png' };

      prismaMock.type.findUnique.mockResolvedValue({ id: 1, name: 'Electric' });
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);
      prismaMock.pokemonCard.create.mockResolvedValue(createdPokemonCard);

      const response = await request(app)
        .post('/pokemon-cards')
        .set('Authorization', 'Bearer test-token')
        .send(createInput);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdPokemonCard);

    });

  });

  describe('PATCH /pokemon-cards/:pokemonCardId', () => {
    it('should update an existing PokemonCard', async () => {
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

  });

  describe('DELETE /pokemon-cards/:pokemonCardId', () => {
    it('should delete a PokemonCard', async () => {
    });
  });
});
