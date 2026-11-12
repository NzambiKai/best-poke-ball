"use strict";

/**
 * Rank Poké Balls for one form. No DOM.
 *
 * A ball qualifies by colour alone: its shell has to match the colours
 * measured on the HOME sprite. Type tags only break a tie between balls
 * whose colour scores are already close, and only among balls that
 * already passed. Catch bonuses are not used.
 *
 * cherishOnly is applied here via rulesFor(), before overrides, and
 * before this ranking. When the Master Ball is the only ball selected,
 * masterAlternates() adds one or two runner-up balls after that selection.
 */

const DISTANCE_CAP = 0.4;
const HUE_GAP_START = 22;
const COVER = 0.55;
const LOOSE = 0.4;
const LOOSE_GAIN = 0.12;
const LARGE_SHARE = 0.18;
const SWATCH_MIN = 0.12;
const BALL_FLOOR = 0.4;
const MIN_COVER = 0.08;
const CLOSE_RATIO = 0.92;
const MAX_BALLS = 3;
const HUE_FAMILY = 36;
const CLEAR_HUE = 0.02;
const VIVID_CHROMA = 0.06;
// Below this, a hue is only a cast unless a stronger sample of the same hue is present.
const CAST_CHROMA = 0.045;
const CAST_FLOOR = 0.03;
const CONFIRM_CHROMA = 0.05;
const CONFIRM_SHARE = 0.04;
const CONFIRM_GAP = 30;
// A colour that covers most of the sprite is the body, not a shading cast.
// A very pale tint qualifies when it is light; a darker tint has to be stronger.
const BODY_SHARE = 0.4;
const BODY_CHROMA = 0.025;
const PALE_BODY_LIGHT = 0.8;
const MUTED_BODY_CHROMA = 0.038;
// A hue this faint is not stable enough to borrow a saturated swatch's score.
const FAMILY_CHROMA = 0.034;
// Neutral coats split by lightness. Charcoal is black, not mid gray.
const DARK_LIGHT = 0.62;
const MID_LIGHT = 0.82;
const NEUTRAL_SWATCH = 0.05;
const CLASH = 0.22;
const CLASH_SHARE = 0.3;
const CLASH_PENALTY = 0.7;
const FULL_SHARE = 0.16;
const ACCENT_MIN = 0.018;
const ACCENT_MAX = 0.08;
const ACCENT_CHROMA = 0.1;
const ACCENT_HUE_GAP = 40;
const ACCENT_CONTRAST = 0.25;
const ACCENT_SWATCH = 0.25;
const PINK_PURPLE_GAP = 18;
const PINK_PURPLE_FACTOR = 0.45;
// The Master Ball is the rarest ball, so it should not be the only suggestion.
// These sit below the normal gate. A runner-up may explain less of its shell
// and land on a smaller patch, and it does not have to clear the coverage minimum.
const MASTER_ALT_EXPLAINED = 0.12;
const MASTER_ALT_SHARE = 0.09;
const MASTER_ALT_CLOSE = 0.75;

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

function chromaOf(lab) {
  return Math.hypot(lab[1], lab[2]);
}

function hueGap(left, right) {
  const gap = Math.abs(left - right) % 360;
  return Math.min(gap, 360 - gap);
}

function hueOf(lab) {
  return (Math.atan2(lab[2], lab[1]) * 180) / Math.PI;
}

function similarity(hexA, hexB) {
  const left = labOf(hexA);
  const right = labOf(hexB);
  const distance = Math.hypot(left[0] - right[0], left[1] - right[1], left[2] - right[2]);
  let sim = 1 - Math.min(1, distance / DISTANCE_CAP);
  const leftChroma = chromaOf(left);
  const rightChroma = chromaOf(right);
  const lowChroma = Math.min(leftChroma, rightChroma);
  const highChroma = Math.max(leftChroma, rightChroma);
  if (lowChroma < CLEAR_HUE && highChroma > VIVID_CHROMA) sim *= 0.5;
  if (lowChroma >= CLEAR_HUE) {
    const gap = hueGap(hueOf(left), hueOf(right));
    if (gap > HUE_GAP_START) sim *= Math.max(0, 1 - (gap - HUE_GAP_START) / 26);
    const pale = lowChroma / highChroma < 0.55;
    if (pale && gap <= HUE_FAMILY && lowChroma >= FAMILY_CHROMA) {
      // A pale or shaded colour keeps its hue against the saturated version.
      // Two solid colours are left to the distance above.
      const lightGap = Math.abs(left[0] - right[0]);
      const light = 1 - Math.min(1, Math.max(0, lightGap - 0.22) / 0.22);
      const family = 0.78 * (1 - gap / 60) * light;
      if (family > sim) sim = family;
    }
  }
  return sim * pinkPurpleFactor(hexA, hexB);
}

