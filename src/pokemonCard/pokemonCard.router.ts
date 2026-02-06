import { Router } from 'express';
import { get } from 'http';
import { getPokemonCards, getPokemonCardId, createPokemonCard, editPokemonCard, deletedPokemonCard } from './pokemonCard.controller';
import { create } from 'domain';


export const pokemonCardRouter = Router();

pokemonCardRouter.get('/', getPokemonCards)
pokemonCardRouter.get('/:id', getPokemonCardId);
pokemonCardRouter.post('/', createPokemonCard);
pokemonCardRouter.patch('/:id', editPokemonCard)
pokemonCardRouter.delete('/:id', deletedPokemonCard);