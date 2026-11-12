"use strict";

/**
 * Rank Poké Balls for one form. No DOM.
 *
 * Colour comes from the generated palette (regular HOME sprite, plus the
 * Pokédex colour on a default form). Theme comes from the form's types
 * and the ball catalogue. Catch bonuses are not used.
 *
 * cherishOnly is applied by the caller via rulesFor(), before overrides,
 * and before this ranking.
 */

const COLOR_WEIGHT = 0.78;
const THEME_WEIGHT = 0.22;
const SIMILARITY_PENALTY = 0.12;
const DISTANCE_CAP = 0.4;
const THEME_COLOR_FLOOR = 0.48;
const SPECIES_PRIOR = 0.22;
const DOMINANT_POWER = 1.15;
const HUE_GAP_START = 22;
const MIN_COLOR = 0.3;
const MIN_THEME = 0.45;

const SPECIES_HEX = {
  black: "#2a2a2a",
  blue: "#3a7bd5",
  brown: "#8a5a32",
  gray: "#8a8a8a",
  green: "#3c9a32",
  pink: "#f0a0b8",
  purple: "#7a58b0",
  red: "#d23a32",
  white: "#f4f4f4",
  yellow: "#f0d020",
};

const TYPE_THEMES = {
  normal: [],
  fighting: [],
  flying: ["sky"],
  poison: [],
  ground: ["earth"],
  rock: ["earth"],
  bug: [],
  ghost: ["ghost", "night"],
  steel: ["metal"],
  fire: ["fire"],
  water: ["water"],
  grass: ["forest"],
  electric: ["electric"],
  psychic: ["dream"],
  ice: ["ice"],
  dragon: [],
  dark: ["night"],
  fairy: ["fairy", "cute"],
};

const THEME_PRIORITY = ["ghost", "fire", "electric", "ice", "fairy", "dream", "water", "forest", "sky", "metal", "earth", "night", "cute", "mystic", "sleek", "sport", "bug"];

const THEME_WORD = {
  night: "night",
  ghost: "ghostly",
  fire: "fiery",
  water: "water",
  ice: "icy",
  forest: "leafy",
  electric: "electric",
  fairy: "fairy",
  sky: "sky",
  metal: "metal",
  earth: "earthy",
  dream: "dreamy",
  mystic: "mystic",
  cute: "cute",
  sleek: "sleek",
  sport: "sporty",
  bug: "bug",
};

const TYPE_NAME = {
  normal: "Normal",
  fighting: "Fighting",
  flying: "Flying",
  poison: "Poison",
  ground: "Ground",
  rock: "Rock",
  bug: "Bug",
  ghost: "Ghost",
  steel: "Steel",
  fire: "Fire",
  water: "Water",
  grass: "Grass",
  electric: "Electric",
  psychic: "Psychic",
  ice: "Ice",
  dragon: "Dragon",
  dark: "Dark",
  fairy: "Fairy",
};

const CHERISH_REASON = "Only ever available in a Cherish Ball via events";

const labCache = new Map();

