import { Router } from 'express';
import { get } from 'http';
import { getPokemonCards, getPokemonCardId, createPokemonCard, editPokemonCard, deletedPokemonCard } from './pokemonCard.controller';
import { create } from 'domain';
import { verify } from 'crypto';
import { verifyJWT } from './middleware';


export const pokemonCardRouter = Router();

pokemonCardRouter.get('/', getPokemonCards)
pokemonCardRouter.get('/:id', getPokemonCardId);
pokemonCardRouter.post('/', verifyJWT, createPokemonCard);
pokemonCardRouter.patch('/:id',verifyJWT, editPokemonCard)
pokemonCardRouter.delete('/:id', verifyJWT, deletedPokemonCard);
