"use strict";

/**
 * Main-series Poké Ball catalogue. Hand-edited.
 *
 * The scorer reads this list. It is not a list of per-Pokémon picks.
 * Until that scorer is wired up, the page still shows the placeholder
 * cards in js/sample-cards.js and does not load this file.
 *
 * id is the PokeAPI item slug and the file name in assets/items/.
 * palette is the shell a person sees: the shared black outline and the
 * shine on the item icon are left out. Weights sum to 1.
 * themes describe that look. They are not catch bonuses.
 * matchable false keeps a ball out of the ranking. The Cherish Ball is
 * only shown for a form whose cherishOnly flag is true.
 *
 * Hisuian Poké, Great, and Ultra Balls are omitted: their shells repeat
 * the modern orange, blue-and-red, and yellow-and-slate balls. Strange
 * Ball is a fallback icon, not a look to recommend. Picnic toys and
 * held items are not catch balls.
 */

const BALLS = [
  {
    id: "poke-ball",
    name: "Poké Ball",
    palette: [
      { hex: "#ff943a", weight: 0.74 },
      { hex: "#ffffff", weight: 0.26 },
    ],
    themes: [],
  },
  {
    id: "great-ball",
    name: "Great Ball",
    palette: [
      { hex: "#3a94ff", weight: 0.64 },
      { hex: "#bd3131", weight: 0.28 },
      { hex: "#ffffff", weight: 0.08 },
    ],
    themes: [],
  },
  {
    id: "ultra-ball",
    name: "Ultra Ball",
    palette: [
      { hex: "#738494", weight: 0.52 },
      { hex: "#ffd63a", weight: 0.48 },
    ],
    themes: [],
  },
  {
    id: "master-ball",
    name: "Master Ball",
    palette: [
      { hex: "#b53af7", weight: 0.62 },
      { hex: "#e621c5", weight: 0.38 },
    ],
    themes: ["mystic"],
  },
  {
    id: "safari-ball",
    name: "Safari Ball",
    palette: [
      { hex: "#4a9463", weight: 0.55 },
      { hex: "#c5b53a", weight: 0.45 },
    ],
    themes: ["forest"],
  },
  {
    id: "sport-ball",
    name: "Sport Ball",
    palette: [
      { hex: "#ff943a", weight: 0.58 },
      { hex: "#ffffff", weight: 0.27 },
      { hex: "#de5a3a", weight: 0.15 },
    ],
    themes: [],
  },
  {
    id: "fast-ball",
    name: "Fast Ball",
    palette: [
      { hex: "#ef8c42", weight: 0.62 },
      { hex: "#f7ce3a", weight: 0.38 },
    ],
    themes: ["fire"],
  },
  {
    id: "level-ball",
    name: "Level Ball",
    palette: [
      { hex: "#efbd94", weight: 0.46 },
      { hex: "#7b6b63", weight: 0.24 },
      { hex: "#de4a3a", weight: 0.3 },
    ],
    themes: [],
  },
  {
    id: "lure-ball",
    name: "Lure Ball",
    palette: [
      { hex: "#4ab5de", weight: 0.58 },
      { hex: "#de5a6b", weight: 0.42 },
    ],
    themes: ["water"],
  },
  {
    id: "heavy-ball",
    name: "Heavy Ball",
    palette: [
      { hex: "#94a5b5", weight: 0.64 },
      { hex: "#527bde", weight: 0.36 },
    ],
    themes: ["metal"],
  },
  {
    id: "love-ball",
    name: "Love Ball",
    palette: [
      { hex: "#ffc5e6", weight: 0.5 },
      { hex: "#de84b5", weight: 0.5 },
    ],
    themes: ["fairy", "cute"],
  },
  {
    id: "friend-ball",
    name: "Friend Ball",
    palette: [
      { hex: "#8cc53a", weight: 0.9 },
      { hex: "#ffffff", weight: 0.1 },
    ],
    themes: ["forest"],
  },
  {
    id: "moon-ball",
    name: "Moon Ball",
    palette: [
      { hex: "#6e8498", weight: 0.62 },
      { hex: "#4ac5ef", weight: 0.22 },
      { hex: "#f7ce42", weight: 0.16 },
    ],
    themes: ["night"],
  },
  {
    id: "net-ball",
    name: "Net Ball",
    palette: [
      { hex: "#4ab5c5", weight: 0.6 },
      { hex: "#7b7b84", weight: 0.4 },
    ],
    themes: ["water"],
  },
  {
    id: "dive-ball",
    name: "Dive Ball",
    palette: [
      { hex: "#8cceff", weight: 0.34 },
      { hex: "#5aa5ff", weight: 0.4 },
      { hex: "#ffffff", weight: 0.26 },
    ],
    themes: ["water", "ice"],
  },
  {
    id: "nest-ball",
    name: "Nest Ball",
    palette: [
      { hex: "#7bc53a", weight: 0.62 },
      { hex: "#e6e684", weight: 0.38 },
    ],
    themes: ["forest"],
  },
  {
    id: "repeat-ball",
    name: "Repeat Ball",
    palette: [
      { hex: "#ff943a", weight: 0.4 },
      { hex: "#de5a3a", weight: 0.32 },
      { hex: "#f7ef3a", weight: 0.28 },
    ],
    themes: [],
  },
  {
    id: "timer-ball",
    name: "Timer Ball",
    palette: [
      { hex: "#ffffff", weight: 0.55 },
      { hex: "#7b7b84", weight: 0.3 },
      { hex: "#de5a3a", weight: 0.15 },
    ],
    themes: [],
  },
  {
    id: "luxury-ball",
    name: "Luxury Ball",
    palette: [
      { hex: "#7b7b84", weight: 0.58 },
      { hex: "#d69c31", weight: 0.42 },
    ],
    themes: ["sleek"],
  },
  {
    id: "premier-ball",
    name: "Premier Ball",
    palette: [
      { hex: "#ffffff", weight: 0.93 },
      { hex: "#de5a3a", weight: 0.07 },
    ],
    themes: [],
  },
  {
    id: "dusk-ball",
    name: "Dusk Ball",
    palette: [
      { hex: "#3a8c32", weight: 0.46 },
      { hex: "#1c1c1c", weight: 0.42 },
      { hex: "#de4a00", weight: 0.12 },
    ],
    themes: ["night", "ghost"],
  },
  {
    id: "heal-ball",
    name: "Heal Ball",
    palette: [
      { hex: "#ff6bd6", weight: 0.64 },
      { hex: "#fff0d4", weight: 0.36 },
    ],
    themes: ["cute"],
  },
  {
    id: "quick-ball",
    name: "Quick Ball",
    palette: [
      { hex: "#ffe14a", weight: 0.52 },
      { hex: "#3aa0e8", weight: 0.48 },
    ],
    themes: ["electric"],
  },
  {
    id: "dream-ball",
    name: "Dream Ball",
    palette: [
      { hex: "#ffb5d6", weight: 0.55 },
      { hex: "#e86aaa", weight: 0.45 },
    ],
    themes: ["dream", "fairy"],
  },
  {
    id: "beast-ball",
    name: "Beast Ball",
    palette: [
      { hex: "#3a5ad6", weight: 0.55 },
      { hex: "#5a3af7", weight: 0.28 },
      { hex: "#efd63a", weight: 0.17 },
    ],
    themes: ["mystic"],
  },
  {
    id: "park-ball",
    name: "Park Ball",
    palette: [
      { hex: "#f7d652", weight: 0.64 },
      { hex: "#296bce", weight: 0.36 },
    ],
    themes: [],
  },
  {
    id: "cherish-ball",
    name: "Cherish Ball",
    palette: [
      { hex: "#ff4231", weight: 0.8 },
      { hex: "#ffffff", weight: 0.2 },
    ],
    themes: [],
    matchable: false,
  },
  {
    id: "lafeather-ball",
    name: "Feather Ball",
    palette: [
      { hex: "#f2f7f8", weight: 0.46 },
      { hex: "#2090b0", weight: 0.54 },
    ],
    themes: ["sky"],
  },
  {
    id: "lawing-ball",
    name: "Wing Ball",
    palette: [
      { hex: "#f4f8f8", weight: 0.64 },
      { hex: "#7ec8d4", weight: 0.36 },
    ],
    themes: ["sky"],
  },
  {
    id: "lajet-ball",
    name: "Jet Ball",
    palette: [
      { hex: "#eef3f4", weight: 0.4 },
      { hex: "#0a7098", weight: 0.6 },
    ],
    themes: ["sky"],
  },
  {
    id: "laleaden-ball",
    name: "Leaden Ball",
    palette: [
      { hex: "#2a2a2a", weight: 0.74 },
      { hex: "#8a9090", weight: 0.26 },
    ],
    themes: ["metal"],
  },
  {
    id: "lagigaton-ball",
    name: "Gigaton Ball",
    palette: [
      { hex: "#242424", weight: 0.8 },
      { hex: "#6a6464", weight: 0.2 },
    ],
    themes: ["metal"],
  },
  {
    id: "laheavy-ball",
    name: "Hisuian Heavy Ball",
    palette: [
      { hex: "#303030", weight: 0.7 },
      { hex: "#8a8a96", weight: 0.3 },
    ],
    themes: ["metal"],
  },
  {
    id: "laorigin-ball",
    name: "Origin Ball",
    palette: [
      { hex: "#e04030", weight: 0.72 },
      { hex: "#f0b0a8", weight: 0.28 },
    ],
    themes: [],
  },
];

function ballById(id) {
  return BALLS.find((ball) => ball.id === id) || null;
}
