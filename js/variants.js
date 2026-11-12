"use strict";

/**
 * Alternate forms for the sample species.
 *
 * Names and types come from PokeAPI species varieties and English form
 * names. Artwork is that variety's Pokémon HOME sprite (the variety's
 * Pokémon id, not the species id). Ball cards are placeholder copy, the
 * same kind of sample as js/evolutions.js. Nothing here scores a match.
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

function cards(ball, name, reason) {
  return { ball, name, reason };
}

// Shared placeholder trio for Pikachu's cap forms. Not a matcher.
function capCards(label) {
  return [
    cards("quick-ball", "Quick Ball", `Matches ${label}'s yellow, electric vibe`),
    cards("fast-ball", "Fast Ball", `Matches ${label}'s bright, energetic look`),
    cards("love-ball", "Love Ball", `Matches ${label}'s cute, costumed vibe`),
  ];
}

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
    cards: [
      cards("dusk-ball", "Dusk Ball", "Matches Mega Charizard X's blue-black look"),
      cards("luxury-ball", "Luxury Ball", "Matches Mega Charizard X's dark, sleek vibe"),
      cards("ultra-ball", "Ultra Ball", "Matches Mega Charizard X's bold black and yellow"),
    ],
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
    cards: [
      cards("fast-ball", "Fast Ball", "Matches Mega Charizard Y's orange, fiery vibe"),
      cards("repeat-ball", "Repeat Ball", "Matches Mega Charizard Y's red, blazing look"),
      cards("level-ball", "Level Ball", "Matches Mega Charizard Y's red and yellow wings"),
    ],
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
    cards: [
      cards("fast-ball", "Fast Ball", "Matches Gigantamax Charizard's huge orange flame"),
      cards("repeat-ball", "Repeat Ball", "Matches Gigantamax Charizard's red blaze"),
      cards("level-ball", "Level Ball", "Matches Gigantamax Charizard's red and yellow look"),
    ],
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
    cards: [
      cards("quick-ball", "Quick Ball", "Matches Female Pikachu's yellow, electric vibe"),
      cards("love-ball", "Love Ball", "Matches Female Pikachu's heart-tipped tail"),
      cards("heal-ball", "Heal Ball", "Matches Female Pikachu's pink, cute look"),
    ],
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
    cards: capCards("Original Cap Pikachu"),
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
    cards: capCards("Hoenn Cap Pikachu"),
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
    cards: capCards("Sinnoh Cap Pikachu"),
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
    cards: capCards("Unova Cap Pikachu"),
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
    cards: capCards("Kalos Cap Pikachu"),
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
    cards: capCards("Alola Cap Pikachu"),
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
    cards: capCards("Partner Cap Pikachu"),
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
    cards: capCards("World Cap Pikachu"),
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
    cards: [
      cards("quick-ball", "Quick Ball", "Matches Gigantamax Pikachu's huge yellow look"),
      cards("fast-ball", "Fast Ball", "Matches Gigantamax Pikachu's energetic vibe"),
      cards("love-ball", "Love Ball", "Matches Gigantamax Pikachu's bright, cute vibe"),
    ],
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
    cards: [
      cards("dive-ball", "Dive Ball", "Matches Alolan Vulpix's icy blue vibe"),
      cards("premier-ball", "Premier Ball", "Matches Alolan Vulpix's pale, frosted look"),
      cards("luxury-ball", "Luxury Ball", "Matches Alolan Vulpix's sleek white coat"),
    ],
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
    cards: [
      cards("dive-ball", "Dive Ball", "Matches Alolan Ninetales's icy blue mane"),
      cards("moon-ball", "Moon Ball", "Matches Alolan Ninetales's mystical vibe"),
      cards("dream-ball", "Dream Ball", "Matches Alolan Ninetales's pale, fairy frost"),
    ],
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
    cards: [
      cards("quick-ball", "Quick Ball", "Matches Female Raichu's orange, electric vibe"),
      cards("ultra-ball", "Ultra Ball", "Matches Female Raichu's bold yellow look"),
      cards("fast-ball", "Fast Ball", "Matches Female Raichu's energetic vibe"),
    ],
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
    cards: [
      cards("dream-ball", "Dream Ball", "Matches Alolan Raichu's psychic, dreamy vibe"),
      cards("quick-ball", "Quick Ball", "Matches Alolan Raichu's yellow, electric look"),
      cards("luxury-ball", "Luxury Ball", "Matches Alolan Raichu's sleek, floating vibe"),
    ],
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
    cards: [
      cards("quick-ball", "Quick Ball", "Matches Mega Raichu X's electric vibe"),
      cards("ultra-ball", "Ultra Ball", "Matches Mega Raichu X's bold yellow and black"),
      cards("fast-ball", "Fast Ball", "Matches Mega Raichu X's energetic look"),
    ],
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
    cards: [
      cards("quick-ball", "Quick Ball", "Matches Mega Raichu Y's electric vibe"),
      cards("love-ball", "Love Ball", "Matches Mega Raichu Y's bright look"),
      cards("fast-ball", "Fast Ball", "Matches Mega Raichu Y's energetic look"),
    ],
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
    cards: [
      cards("friend-ball", "Friend Ball", "Matches Female Venusaur's deep green, floral vibe"),
      cards("safari-ball", "Safari Ball", "Matches Female Venusaur's wild, jungle vibe"),
      cards("nest-ball", "Nest Ball", "Matches Female Venusaur's broad, leafy vibe"),
    ],
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
    cards: [
      cards("friend-ball", "Friend Ball", "Matches Mega Venusaur's deep green, floral vibe"),
      cards("safari-ball", "Safari Ball", "Matches Mega Venusaur's huge jungle look"),
      cards("nest-ball", "Nest Ball", "Matches Mega Venusaur's broad, leafy vibe"),
    ],
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
    cards: [
      cards("friend-ball", "Friend Ball", "Matches Gigantamax Venusaur's giant flower"),
      cards("safari-ball", "Safari Ball", "Matches Gigantamax Venusaur's wild, jungle vibe"),
      cards("nest-ball", "Nest Ball", "Matches Gigantamax Venusaur's broad, leafy look"),
    ],
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
    cards: [
      cards("dusk-ball", "Dusk Ball", "Matches Mega Gengar's purple, ghostly vibe"),
      cards("moon-ball", "Moon Ball", "Matches Mega Gengar's lunar, night-time vibe"),
      cards("dream-ball", "Dream Ball", "Matches Mega Gengar's purple, dreamy look"),
    ],
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
    cards: [
      cards("dusk-ball", "Dusk Ball", "Matches Gigantamax Gengar's huge purple grin"),
      cards("moon-ball", "Moon Ball", "Matches Gigantamax Gengar's night-time vibe"),
      cards("dream-ball", "Dream Ball", "Matches Gigantamax Gengar's dreamy, ghostly look"),
    ],
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
    cards: [
      cards("dive-ball", "Dive Ball", "Matches Gigantamax Lapras's blue, aquatic vibe"),
      cards("lure-ball", "Lure Ball", "Matches Gigantamax Lapras's ocean look"),
      cards("net-ball", "Net Ball", "Matches Gigantamax Lapras's watery shell"),
    ],
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
    cards: [
      cards("love-ball", "Love Ball", "Matches Female Eevee's brown, cute vibe"),
      cards("luxury-ball", "Luxury Ball", "Matches Female Eevee's warm, soft coat"),
      cards("nest-ball", "Nest Ball", "Matches Female Eevee's small, fluffy look"),
    ],
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
    cards: [
      cards("love-ball", "Love Ball", "Matches Gigantamax Eevee's huge, fluffy vibe"),
      cards("luxury-ball", "Luxury Ball", "Matches Gigantamax Eevee's warm coat"),
      cards("nest-ball", "Nest Ball", "Matches Gigantamax Eevee's soft, bushy look"),
    ],
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
  SAMPLE_CARDS[form.id] = form.cards;
  POKEDEX.push(form);
}

POKEDEX.sort((a, b) => {
  if (a.dex !== b.dex) return a.dex - b.dex;
  const aBase = a.id === a.speciesId ? 0 : 1;
  const bBase = b.id === b.speciesId ? 0 : 1;
  return aBase - bBase || a.name.localeCompare(b.name);
});
