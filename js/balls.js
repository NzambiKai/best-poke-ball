"use strict";

/**
 * Main-series Poké Ball catalogue. Hand-edited.
 *
 * The scorer in js/matching.js reads this list. It is not a list of
 * per-Pokémon picks. Overrides, when any exist, live in js/overrides.js.
 *
 * id is the PokeAPI item slug and the file name in assets/items/.
 * palette is the shell on the modern in-game model, not a sample of the
 * bag icon. Those icons turn red into orange and a black hemisphere into
 * slate. The shared outline and the shine are left out, but black that
 * is part of the design stays. A white lower half is weighted 0.26, the
 * same as the Poké Ball. Weights sum to 1.
 * themes describe that look. They are not catch bonuses.
 * matchable false keeps a ball out of the ranking. The Cherish Ball is
 * only shown for a form whose cherishOnly flag is true.
 *
 * Omitted from the catalogue, so the sync does not download their icons:
 * Hisuian Poké, Great, and Ultra Balls repeat the modern red,
 * blue-and-red, and black-and-yellow shells. Feather, Wing, Jet, Leaden,
 * Gigaton, Hisuian Heavy, and Origin are catchable only in Legends: Arceus.
 * Strange Ball is a fallback icon, not a look to recommend. Picnic toys
 * and held items are not catch balls.
 */

const BALLS = [
  {
    id: "poke-ball",
    name: "Poké Ball",
    palette: [
      { hex: "#e23d32", weight: 0.74 },
      { hex: "#ffffff", weight: 0.26 },
    ],
    themes: [],
  },
  {
    id: "great-ball",
    name: "Great Ball",
    palette: [
      { hex: "#3a94ff", weight: 0.5 },
      { hex: "#d23b32", weight: 0.24 },
      { hex: "#ffffff", weight: 0.26 },
    ],
    themes: [],
  },
  {
    id: "ultra-ball",
    name: "Ultra Ball",
    palette: [
      { hex: "#1c1c1c", weight: 0.46 },
      { hex: "#f0d030", weight: 0.28 },
      { hex: "#ffffff", weight: 0.26 },
    ],
    themes: [],
  },
  {
    id: "master-ball",
    name: "Master Ball",
    palette: [
      { hex: "#b53af7", weight: 0.52 },
      { hex: "#e621c5", weight: 0.22 },
      { hex: "#ffffff", weight: 0.26 },
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
      { hex: "#ffffff", weight: 0.68 },
      { hex: "#de3a3a", weight: 0.32 },
    ],
    themes: [],
  },
  {
    id: "fast-ball",
    name: "Fast Ball",
    palette: [
      { hex: "#e23d32", weight: 0.46 },
      { hex: "#f0d030", weight: 0.28 },
      { hex: "#ffffff", weight: 0.26 },
    ],
    themes: ["fire"],
  },
  {
    id: "level-ball",
    name: "Level Ball",
    palette: [
      { hex: "#e0b48a", weight: 0.48 },
      { hex: "#7a5a48", weight: 0.32 },
      { hex: "#d89048", weight: 0.2 },
    ],
    themes: ["earth"],
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
      { hex: "#f0c0d8", weight: 0.42 },
      { hex: "#e070a8", weight: 0.34 },
      { hex: "#a04088", weight: 0.24 },
    ],
    themes: ["fairy", "cute"],
  },
  {
    id: "friend-ball",
    name: "Friend Ball",
    palette: [
      { hex: "#6aaa32", weight: 0.64 },
      { hex: "#e0c040", weight: 0.1 },
      { hex: "#ffffff", weight: 0.26 },
    ],
    themes: ["forest"],
  },
  {
    id: "moon-ball",
    name: "Moon Ball",
    palette: [
      { hex: "#243048", weight: 0.52 },
      { hex: "#f0d040", weight: 0.22 },
      { hex: "#ffffff", weight: 0.26 },
    ],
    themes: ["night"],
  },
  {
    id: "net-ball",
    name: "Net Ball",
    palette: [
      { hex: "#1f7a88", weight: 0.4 },
      { hex: "#4ab5c5", weight: 0.4 },
      { hex: "#1c1c1c", weight: 0.2 },
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
      { hex: "#1c1c1c", weight: 0.28 },
      { hex: "#de3a3a", weight: 0.17 },
    ],
    themes: [],
  },
  {
    id: "luxury-ball",
    name: "Luxury Ball",
    palette: [
      { hex: "#1c1c1c", weight: 0.48 },
      { hex: "#d4a017", weight: 0.2 },
      { hex: "#ffffff", weight: 0.26 },
      { hex: "#d23b32", weight: 0.06 },
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
      { hex: "#2f62c8", weight: 0.46 },
      { hex: "#322e98", weight: 0.26 },
      { hex: "#3aa0e0", weight: 0.18 },
      { hex: "#e04048", weight: 0.1 },
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
];

function ballById(id) {
  return BALLS.find((ball) => ball.id === id) || null;
}
