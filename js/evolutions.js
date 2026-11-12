"use strict";

/**
 * Hard-coded sample families for the layout mockup.
 *
 * Names and National Dex numbers follow PokeAPI species data. Evolution
 * order follows the PokeAPI evolution chains for these families. Artwork
 * is the Pokémon HOME sprite for that National Dex id.
 * Alternate forms live in js/variants.js.
 * Placeholder ball cards live in js/sample-cards.js. Nothing here scores
 * a Pokémon against a ball.
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
