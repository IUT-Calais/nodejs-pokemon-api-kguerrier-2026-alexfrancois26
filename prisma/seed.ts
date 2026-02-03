import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.pokemonCard.deleteMany();
  await prisma.type.deleteMany();

  await prisma.type.createMany({
    data: [
      { name: 'Normal' },
      { name: 'Fire' },
      { name: 'Water' },
      { name: 'Grass' },
      { name: 'Electric' },
      { name: 'Ice' },
      { name: 'Fighting' },
      { name: 'Poison' },
      { name: 'Ground' },
      { name: 'Flying' },
      { name: 'Psychic' },
      { name: 'Bug' },
      { name: 'Rock' },
      { name: 'Ghost' },
      { name: 'Dragon' },
      { name: 'Dark' },
      { name: 'Steel' },
      { name: 'Fairy' },
    ],
  });

  // Récupérer les types pour les créer avec les cartes
  const fireType = await prisma.type.findUnique({ where: { name: 'Fire' } });
  const waterType = await prisma.type.findUnique({ where: { name: 'Water' } });
  const grassType = await prisma.type.findUnique({ where: { name: 'Grass' } });
  const electricType = await prisma.type.findUnique({ where: { name: 'Electric' } });
  const normalType = await prisma.type.findUnique({ where: { name: 'Normal' } });

  // Créer des cartes Pokémon
  await prisma.pokemonCard.createMany({
    data: [
      {
        name: 'Charizard',
        pokedexId: 6,
        typeId: fireType!.id,
        lifePoints: 78,
        size: 1.7,
        weight: 90.5,
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/6.png',
      },
      {
        name: 'Blastoise',
        pokedexId: 9,
        typeId: waterType!.id,
        lifePoints: 79,
        size: 1.6,
        weight: 85.5,
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/9.png',
      },
      {
        name: 'Venusaur',
        pokedexId: 3,
        typeId: grassType!.id,
        lifePoints: 80,
        size: 2.0,
        weight: 100.0,
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/3.png',
      },
      {
        name: 'Pikachu',
        pokedexId: 25,
        typeId: electricType!.id,
        lifePoints: 35,
        size: 0.4,
        weight: 6.0,
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/25.png',
      },
      {
        name: 'Dragonite',
        pokedexId: 149,
        typeId: normalType!.id,
        lifePoints: 91,
        size: 2.2,
        weight: 210.0,
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/149.png',
      },
    ],
  });

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
