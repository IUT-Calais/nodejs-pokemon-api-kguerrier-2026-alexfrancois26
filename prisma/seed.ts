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


  // Créer des cartes Pokémon
  await prisma.pokemonCard.create({
    data: {
      name: 'Charizard',
      pokedexId: 6,
      type: { connect: { name: 'Fire' } },
      lifePoints: 78,
      size: 1.7,
      weight: 90.5,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/6.png',
    },
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Blastoise',
      pokedexId: 9,
      type: { connect: { name: 'Water' } },
      lifePoints: 79,
      size: 1.6,
      weight: 85.5,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/9.png',
    },
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Venusaur',
      pokedexId: 3,
      type: { connect: { name: 'Grass' } },
      lifePoints: 80,
      size: 2.0,
      weight: 100.0,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/3.png',
    },
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Pikachu',
      pokedexId: 25,
      type: { connect: { name: 'Electric' } },
      lifePoints: 35,
      size: 0.4,
      weight: 6.0,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/25.png',
    },
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Dragonite',
      pokedexId: 149,
      type: { connect: { name: 'Dragon' } },
      lifePoints: 91,
      size: 2.2,
      weight: 210.0,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/149.png',
    },
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Arcanine',
      pokedexId: 59,
      type: { connect: { name: 'Fire' } },
      lifePoints: 90,
      size: 1.9,
      weight: 155.0,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/59.png',
    },
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Gyarados',
      pokedexId: 130,
      type: { connect: { name: 'Water' } },
      lifePoints: 95,
      size: 6.5,
      weight: 235.0,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/130.png',
    },
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Articuno',
      pokedexId: 144,
      type: { connect: { name: 'Ice' } },
      lifePoints: 90,
      size: 1.7,
      weight: 55.4,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/144.png',
    },
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Zapdos',
      pokedexId: 145,
      type: { connect: { name: 'Electric' } },
      lifePoints: 90,
      size: 1.6,
      weight: 52.6,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/145.png',
    },
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Moltres',
      pokedexId: 146,
      type: { connect: { name: 'Fire' } },
      lifePoints: 90,
      size: 2.0,
      weight: 55.0,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/146.png',
    },
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Mewtwo',
      pokedexId: 150,
      type: { connect: { name: 'Psychic' } },
      lifePoints: 106,
      size: 2.0,
      weight: 122.0,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/150.png',
    },
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Mew',
      pokedexId: 151,
      type: { connect: { name: 'Psychic' } },
      lifePoints: 100,
      size: 0.4,
      weight: 4.0,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/151.png',
    },
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Butterfree',
      pokedexId: 12,
      type: { connect: { name: 'Bug' } },
      lifePoints: 60,
      size: 1.1,
      weight: 32.0,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/12.png',
    },
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Machamp',
      pokedexId: 68,
      type: { connect: { name: 'Fighting' } },
      lifePoints: 90,
      size: 1.6,
      weight: 130.0,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/68.png',
    },
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Golem',
      pokedexId: 76,
      type: { connect: { name: 'Rock' } },
      lifePoints: 80,
      size: 1.4,
      weight: 300.0,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/76.png',
    },
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Gengar',
      pokedexId: 94,
      type: { connect: { name: 'Ghost' } },
      lifePoints: 60,
      size: 1.5,
      weight: 40.5,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/94.png',
    },
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Lapras',
      pokedexId: 131,
      type: { connect: { name: 'Water' } },
      lifePoints: 130,
      size: 2.5,
      weight: 220.0,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/131.png',
    },
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Snorlax',
      pokedexId: 143,
      type: { connect: { name: 'Normal' } },
      lifePoints: 150,
      size: 2.1,
      weight: 460.0,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/143.png',
    },
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Alakazam',
      pokedexId: 65,
      type: { connect: { name: 'Psychic' } },
      lifePoints: 55,
      size: 1.5,
      weight: 48.0,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/65.png',
    },
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Dragonair',
      pokedexId: 148,
      type: { connect: { name: 'Dragon' } },
      lifePoints: 61,
      size: 4.0,
      weight: 16.5,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/148.png',
    },
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Rhydon',
      pokedexId: 112,
      type: { connect: { name: 'Ground' } },
      lifePoints: 105,
      size: 1.9,
      weight: 120.0,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/112.png',
    },
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Pidgeot',
      pokedexId: 18,
      type: { connect: { name: 'Flying' } },
      lifePoints: 83,
      size: 1.5,
      weight: 39.5,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/18.png',
    },
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Vileplume',
      pokedexId: 45,
      type: { connect: { name: 'Grass' } },
      lifePoints: 75,
      size: 1.2,
      weight: 18.6,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/45.png',
    },
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Victreebel',
      pokedexId: 71,
      type: { connect: { name: 'Grass' } },
      lifePoints: 80,
      size: 1.7,
      weight: 15.5,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/71.png',
    },
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Exeggutor',
      pokedexId: 103,
      type: { connect: { name: 'Grass' } },
      lifePoints: 95,
      size: 2.0,
      weight: 120.0,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/103.png',
    },
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Weezing',
      pokedexId: 110,
      type: { connect: { name: 'Poison' } },
      lifePoints: 90,
      size: 1.2,
      weight: 9.5,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/110.png',
    },
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Marowak',
      pokedexId: 105,
      type: { connect: { name: 'Ground' } },
      lifePoints: 75,
      size: 1.0,
      weight: 45.0,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/105.png',
    },
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Hypno',
      pokedexId: 97,
      type: { connect: { name: 'Psychic' } },
      lifePoints: 85,
      size: 1.6,
      weight: 75.6,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/97.png',
    },
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Cloyster',
      pokedexId: 91,
      type: { connect: { name: 'Water' } },
      lifePoints: 50,
      size: 1.5,
      weight: 132.5,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/91.png',
    },
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


