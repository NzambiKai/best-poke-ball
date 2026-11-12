"use strict";

/**
 * Hard-coded sample content for the layout mockup.
 *
 * Families, names, and the ball cards under each stage are placeholder copy
 * for the samples. Nothing here scores a Pokémon against a ball. Matching
 * stays in js/balls.js for a later pass, and the page still does not read
 * that file.
 *
 * Names and National Dex numbers follow PokeAPI species data. Evolution
 * order follows the PokeAPI evolution chains for these families. Artwork
 * is the Pokémon HOME sprite for that National Dex id.
 * Alternate forms live in js/variants.js and are still placeholder cards.
 */

const POKEDEX = [
  { id: 1, slug: "bulbasaur", name: "Bulbasaur", types: ["grass", "poison"], family: "bulbasaur" },
  { id: 2, slug: "ivysaur", name: "Ivysaur", types: ["grass", "poison"], family: "bulbasaur" },
  { id: 3, slug: "venusaur", name: "Venusaur", types: ["grass", "poison"], family: "bulbasaur" },
  { id: 4, slug: "charmander", name: "Charmander", types: ["fire"], family: "charmander" },
  { id: 5, slug: "charmeleon", name: "Charmeleon", types: ["fire"], family: "charmander" },
  { id: 6, slug: "charizard", name: "Charizard", types: ["fire", "flying"], family: "charmander" },
  { id: 25, slug: "pikachu", name: "Pikachu", types: ["electric"], family: "pichu" },
  { id: 26, slug: "raichu", name: "Raichu", types: ["electric"], family: "pichu" },
  { id: 37, slug: "vulpix", name: "Vulpix", types: ["fire"], family: "vulpix" },
  { id: 38, slug: "ninetales", name: "Ninetales", types: ["fire"], family: "vulpix" },
  { id: 92, slug: "gastly", name: "Gastly", types: ["ghost", "poison"], family: "gastly" },
  { id: 93, slug: "haunter", name: "Haunter", types: ["ghost", "poison"], family: "gastly" },
  { id: 94, slug: "gengar", name: "Gengar", types: ["ghost", "poison"], family: "gastly" },
  { id: 131, slug: "lapras", name: "Lapras", types: ["water", "ice"], family: "lapras" },
  { id: 133, slug: "eevee", name: "Eevee", types: ["normal"], family: "eevee" },
  { id: 134, slug: "vaporeon", name: "Vaporeon", types: ["water"], family: "eevee" },
  { id: 135, slug: "jolteon", name: "Jolteon", types: ["electric"], family: "eevee" },
  { id: 136, slug: "flareon", name: "Flareon", types: ["fire"], family: "eevee" },
  { id: 172, slug: "pichu", name: "Pichu", types: ["electric"], family: "pichu" },
  { id: 196, slug: "espeon", name: "Espeon", types: ["psychic"], family: "eevee" },
  { id: 197, slug: "umbreon", name: "Umbreon", types: ["dark"], family: "eevee" },
  { id: 470, slug: "leafeon", name: "Leafeon", types: ["grass"], family: "eevee" },
  { id: 471, slug: "glaceon", name: "Glaceon", types: ["ice"], family: "eevee" },
  { id: 700, slug: "sylveon", name: "Sylveon", types: ["fairy"], family: "eevee" },
  { id: 801, slug: "magearna", name: "Magearna", types: ["steel", "fairy"], family: "magearna" },
  { id: 893, slug: "zarude", name: "Zarude", types: ["dark", "grass"], family: "zarude" },
];

const FAMILIES = {
  bulbasaur: {
    shape: "line",
    ids: [1, 2, 3],
    note: "Every stage from Bulbasaur to Venusaur, with sample ball cards.",
  },
  charmander: {
    shape: "line",
    ids: [4, 5, 6],
    note: "Every stage from Charmander to Charizard, with sample ball cards.",
  },
  pichu: {
    shape: "line",
    ids: [172, 25, 26],
    note: "Every stage from Pichu to Raichu, with sample ball cards.",
  },
  vulpix: {
    shape: "line",
    ids: [37, 38],
    note: "Every stage from Vulpix to Ninetales, with sample ball cards.",
  },
  gastly: {
    shape: "line",
    ids: [92, 93, 94],
    note: "Every stage from Gastly to Gengar, with sample ball cards.",
  },
  lapras: {
    shape: "single",
    ids: [131],
    note: "Lapras does not evolve. This single stage is the whole family, with sample ball cards.",
  },
  eevee: {
    shape: "branch",
    base: 133,
    branches: [134, 135, 136, 196, 197, 470, 471, 700],
    note: "Eevee branches into eight evolutions. Each stage has its own sample ball cards.",
  },
  magearna: {
    shape: "single",
    ids: [801],
    note: "Magearna does not evolve. This single stage is the whole family, with sample ball cards.",
  },
  zarude: {
    shape: "single",
    ids: [893],
    note: "Zarude does not evolve. This single stage is the whole family, with sample ball cards.",
  },
};

