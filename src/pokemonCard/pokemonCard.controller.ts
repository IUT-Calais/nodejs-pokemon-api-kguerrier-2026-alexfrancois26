import { Router, type Request, type Response } from 'express';
import prisma from '../client.js';

export const getPokemonCards = async (req: Request, res: Response) => {
    try {
        const cards = await prisma.pokemonCard.findMany();
        if (!cards) {
            res.status(404).send("Les cartes Pokémon n'ont pas été trouvées.");
            return
        }
        res.status(200).send(cards)
    } catch (error) {
        res.status(500).send({ error: "Erreur lors de la récupération des cartes Pokémon." })
    }
};

export const getPokemonCardId = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const card = await prisma.pokemonCard.findUnique({
            where: { id: Number(id) },
        });
        if (!card) {
            res.status(404).send("La carte Pokemon n'a pas été trouvée");
            return
        }
        res.status(200).send(card)
    } catch (error) {
        res.status(500).send({ error: "Erreur lors de la récupération de la carte Pokémon." })
    }
};

export const createPokemonCard = async (req: Request, res: Response) => {
    const { name, pokedexId, typeId, lifePoints, size, weight, imageUrl } = req.body;
    try {
        const type = await prisma.type.findUnique({
            where: { id: typeId }
        });
        const namePoke = await prisma.pokemonCard.findUnique({
            where: { name: name }
        });
        const pokedexIdPoke = await prisma.pokemonCard.findUnique({
            where: { pokedexId: pokedexId }
        });
        if (!name || !pokedexId || !typeId || !lifePoints) {
            res.status(400).send({ error: "Les champs name, pokedexId, typeId et lifePoints sont obligatoires" });
            return;
        }
        else if (!type) {
            res.status(400).send({ error: "Le type n'existe pas" });
            return;
        }
        else if (namePoke || pokedexIdPoke) {
            res.status(400).send({ error: "Le nom ou le pokedexId de la carte Pokémon existe déjà" });
            return;
        }
        else {
            const newCard = await prisma.pokemonCard.create({
                data: {
                    name,
                    pokedexId,
                    typeId,
                    lifePoints,
                    size,
                    weight,
                    imageUrl
                }
            });
            res.status(201).send( newCard);
        }
    }
    catch (error) {
        res.status(500).send({ error: "Erreur lors de la création de la carte Pokémon" });
        console.error(error);
    }
}


export const editPokemonCard = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, pokedexId, typeId, lifePoints, size, weight, imageUrl } = req.body;
    try {
        const card = await prisma.pokemonCard.findUnique({
            where: { id: Number(id) }
        });

        if (!card) {
            res.status(400).send({ error: "La carte Pokémon n'existe pas" });
            return;
        }
        if (typeId) {
            const type = await prisma.type.findUnique({
                where: { id: typeId }
            });
            if (!type) {
                res.status(400).send({ error: "Le type n'existe pas" });
                return;
            }
        }
        if (name && name !== card.name) {
            const namePoke = await prisma.pokemonCard.findUnique({
                where: { name: name }
            });
            if (namePoke) {
                res.status(400).send({ error: "Le nom de la carte Pokémon existe déjà" });
                return;
            }
        }

        if (pokedexId && pokedexId !== card.pokedexId) {
            const pokedexIdPoke = await prisma.pokemonCard.findUnique({
                where: { pokedexId: pokedexId }
            });
            if (pokedexIdPoke) {
                res.status(400).send({ error: "Le pokedexId de la carte Pokémon existe déjà" });
                return;
            }
        }
        const edit = await prisma.pokemonCard.update({ 
            where: { id: Number(id) },
            data: {
                name: name,
                pokedexId: pokedexId,
                typeId: typeId,
                lifePoints: lifePoints,
                size: size,
                weight: weight,
                imageUrl: imageUrl
            }
        });
        res.status(200).send(edit);
    }

    catch (error) {
        res.status(500).send({ error: "Une erreur est surevenue lors de la modification de la carte Pokémon" });
    }
}


export const deletedPokemonCard = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deleted = await prisma.pokemonCard.delete({
            where: { id: Number(id) }
        });
        if (!deleted) {
            res.status(404).send("La carte Pokémon n'a pas été trouvée");
        }
        res.status(200).send(deleted);
    } catch (error) {
        res.status(500).send({ error: "Une erreur est surevenue lors de la suppression de la carte Pokémon" });
    }
};