function srgbToLinear(channel) {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function labOf(hex) {
  const cached = labCache.get(hex);
  if (cached) return cached;
  const value = Number.parseInt(hex.slice(1), 16);
  const red = srgbToLinear((value >> 16) & 255);
  const green = srgbToLinear((value >> 8) & 255);
  const blue = srgbToLinear(value & 255);
  const l = Math.cbrt(0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue);
  const m = Math.cbrt(0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue);
  const s = Math.cbrt(0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue);
  const lab = [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
  labCache.set(hex, lab);
  return lab;
}

function similarity(hexA, hexB) {
  const left = labOf(hexA);
  const right = labOf(hexB);
  const distance = Math.hypot(left[0] - right[0], left[1] - right[1], left[2] - right[2]);
  let sim = 1 - Math.min(1, distance / DISTANCE_CAP);
  const leftChroma = Math.hypot(left[1], left[2]);
  const rightChroma = Math.hypot(right[1], right[2]);
  const lowChroma = Math.min(leftChroma, rightChroma);
  const highChroma = Math.max(leftChroma, rightChroma);
  if (lowChroma < 0.045 && highChroma > 0.09) sim *= 0.5;
  if (leftChroma > 0.05 && rightChroma > 0.05) {
    const leftHue = (Math.atan2(left[2], left[1]) * 180) / Math.PI;
    const rightHue = (Math.atan2(right[2], right[1]) * 180) / Math.PI;
    const gap = Math.abs(leftHue - rightHue) % 360;
    const hueGap = Math.min(gap, 360 - gap);
    if (hueGap > HUE_GAP_START) sim *= Math.max(0, 1 - (hueGap - HUE_GAP_START) / 26);
  }
  return sim;
}

function chromaOf(hex) {
  const lab = labOf(hex);
  return Math.hypot(lab[1], lab[2]);
}

function hueName(hex) {
  const [lightness, a, b] = labOf(hex);
  const chroma = Math.hypot(a, b);
  if (chroma < 0.03) {
    if (lightness < 0.32) return "black";
    if (lightness > 0.84) return "white";
    return "gray";
  }
  const hue = (Math.atan2(b, a) * 180) / Math.PI;
  const turn = (hue + 360) % 360;
  if (lightness > 0.58 && (turn >= 315 || turn < 18)) return "pink";
  if (turn < 15 || turn >= 345) return "red";
  if (turn < 42) return "red";
  if (turn < 72) return lightness < 0.58 ? "brown" : "orange";
  if (turn < 112) return "yellow";
  if (turn < 168) return "green";
  if (turn < 212) return "teal";
  if (turn < 268) return "blue";
  if (turn < 345) return "purple";
  return "pink";
}

function article(word) {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function colorsFor(palette) {
  const colors = [];
  for (const color of palette?.colors || []) {
    if (color.share >= 0.02 && color.hex) colors.push({ hex: color.hex, share: color.share });
  }
  const neutral = palette?.neutral || {};
  for (const name of ["black", "gray", "white"]) {
    const share = neutral[name] || 0;
    const hex = neutral[`${name}Hex`];
    if (share >= 0.03 && hex) colors.push({ hex, share, neutral: true });
  }
  const speciesHex = palette?.speciesColor ? SPECIES_HEX[palette.speciesColor] : null;
  const speciesAgrees = speciesHex && colors.some((color) => color.share >= 0.05 && similarity(color.hex, speciesHex) >= 0.5);
  if (speciesAgrees) {
    for (const color of colors) color.share *= 1 - SPECIES_PRIOR;
    const neutralSpecies = palette.speciesColor === "black" || palette.speciesColor === "white" || palette.speciesColor === "gray";
    colors.push({ hex: speciesHex, share: SPECIES_PRIOR, neutral: neutralSpecies });
  }
  if (DOMINANT_POWER !== 1 && colors.length) {
    let total = 0;
    for (const color of colors) {
      color.share = color.share ** DOMINANT_POWER;
      total += color.share;
    }
    if (total) for (const color of colors) color.share /= total;
  }
  return colors;
}

function swatchFit(hex, ball) {
  let best = 0;
  let clash = 0;
  for (const swatch of ball.palette) {
    const sim = similarity(hex, swatch.hex);
    const weighted = sim * (0.45 + 0.55 * swatch.weight);
    if (weighted > best) best = weighted;
    if (sim < 0.35) clash += swatch.weight * (0.35 - sim);
  }
  return Math.max(0, best - 0.12 * clash);
}

function colorScore(colors, ball) {
  let total = 0;
  let mass = 0;
  for (const color of colors) {
    mass += color.share;
    total += color.share * swatchFit(color.hex, ball);
  }
  return mass ? total / mass : 0;
}

function bestPair(colors, ball) {
  let best = null;
  let sameHue = null;
  for (const color of colors) {
    for (const swatch of ball.palette) {
      const sim = similarity(color.hex, swatch.hex);
      const contrib = color.share * swatch.weight * sim;
      const pair = { color, swatch, sim, contrib };
      if (!best || contrib > best.contrib) best = pair;
      if (hueName(swatch.hex) === hueName(color.hex) && (!sameHue || contrib > sameHue.contrib)) sameHue = pair;
    }
  }
  if (best && sameHue && sameHue.contrib >= best.contrib * 0.65) return sameHue;
  return best;
}

function colorFit(colors, ball) {
  let best = 0;
  for (const color of colors) {
    if (color.share < 0.08) continue;
    for (const swatch of ball.palette) {
      if (swatch.weight < 0.18) continue;
      best = Math.max(best, similarity(color.hex, swatch.hex));
    }
  }
  return best;
}

function themeMatch(pokemon, ball) {
  const tags = new Set(ball.themes);
  let theme = null;
  let type = null;
  let rank = THEME_PRIORITY.length;
  for (const typeName of pokemon.types) {
    for (const candidate of TYPE_THEMES[typeName] || []) {
      if (!tags.has(candidate)) continue;
      const priority = THEME_PRIORITY.indexOf(candidate);
      if (priority !== -1 && priority < rank) {
        rank = priority;
        theme = candidate;
        type = typeName;
      }
    }
  }
  return { theme, type, score: theme ? 1 : 0 };
}

function paletteSimilarity(left, right) {
  let total = 0;
  for (const swatch of left.palette) {
    let best = 0;
    for (const other of right.palette) best = Math.max(best, similarity(swatch.hex, other.hex));
    total += swatch.weight * best;
  }
  return total;
}

function reasonFor(pokemon, row) {
  const themePart = THEME_WEIGHT * row.themeEffective;
  const colorPart = COLOR_WEIGHT * row.color;
  if (row.theme.theme && (row.themeEffective >= 0.6 || themePart > colorPart)) {
    const word = THEME_WORD[row.theme.theme] || row.theme.theme;
    const typeName = TYPE_NAME[row.theme.type] || row.theme.type;
    return `${capitalize(article(word))} ${word} ball for ${article(typeName)} ${typeName}-type`;
  }
  const pair = row.pair;
  if (!pair) return `A match for ${pokemon.name}'s colours`;
  const ballHue = hueName(pair.swatch.hex);
  const monHue = hueName(pair.color.hex);
  const neutral = pair.color.neutral || chromaOf(pair.color.hex) < 0.03;
  if (neutral) {
    const coat = ballHue === "black" || ballHue === "gray" ? "dark" : ballHue;
    const body = monHue === "black" || monHue === "gray" ? "dark" : monHue;
    return `${capitalize(coat)} shell for ${pokemon.name}'s ${body} coat`;
  }
  return `${capitalize(ballHue)} shell beside ${pokemon.name}'s ${monHue} coloring`;
}

function rankBalls(pokemon, palette) {
  const colors = colorsFor(palette);
  return BALLS.filter((ball) => ball.matchable !== false)
    .map((ball) => {
      const color = colorScore(colors, ball);
      const theme = themeMatch(pokemon, ball);
      const fit = colorFit(colors, ball);
      const themeEffective = theme.score * Math.min(1, Math.max(color, fit) / THEME_COLOR_FLOOR);
      const score = COLOR_WEIGHT * color + THEME_WEIGHT * themeEffective;
      return { ball, colors, color, theme, themeEffective, fit, score, pair: bestPair(colors, ball) };
    })
    .sort((left, right) => right.score - left.score || left.ball.name.localeCompare(right.ball.name));
}

function qualifies(row) {
  return row.color >= MIN_COLOR || row.themeEffective >= MIN_THEME;
}

function pickDiverse(ranked) {
  const pool = ranked.slice();
  const picked = [];
  while (picked.length < 3 && pool.length) {
    let bestIndex = -1;
    let bestAdjusted = -Infinity;
    const restrict = pool.some(qualifies) && picked.length < 3 && pool.filter(qualifies).length > 0;
    for (let index = 0; index < pool.length; index += 1) {
      if (restrict && !qualifies(pool[index]) && pool.some(qualifies)) continue;
      let penalty = 0;
      for (const chosen of picked) penalty = Math.max(penalty, paletteSimilarity(pool[index].ball, chosen.ball));
      const adjusted = pool[index].score - SIMILARITY_PENALTY * penalty;
      if (adjusted > bestAdjusted) {
        bestAdjusted = adjusted;
        bestIndex = index;
      }
    }
    if (bestIndex < 0) break;
    const next = pool.splice(bestIndex, 1)[0];
    next.adjusted = bestAdjusted;
    picked.push(next);
  }
  return picked;
}

function cherishCard() {
  const ball = ballById("cherish-ball");
  return [
    {
      ball: "cherish-ball",
      name: ball ? ball.name : "Cherish Ball",
      reason: CHERISH_REASON,
      cherish: true,
    },
  ];
}

function cardsFromOverride(entry, pokemon, palette) {
  const ranked = rankBalls(pokemon, palette);
  const cards = [];
  entry.balls.slice(0, 3).forEach((id, index) => {
    const ball = ballById(id);
    if (!ball || ball.matchable === false) return;
    const row = ranked.find((item) => item.ball.id === id);
    const handwritten = entry.reasons && entry.reasons[index];
    cards.push({
      ball: ball.id,
      name: ball.name,
      reason: handwritten || (row ? reasonFor(pokemon, row) : `A match for ${pokemon.name}`),
    });
  });
  return cards.length ? cards : null;
}

function explainBalls(pokemon, palette) {
  return pickDiverse(rankBalls(pokemon, palette)).map((row) => ({
    ball: row.ball.id,
    name: row.ball.name,
    reason: reasonFor(pokemon, row),
    score: row.score,
    adjusted: row.adjusted,
    color: row.color,
    theme: row.themeEffective,
    fit: row.fit,
  }));
}

function matchBalls(pokemon, palette) {
  if (rulesFor(pokemon.slug).cherishOnly) return cherishCard();
  const override = overrideFor(pokemon.slug);
  if (override) {
    const replaced = cardsFromOverride(override, pokemon, palette);
    if (replaced) return replaced;
  }
  return explainBalls(pokemon, palette).map(({ ball, name, reason }) => ({ ball, name, reason }));
}
