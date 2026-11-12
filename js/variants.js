"use strict";

/**
 * Alternate forms for the sample species.
 *
 * Names and types come from PokeAPI species varieties and English form
 * names. Artwork is that variety's Pokémon HOME sprite (the variety's
 * Pokémon id, not the species id). Placeholder ball cards live in
 * js/sample-cards.js. Nothing here scores a match.
 *
 * Display names:
 * - Use the English form name when it already names the Pokémon
 *   ("Mega Charizard X").
 * - "Alolan Form" becomes "Alolan {species}".
 * - "Gigantamax Form" becomes "Gigantamax {species}".
 * - A cap form name becomes "{form name} Pikachu".
 *
 * Female artwork is not a variety. It is included only where PokeAPI marks
 * has_gender_differences and the HOME female sprite exists. The label is
 * "Female {species}".
 *
 * Varieties with no HOME sprite are omitted (Pikachu's cosplay costumes,
 * the Let's Go Pikachu starter, and the Let's Go Eevee starter).
 */

const FORMS = [
  {
    id: 10034,
    slug: "charizard-mega-x",
    name: "Mega Charizard X",
    types: ["fire", "dragon"],
    family: "charmander",
    baseId: 6,
    speciesId: 6,
    speciesName: "Charizard",
    dex: 6,
  },
  {
    id: 10035,
    slug: "charizard-mega-y",
    name: "Mega Charizard Y",
    types: ["fire", "flying"],
    family: "charmander",
    baseId: 6,
    speciesId: 6,
    speciesName: "Charizard",
    dex: 6,
  },
  {
    id: 10196,
    slug: "charizard-gmax",
    name: "Gigantamax Charizard",
    types: ["fire", "flying"],
    family: "charmander",
    baseId: 6,
    speciesId: 6,
    speciesName: "Charizard",
    dex: 6,
  },
  {
    id: "pikachu-female",
    slug: "pikachu-female",
    name: "Female Pikachu",
    types: ["electric"],
    family: "pichu",
    baseId: 25,
    speciesId: 25,
    speciesName: "Pikachu",
    dex: 25,
    spriteId: 25,
    spriteGroup: "female",
  },
  {
    id: 10094,
    slug: "pikachu-original-cap",
    name: "Original Cap Pikachu",
    types: ["electric"],
    family: "pichu",
    baseId: 25,
    speciesId: 25,
    speciesName: "Pikachu",
    dex: 25,
  },
  {
    id: 10095,
    slug: "pikachu-hoenn-cap",
    name: "Hoenn Cap Pikachu",
    types: ["electric"],
    family: "pichu",
    baseId: 25,
    speciesId: 25,
    speciesName: "Pikachu",
    dex: 25,
  },
  {
    id: 10096,
    slug: "pikachu-sinnoh-cap",
    name: "Sinnoh Cap Pikachu",
    types: ["electric"],
    family: "pichu",
    baseId: 25,
    speciesId: 25,
    speciesName: "Pikachu",
    dex: 25,
  },
  {
    id: 10097,
    slug: "pikachu-unova-cap",
    name: "Unova Cap Pikachu",
    types: ["electric"],
    family: "pichu",
    baseId: 25,
    speciesId: 25,
    speciesName: "Pikachu",
    dex: 25,
  },
  {
    id: 10098,
    slug: "pikachu-kalos-cap",
    name: "Kalos Cap Pikachu",
    types: ["electric"],
    family: "pichu",
    baseId: 25,
    speciesId: 25,
    speciesName: "Pikachu",
    dex: 25,
  },
  {
    id: 10099,
    slug: "pikachu-alola-cap",
    name: "Alola Cap Pikachu",
    types: ["electric"],
    family: "pichu",
    baseId: 25,
    speciesId: 25,
    speciesName: "Pikachu",
    dex: 25,
  },
  {
    id: 10148,
    slug: "pikachu-partner-cap",
    name: "Partner Cap Pikachu",
    types: ["electric"],
    family: "pichu",
    baseId: 25,
    speciesId: 25,
    speciesName: "Pikachu",
    dex: 25,
  },
  {
    id: 10160,
    slug: "pikachu-world-cap",
    name: "World Cap Pikachu",
    types: ["electric"],
    family: "pichu",
    baseId: 25,
    speciesId: 25,
    speciesName: "Pikachu",
    dex: 25,
  },
  {
    id: 10199,
    slug: "pikachu-gmax",
    name: "Gigantamax Pikachu",
    types: ["electric"],
    family: "pichu",
    baseId: 25,
    speciesId: 25,
    speciesName: "Pikachu",
    dex: 25,
  },
  {
    id: 10103,
    slug: "vulpix-alola",
    name: "Alolan Vulpix",
    types: ["ice"],
    family: "vulpix-alola",
    baseId: 10103,
    speciesId: 37,
    speciesName: "Vulpix",
    dex: 37,
  },
  {
    id: 10104,
    slug: "ninetales-alola",
    name: "Alolan Ninetales",
    types: ["ice", "fairy"],
    family: "vulpix-alola",
    baseId: 10104,
    speciesId: 38,
    speciesName: "Ninetales",
    dex: 38,
  },
  {
    id: "raichu-female",
    slug: "raichu-female",
    name: "Female Raichu",
    types: ["electric"],
    family: "pichu",
    baseId: 26,
    speciesId: 26,
    speciesName: "Raichu",
    dex: 26,
    spriteId: 26,
    spriteGroup: "female",
  },
  {
    id: 10100,
    slug: "raichu-alola",
    name: "Alolan Raichu",
    types: ["electric", "psychic"],
    family: "pichu",
    baseId: 26,
    speciesId: 26,
    speciesName: "Raichu",
    dex: 26,
  },
  {
    id: 10304,
    slug: "raichu-mega-x",
    name: "Mega Raichu X",
    types: ["electric"],
    family: "pichu",
    baseId: 26,
    speciesId: 26,
    speciesName: "Raichu",
    dex: 26,
  },
  {
    id: 10305,
    slug: "raichu-mega-y",
    name: "Mega Raichu Y",
    types: ["electric"],
    family: "pichu",
    baseId: 26,
    speciesId: 26,
    speciesName: "Raichu",
    dex: 26,
  },
  {
    id: "venusaur-female",
    slug: "venusaur-female",
    name: "Female Venusaur",
    types: ["grass", "poison"],
    family: "bulbasaur",
    baseId: 3,
    speciesId: 3,
    speciesName: "Venusaur",
    dex: 3,
    spriteId: 3,
    spriteGroup: "female",
  },
  {
    id: 10033,
    slug: "venusaur-mega",
    name: "Mega Venusaur",
    types: ["grass", "poison"],
    family: "bulbasaur",
    baseId: 3,
    speciesId: 3,
    speciesName: "Venusaur",
    dex: 3,
  },
  {
    id: 10195,
    slug: "venusaur-gmax",
    name: "Gigantamax Venusaur",
    types: ["grass", "poison"],
    family: "bulbasaur",
    baseId: 3,
    speciesId: 3,
    speciesName: "Venusaur",
    dex: 3,
  },
  {
    id: 10038,
    slug: "gengar-mega",
    name: "Mega Gengar",
    types: ["ghost", "poison"],
    family: "gastly",
    baseId: 94,
    speciesId: 94,
    speciesName: "Gengar",
    dex: 94,
  },
  {
    id: 10202,
    slug: "gengar-gmax",
    name: "Gigantamax Gengar",
    types: ["ghost", "poison"],
    family: "gastly",
    baseId: 94,
    speciesId: 94,
    speciesName: "Gengar",
    dex: 94,
  },
  {
    id: 10204,
    slug: "lapras-gmax",
    name: "Gigantamax Lapras",
    types: ["water", "ice"],
    family: "lapras",
    baseId: 131,
    speciesId: 131,
    speciesName: "Lapras",
    dex: 131,
  },
  {
    id: "eevee-female",
    slug: "eevee-female",
    name: "Female Eevee",
    types: ["normal"],
    family: "eevee",
    baseId: 133,
    speciesId: 133,
    speciesName: "Eevee",
    dex: 133,
    spriteId: 133,
    spriteGroup: "female",
  },
  {
    id: 10205,
    slug: "eevee-gmax",
    name: "Gigantamax Eevee",
    types: ["normal"],
    family: "eevee",
    baseId: 133,
    speciesId: 133,
    speciesName: "Eevee",
    dex: 133,
  },
  {
    id: 10147,
    slug: "magearna-original",
    name: "Original Color Magearna",
    types: ["steel", "fairy"],
    family: "magearna",
    baseId: 801,
    speciesId: 801,
    speciesName: "Magearna",
    dex: 801,
  },
  {
    id: 10192,
    slug: "zarude-dada",
    name: "Dada Zarude",
    types: ["dark", "grass"],
    family: "zarude",
    baseId: 893,
    speciesId: 893,
    speciesName: "Zarude",
    dex: 893,
  },
];

for (const pokemon of POKEDEX) {
  pokemon.speciesId = pokemon.id;
  pokemon.baseId = pokemon.id;
  pokemon.dex = pokemon.id;
  pokemon.speciesName = pokemon.name;
}

FAMILIES["vulpix-alola"] = {
  shape: "line",
  ids: [10103, 10104],
  note: "Every stage from Alolan Vulpix to Alolan Ninetales, with sample ball cards.",
};

for (const form of FORMS) {
  POKEDEX.push(form);
}

POKEDEX.sort((a, b) => {
  if (a.dex !== b.dex) return a.dex - b.dex;
  const aBase = a.id === a.speciesId ? 0 : 1;
  const bBase = b.id === b.speciesId ? 0 : 1;
  return aBase - bBase || a.name.localeCompare(b.name);
});