// Placeholder reasons. Keyed by National Dex id. Not a match result.
const SAMPLE_CARDS = {
  1: [
    { ball: "friend-ball", name: "Friend Ball", reason: "Matches Bulbasaur's green, grassy vibe" },
    { ball: "nest-ball", name: "Nest Ball", reason: "Matches Bulbasaur's small, garden vibe" },
    { ball: "safari-ball", name: "Safari Ball", reason: "Matches Bulbasaur's wild, leafy vibe" },
  ],
  2: [
    { ball: "friend-ball", name: "Friend Ball", reason: "Matches Ivysaur's green, budding vibe" },
    { ball: "nest-ball", name: "Nest Ball", reason: "Matches Ivysaur's leafy, growing vibe" },
    { ball: "safari-ball", name: "Safari Ball", reason: "Matches Ivysaur's deeper forest vibe" },
  ],
  3: [
    { ball: "friend-ball", name: "Friend Ball", reason: "Matches Venusaur's deep green, floral vibe" },
    { ball: "safari-ball", name: "Safari Ball", reason: "Matches Venusaur's wild, jungle vibe" },
    { ball: "nest-ball", name: "Nest Ball", reason: "Matches Venusaur's broad, leafy vibe" },
  ],
  4: [
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Charmander's orange, fiery vibe" },
    { ball: "repeat-ball", name: "Repeat Ball", reason: "Matches Charmander's red, warm vibe" },
    { ball: "level-ball", name: "Level Ball", reason: "Matches Charmander's red and yellow flame" },
  ],
  5: [
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Charmeleon's red, fiery vibe" },
    { ball: "repeat-ball", name: "Repeat Ball", reason: "Matches Charmeleon's hot, fierce vibe" },
    { ball: "level-ball", name: "Level Ball", reason: "Matches Charmeleon's red and yellow look" },
  ],
  6: [
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Charizard's orange, fiery vibe" },
    { ball: "repeat-ball", name: "Repeat Ball", reason: "Matches Charizard's red, blazing vibe" },
    { ball: "level-ball", name: "Level Ball", reason: "Matches Charizard's red and yellow look" },
  ],
  25: [
    { ball: "quick-ball", name: "Quick Ball", reason: "Matches Pikachu's yellow, electric vibe" },
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Pikachu's yellow, energetic vibe" },
    { ball: "love-ball", name: "Love Ball", reason: "Matches Pikachu's bright, cute vibe" },
  ],
  26: [
    { ball: "quick-ball", name: "Quick Ball", reason: "Matches Raichu's orange, electric vibe" },
    { ball: "ultra-ball", name: "Ultra Ball", reason: "Matches Raichu's bold yellow and brown look" },
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Raichu's energetic vibe" },
  ],
  37: [
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Vulpix's orange, fiery vibe" },
    { ball: "repeat-ball", name: "Repeat Ball", reason: "Matches Vulpix's warm, fox-fire look" },
    { ball: "level-ball", name: "Level Ball", reason: "Matches Vulpix's red and cream tails" },
  ],
  38: [
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Ninetales's golden, fiery vibe" },
    { ball: "luxury-ball", name: "Luxury Ball", reason: "Matches Ninetales's elegant, flowing look" },
    { ball: "repeat-ball", name: "Repeat Ball", reason: "Matches Ninetales's warm, fox-fire look" },
  ],
  92: [
    { ball: "dusk-ball", name: "Dusk Ball", reason: "Matches Gastly's purple, ghostly vibe" },
    { ball: "dream-ball", name: "Dream Ball", reason: "Matches Gastly's hazy, spooky vibe" },
    { ball: "moon-ball", name: "Moon Ball", reason: "Matches Gastly's night-time vibe" },
  ],
  93: [
    { ball: "dusk-ball", name: "Dusk Ball", reason: "Matches Haunter's purple, ghostly vibe" },
    { ball: "dream-ball", name: "Dream Ball", reason: "Matches Haunter's mischievous, dreamy vibe" },
    { ball: "moon-ball", name: "Moon Ball", reason: "Matches Haunter's night-time vibe" },
  ],
  94: [
    { ball: "dusk-ball", name: "Dusk Ball", reason: "Matches Gengar's purple, ghostly vibe" },
    { ball: "moon-ball", name: "Moon Ball", reason: "Matches Gengar's lunar, night-time vibe" },
    { ball: "dream-ball", name: "Dream Ball", reason: "Matches Gengar's purple, dreamy vibe" },
  ],
  131: [
    { ball: "dive-ball", name: "Dive Ball", reason: "Matches Lapras's blue, aquatic vibe" },
    { ball: "lure-ball", name: "Lure Ball", reason: "Matches Lapras's blue, ocean vibe" },
    { ball: "net-ball", name: "Net Ball", reason: "Matches Lapras's blue, watery vibe" },
  ],
  133: [
    { ball: "love-ball", name: "Love Ball", reason: "Matches Eevee's brown, cute vibe" },
    { ball: "luxury-ball", name: "Luxury Ball", reason: "Matches Eevee's warm, soft coat" },
    { ball: "nest-ball", name: "Nest Ball", reason: "Matches Eevee's small, fluffy vibe" },
  ],
  134: [
    { ball: "dive-ball", name: "Dive Ball", reason: "Matches Vaporeon's blue, aquatic vibe" },
    { ball: "lure-ball", name: "Lure Ball", reason: "Matches Vaporeon's ocean look" },
    { ball: "net-ball", name: "Net Ball", reason: "Matches Vaporeon's watery fins" },
  ],
  135: [
    { ball: "quick-ball", name: "Quick Ball", reason: "Matches Jolteon's yellow, electric vibe" },
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Jolteon's spiky, energetic look" },
    { ball: "ultra-ball", name: "Ultra Ball", reason: "Matches Jolteon's sharp yellow and white" },
  ],
  136: [
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Flareon's orange, fiery vibe" },
    { ball: "repeat-ball", name: "Repeat Ball", reason: "Matches Flareon's warm, fluffy flame" },
    { ball: "level-ball", name: "Level Ball", reason: "Matches Flareon's red and cream coat" },
  ],
  172: [
    { ball: "quick-ball", name: "Quick Ball", reason: "Matches Pichu's yellow, sparking vibe" },
    { ball: "love-ball", name: "Love Ball", reason: "Matches Pichu's tiny, cute vibe" },
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Pichu's yellow, energetic vibe" },
  ],
  196: [
    { ball: "dream-ball", name: "Dream Ball", reason: "Matches Espeon's lilac, psychic vibe" },
    { ball: "luxury-ball", name: "Luxury Ball", reason: "Matches Espeon's sleek, elegant look" },
    { ball: "moon-ball", name: "Moon Ball", reason: "Matches Espeon's red gem and night-soft vibe" },
  ],
  197: [
    { ball: "moon-ball", name: "Moon Ball", reason: "Matches Umbreon's black, lunar vibe" },
    { ball: "luxury-ball", name: "Luxury Ball", reason: "Matches Umbreon's sleek, night-time look" },
    { ball: "dusk-ball", name: "Dusk Ball", reason: "Matches Umbreon's dark, dusk vibe" },
  ],
  470: [
    { ball: "friend-ball", name: "Friend Ball", reason: "Matches Leafeon's green, leafy vibe" },
    { ball: "nest-ball", name: "Nest Ball", reason: "Matches Leafeon's mossy, forest look" },
    { ball: "safari-ball", name: "Safari Ball", reason: "Matches Leafeon's wild, grassy vibe" },
  ],
  471: [
    { ball: "dive-ball", name: "Dive Ball", reason: "Matches Glaceon's icy blue vibe" },
    { ball: "premier-ball", name: "Premier Ball", reason: "Matches Glaceon's pale, frosted look" },
    { ball: "luxury-ball", name: "Luxury Ball", reason: "Matches Glaceon's sleek, cool coat" },
  ],
  700: [
    { ball: "love-ball", name: "Love Ball", reason: "Matches Sylveon's pink, cute vibe" },
    { ball: "heal-ball", name: "Heal Ball", reason: "Matches Sylveon's soft, ribboned look" },
    { ball: "dream-ball", name: "Dream Ball", reason: "Matches Sylveon's pink, fairy vibe" },
  ],
  801: [
    { ball: "love-ball", name: "Love Ball", reason: "Matches Magearna's pink, crafted vibe" },
    { ball: "luxury-ball", name: "Luxury Ball", reason: "Matches Magearna's elegant, gilded look" },
    { ball: "dream-ball", name: "Dream Ball", reason: "Matches Magearna's soft, fairy colors" },
  ],
  893: [
    { ball: "dusk-ball", name: "Dusk Ball", reason: "Matches Zarude's dark, jungle vibe" },
    { ball: "friend-ball", name: "Friend Ball", reason: "Matches Zarude's green, leafy look" },
    { ball: "safari-ball", name: "Safari Ball", reason: "Matches Zarude's wild, forest vibe" },
  ],
};