function pinkPurpleFactor(hexA, hexB) {
  const left = labOf(hexA);
  const right = labOf(hexB);
  if (Math.min(chromaOf(left), chromaOf(right)) < CLEAR_HUE) return 1;
  if (hueGap(hueOf(left), hueOf(right)) <= PINK_PURPLE_GAP) return 1;
  const names = new Set([hueName(hexA), hueName(hexB)]);
  const pink = names.has("pink") || names.has("red");
  if (pink && names.has("purple")) return PINK_PURPLE_FACTOR;
  return 1;
}

function lightBand(lightness) {
  if (lightness < DARK_LIGHT) return 0;
  if (lightness < MID_LIGHT) return 1;
  return 2;
}

function regionSimilarity(swatchHex, region) {
  if (!region.cast) return similarity(swatchHex, region.hex);
  const swatch = labOf(swatchHex);
  const body = labOf(region.hex);
  const swatchChroma = chromaOf(swatch);
  // A coloured shell does not match a neutral coat. A dark navy shell still matches a dark coat.
  if (swatchChroma > NEUTRAL_SWATCH) {
    if (swatch[0] >= 0.42 || body[0] >= DARK_LIGHT) return 0;
    const distance = Math.hypot(swatch[0] - body[0], swatch[1] - body[1], swatch[2] - body[2]);
    return (1 - Math.min(1, distance / DISTANCE_CAP)) * 0.85;
  }
  const bandGap = Math.abs(lightBand(swatch[0]) - lightBand(body[0]));
  if (bandGap > 1) return 0;
  if (bandGap === 1) return 0.34;
  const lightnessGap = Math.abs(swatch[0] - body[0]);
  return Math.max(0.72, 0.96 - lightnessGap);
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
  if (turn >= 328 || turn < 15) return lightness > 0.62 ? "pink" : "red";
  if (turn < 42) return "red";
  if (turn < 72) return lightness < 0.58 ? "brown" : "orange";
  if (turn < 112) return "yellow";
  if (turn < 168) return "green";
  if (turn < 242) return "teal";
  if (turn < 278) return "blue";
  return lightness > 0.8 && chroma > 0.08 ? "pink" : "purple";
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function regionsFor(palette) {
  const regions = [];
  for (const color of palette?.colors || []) {
    if (color.share >= 0.015 && color.hex) regions.push({ hex: color.hex, share: color.share });
  }
  const neutral = palette?.neutral || {};
  for (const name of ["black", "gray", "white"]) {
    const share = neutral[name] || 0;
    const hex = neutral[`${name}Hex`];
    if (share >= 0.03 && hex) regions.push({ hex, share, neutral: true });
  }
  return classifyRegions(regions);
}

function isBodyHue(region) {
  if (region.share < BODY_SHARE || region.chroma < BODY_CHROMA) return false;
  if (region.chroma >= MUTED_BODY_CHROMA) return true;
  return labOf(region.hex)[0] >= PALE_BODY_LIGHT;
}

function confirmsHue(other, region) {
  if (other === region || hueGap(region.hue, other.hue) > CONFIRM_GAP) return false;
  if (isBodyHue(other)) return true;
  return other.chroma >= CONFIRM_CHROMA && other.share >= CONFIRM_SHARE;
}

function classifyRegions(regions) {
  for (const region of regions) {
    const lab = labOf(region.hex);
    region.chroma = chromaOf(lab);
    region.hue = hueOf(lab);
  }
  for (const region of regions) {
    if (isBodyHue(region)) {
      region.cast = false;
      continue;
    }
    if (region.chroma < CAST_FLOOR) {
      region.cast = true;
      continue;
    }
    if (region.chroma >= CAST_CHROMA) {
      region.cast = false;
      continue;
    }
    region.cast = !regions.some((other) => confirmsHue(other, region));
  }
  return regions;
}

function themed(ball, types) {
  const tags = new Set(ball.themes || []);
  return types.some((type) => (TYPE_THEMES[type] || []).some((tag) => tags.has(tag)));
}

function isWhiteBottom(swatch) {
  if (swatch.weight > 0.27) return false;
  const lab = labOf(swatch.hex);
  return lab[0] > 0.9 && chromaOf(lab) < 0.02;
}

function bodyRegion(regions) {
  return regions.reduce((best, region) => (!best || region.share > best.share ? region : best), null);
}

function isHueAccent(regions, index) {
  const region = regions[index];
  if (!region || region.cast || region.chroma < ACCENT_CHROMA) return false;
  if (region.share < ACCENT_MIN || region.share > ACCENT_MAX) return false;
  const body = bodyRegion(regions);
  if (!body || body === region) return false;
  if (Math.abs(labOf(region.hex)[0] - labOf(body.hex)[0]) < ACCENT_CONTRAST) return false;
  return hueGap(region.hue, body.hue) >= ACCENT_HUE_GAP;
}

function isNeutralMark(regions, index) {
  const region = regions[index];
  if (!region || region.share < ACCENT_MIN || region.share > ACCENT_MAX) return false;
  if (!(region.cast || region.chroma < 0.03)) return false;
  const body = bodyRegion(regions);
  if (!body || body === region) return false;
  if (Math.abs(labOf(region.hex)[0] - labOf(body.hex)[0]) < ACCENT_CONTRAST) return false;
  return lightBand(labOf(region.hex)[0]) !== lightBand(labOf(body.hex)[0]);
}

function scoreBall(ball, regions) {
  const covered = new Map();
  let ballExplained = 0;
  let clashWeight = 0;
  let pair = null;
  ball.palette.forEach((swatch) => {
    if (swatch.weight < SWATCH_MIN) return;
    let bestSim = 0;
    let bestIndex = -1;
    let largestShare = 0;
    let largestIndex = -1;
    regions.forEach((region, index) => {
      const sim = regionSimilarity(swatch.hex, region);
      if (sim > bestSim) {
        bestSim = sim;
        bestIndex = index;
      }
      if (sim >= COVER && region.share > largestShare) {
        largestShare = region.share;
        largestIndex = index;
      }
    });
    if (bestIndex < 0 || bestSim < CLASH) {
      if (!isWhiteBottom(swatch)) clashWeight += swatch.weight;
      return;
    }
    const creditIndex = largestIndex >= 0 ? largestIndex : bestIndex;
    const creditShare = regions[creditIndex].share;
    const neutralMark = isNeutralMark(regions, creditIndex) && chromaOf(labOf(swatch.hex)) <= 0.02 && swatch.weight >= ACCENT_SWATCH;
    const hueMark = isHueAccent(regions, creditIndex) && swatch.weight >= ACCENT_SWATCH;
    const factor = creditShare >= FULL_SHARE || neutralMark || hueMark ? 1 : creditShare / FULL_SHARE;
    if (bestSim < COVER) return;
    ballExplained += swatch.weight * bestSim * factor;
    regions.forEach((region, index) => {
      const sim = regionSimilarity(swatch.hex, region);
      if (sim < COVER) return;
      if (region.share < FULL_SHARE && !isNeutralMark(regions, index) && !isHueAccent(regions, index)) return;
      const previous = covered.get(index) || 0;
      if (sim > previous) covered.set(index, sim);
    });
    const contrib = creditShare * swatch.weight * bestSim;
    if (!pair || contrib > pair.contrib) pair = { color: regions[creditIndex], swatch, sim: bestSim, contrib };
  });
  if (clashWeight >= CLASH_SHARE) ballExplained -= clashWeight * CLASH_PENALTY;
  ballExplained = Math.max(0, ballExplained);
  let monCovered = 0;
  for (const [index, sim] of covered) monCovered += regions[index].share * sim;
  return {
    ball,
    ballExplained,
    monCovered,
    covered,
    pair,
    score: monCovered * ballExplained,
    theme: themed(ball, []),
  };
}

function passes(row) {
  if (row.monCovered < MIN_COVER || row.ballExplained < BALL_FLOOR || !row.pair) return false;
  if (row.pair.color.share >= LARGE_SHARE) return true;
  return row.pair.swatch.weight >= ACCENT_SWATCH && row.pair.color.share >= FULL_SHARE;
}

function orderByColour(rows, types, compare) {
  const ranked = rows.slice().sort(compare || ((left, right) => right.score - left.score || left.ball.name.localeCompare(right.ball.name)));
  for (const row of ranked) row.theme = themed(row.ball, types);
  if (!ranked.length || ranked[0].theme) return ranked;
  const leader = ranked[0];
  const band = ranked.filter((row) => {
    if (!row.theme) return false;
    if (leader.score > 0) return row.score >= leader.score * CLOSE_RATIO;
    return row.ballExplained >= leader.ballExplained * CLOSE_RATIO;
  });
  if (!band.length) return ranked;
  const chosen = band[0];
  chosen.tiebreak = true;
  return [chosen, ...ranked.filter((row) => row !== chosen)];
}

function coverOf(region, chosen) {
  let best = 0;
  for (const row of chosen) {
    for (const swatch of row.ball.palette) {
      if (swatch.weight < SWATCH_MIN) continue;
      best = Math.max(best, regionSimilarity(swatch.hex, region));
    }
  }
  return best;
}

function looseBall(regions, chosen, used) {
  let target = null;
  let targetIndex = -1;
  let targetCover = 0;
  regions.forEach((region, index) => {
    if (region.share < LARGE_SHARE) return;
    const best = coverOf(region, chosen);
    if (best >= COVER) return;
    if (!target || region.share > target.share) {
      target = region;
      targetIndex = index;
      targetCover = best;
    }
  });
  if (!target) return null;
  let best = null;
  for (const ball of BALLS) {
    if (ball.matchable === false || used.has(ball.id)) continue;
    let sim = 0;
    let swatch = null;
    for (const candidate of ball.palette) {
      if (candidate.weight < SWATCH_MIN) continue;
      const next = regionSimilarity(candidate.hex, target);
      if (next > sim) {
        sim = next;
        swatch = candidate;
      }
    }
    if (sim < LOOSE || sim < targetCover + LOOSE_GAIN || !swatch) continue;
    const score = target.share * sim;
    if (!best || sim > best.pair.sim) {
      best = {
        ball,
        ballExplained: swatch.weight * sim,
        monCovered: target.share * sim,
        covered: new Map([[targetIndex, sim]]),
        pair: { color: target, swatch, sim, contrib: score },
        score,
        loose: true,
        theme: false,
        targetIndex,
      };
    }
  }
  return best;
}

function coversNewLargeRegion(row, chosen, regions) {
  for (const [index, sim] of row.covered) {
    if (sim < COVER || regions[index].share < LARGE_SHARE) continue;
    const held = chosen.some((other) => (other.covered.get(index) || 0) >= COVER);
    if (!held) return true;
  }
  return false;
}

function keepsAnotherLargeRegion(row, chosen, regions, targetIndex) {
  for (const [index, sim] of row.covered) {
    if (index === targetIndex || sim < COVER) continue;
    if (regions[index].share < LARGE_SHARE) continue;
    const heldByAnother = chosen.some((other) => other !== row && (other.covered.get(index) || 0) >= COVER);
    if (!heldByAnother) return true;
  }
  return false;
}

function reasonFor(pokemon, row) {
  const pair = row.pair;
  if (!pair) return `A match for ${pokemon.name}'s colours`;
  const ballHue = hueName(pair.swatch.hex);
  const monHue = hueName(pair.color.hex);
  const neutral = pair.color.neutral || pair.color.cast || chromaOf(labOf(pair.color.hex)) < 0.03;
  if (neutral) {
    const coat = ballHue === "black" || ballHue === "gray" ? "dark" : ballHue;
    const body = monHue === "black" || monHue === "gray" ? "dark" : monHue;
    return `${capitalize(coat)} shell for ${pokemon.name}'s ${body} coat`;
  }
  return `${capitalize(ballHue)} shell beside ${pokemon.name}'s ${monHue} coloring`;
}

function accentBall(regions, picked) {
  const used = new Set(picked.map((row) => row.ball.id));
  let best = null;
  regions.forEach((region, index) => {
    if (!isHueAccent(regions, index)) return;
    const already = picked.some((row) =>
      row.ball.palette.some((swatch) => swatch.weight >= SWATCH_MIN && regionSimilarity(swatch.hex, region) >= 0.82),
    );
    if (already) return;
    for (const ball of BALLS) {
      if (ball.matchable === false || used.has(ball.id)) continue;
      for (const swatch of ball.palette) {
        if (swatch.weight < ACCENT_SWATCH) continue;
        const sim = regionSimilarity(swatch.hex, region);
        if (sim < COVER) continue;
        if (best && sim <= best.pair.sim) continue;
        best = {
          ball,
          ballExplained: swatch.weight * sim,
          monCovered: region.share * sim,
          covered: new Map([[index, sim]]),
          pair: { color: region, swatch, sim, contrib: region.share * sim },
          score: region.share * sim,
          accent: true,
          theme: false,
          targetIndex: index,
        };
      }
    }
  });
  return best;
}

function passesMasterAlternate(row) {
  if (!row.pair || row.ballExplained < MASTER_ALT_EXPLAINED) return false;
  return row.pair.color.share >= MASTER_ALT_SHARE;
}

function visualScoreOrder(left, right) {
  return right.score - left.score || right.ballExplained - left.ballExplained || left.ball.name.localeCompare(right.ball.name);
}

function alternateClose(row, first) {
  if (first.score > 0) return row.score >= first.score * MASTER_ALT_CLOSE;
  return row.ballExplained >= first.ballExplained * MASTER_ALT_CLOSE;
}

/**
 * The Master Ball is the rarest ball in the games. When it is the only ball
 * this form kept, add the next visual matches so the page is not a single
 * rare ball. Candidates are the other balls in visual-score order, through
 * the same type tiebreak as the main list. The floor is looser than passes(),
 * so a runner-up can be a partial shell match or a patch just under the
 * coverage cutoff. A second alternate is kept when it is close to the first.
 * That second slot still prefers a ball that covers a colour the first two
 * cards do not. If nothing clears the floor, the single best other ball by
 * visual score is shown anyway, and no second alternate is added. Forms that
 * already have another match, and forms that did not pick the Master Ball,
 * are left as they are.
 */
function masterAlternates(rows, picked, regions, types) {
  if (picked.length !== 1 || picked[0].ball.id !== "master-ball") return picked;
  const others = rows.filter((row) => row.ball.id !== "master-ball");
  const ordered = orderByColour(others.filter(passesMasterAlternate), types, visualScoreOrder);
  if (!ordered.length) {
    const fallback = orderByColour(others, types, visualScoreOrder);
    return fallback.length ? [picked[0], fallback[0]] : picked;
  }
  const first = ordered[0];
  const close = ordered.slice(1).filter((row) => alternateClose(row, first));
  const held = [picked[0], first];
  const diverse = close.find((row) => coversNewLargeRegion(row, held, regions));
  const second = diverse || close[0] || null;
  return second ? [picked[0], first, second] : [picked[0], first];
}

function rankBalls(pokemon, palette) {
  const regions = regionsFor(palette);
  const rows = BALLS.filter((ball) => ball.matchable !== false).map((ball) => scoreBall(ball, regions));
  const qualified = orderByColour(rows.filter(passes), pokemon.types);
  const picked = qualified.slice(0, MAX_BALLS);
  if (picked.length === MAX_BALLS) {
    const diverse = qualified.find((row) => !picked.slice(0, 2).includes(row) && coversNewLargeRegion(row, picked.slice(0, 2), regions));
    if (diverse) picked[2] = diverse;
  }
  if (!picked.length && rows.length) {
    rows.sort((left, right) => right.score - left.score || left.ball.name.localeCompare(right.ball.name));
    picked.push(rows[0]);
  }
  const extra = looseBall(regions, picked, new Set(picked.map((row) => row.ball.id)));
  if (extra && picked.length < MAX_BALLS) picked.push(extra);
  else if (extra) {
    const replaceAt = picked.findLastIndex((row) => !keepsAnotherLargeRegion(row, picked, regions, extra.targetIndex));
    if (replaceAt >= 0) picked.splice(replaceAt, 1, extra);
  }
  const accent = accentBall(regions, picked);
  if (accent && picked.length < MAX_BALLS) picked.push(accent);
  else if (accent) {
    const replaceAt = picked.findLastIndex((row) => {
      if (!row.pair || keepsAnotherLargeRegion(row, picked, regions, accent.targetIndex)) return false;
      return picked.some((other) => {
        if (other === row || !other.pair) return false;
        return hueGap(hueOf(labOf(row.pair.color.hex)), hueOf(labOf(other.pair.color.hex))) <= 28;
      });
    });
    if (replaceAt >= 0) picked.splice(replaceAt, 1, accent);
  }
  return masterAlternates(rows, picked, regions, pokemon.types);
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
  entry.balls.slice(0, MAX_BALLS).forEach((id, index) => {
    const ball = ballById(id);
    if (!ball || ball.matchable === false) return;
    const row = ranked.find((item) => item.ball.id === id) || scoreBall(ball, regionsFor(palette));
    const handwritten = entry.reasons && entry.reasons[index];
    cards.push({
      ball: ball.id,
      name: ball.name,
      reason: handwritten || reasonFor(pokemon, row),
    });
  });
  return cards.length ? cards : null;
}

function matchBalls(pokemon, palette) {
  if (rulesFor(pokemon.slug).cherishOnly) return cherishCard();
  const override = overrideFor(pokemon.slug);
  if (override) {
    const replaced = cardsFromOverride(override, pokemon, palette);
    if (replaced) return replaced;
  }
  return rankBalls(pokemon, palette).map((row) => ({
    ball: row.ball.id,
    name: row.ball.name,
    reason: reasonFor(pokemon, row),
  }));
}
