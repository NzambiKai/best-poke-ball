"use strict";

/**
 * Per-form obtainability rules. Hand-editable. Keyed by form slug, not by species.
 *
 * rulesFor(slug) is the only lookup. cherishOnly and shinyLocked both default
 * to false when a slug is missing or a flag is omitted. Two forms of the same
 * species can disagree. This file does not score a ball match.
 *
 * Scope
 *   Main-series games only. Pokémon GO is out of scope. A Pokémon HOME
 *   transfer counts only when its origin is a main-series game. A transfer
 *   that came from Pokémon GO does not count.
 *
 * cherishOnly
 *   Set true only when that exact form has never been obtainable in any ball
 *   except a Cherish Ball, in any main-series game. The page then shows one
 *   Cherish Ball card instead of the placeholder suggestions. If the form has
 *   ever been caught, gifted, hatched, or transferred from a main-series
 *   origin in any other ball (a normal Poké Ball, Premier Ball, Strange Ball,
 *   or anything else), leave the flag false or leave the slug out. Flipping
 *   it back to false restores that form's placeholder cards.
 *
 * shinyLocked
 *   Set true only when no legitimate shiny of that exact form exists in any
 *   main-series game. With the Shiny switch on, the page keeps the regular
 *   artwork and shows a Shiny-locked badge. It does not request the shiny
 *   file. A missing shiny file for a form that is not locked is a different
 *   case ("No shiny art") and is not recorded here.
 *
 * This list needs verifying. It is not complete.
 *
 * cherishOnly seeds (main series, November 2026):
 * - magearna-original: Serebii's event list records the Pokémon HOME National
 *   Pokédex gift in a Cherish Ball. Bulbapedia lists that gift as the
 *   Original Color distribution. The Legends: Z-A side mission is the
 *   regular form, not this one.
 * - zarude: Serebii's event list shows a Cherish Ball on every distribution,
 *   including the 2020 Jungle gifts and the 2024 Scarlet and Violet campaign.
 *   Bulbapedia's locations are those events, plus a HOME transfer into
 *   Scarlet and Violet that keeps the Sword and Shield ball.
 * - zarude-dada: Serebii's level 70 movie distributions are Cherish Balls.
 *   Bulbapedia lists only those Sword and Shield events for this form.
 *
 * Left false for cherishOnly on purpose:
 * - magearna: the 2016 QR gifts are Cherish Balls on Serebii's event list,
 *   but the Legends: Z-A Side Mission 195 gift is shown there in a Poké Ball
 *   (OT Jett, level 80). Bulbapedia lists that mission as a regular-form
 *   obtainment.
 * - Cap Pikachu, including Original Cap: Serebii's event list shows the
 *   level 1 Ash and Satoshi gifts in a Poké Ball.
 * - Poké Ball Pattern Vivillon: Serebii shows the SUM2014 and Pokémon Center
 *   gifts in a Poké Ball. The Paris in-person gift is a Cherish Ball, so the
 *   form has both.
 * - Fancy Pattern Vivillon: the GTS gifts on Serebii are Cherish Balls, and
 *   the pattern is also the wild Vivillon in Scarlet and Violet, caught in
 *   the player's ball.
 * - Ash-Greninja: Serebii shows the Battle Bond gift (OT Ash, level 36) in
 *   a Poké Ball.
 * - Pecharunt: Bulbapedia's Cherish Ball page says it has never been released
 *   in a Cherish Ball, and the Mochi Mayhem battle lets the player choose
 *   the ball.
 *
 * shinyLocked seeds (main series):
 * - magearna and magearna-original: Bulbapedia's unobtainable-shiny table
 *   marks Magearna unavailable from Generation VII through IX. Bulbapedia's
 *   QR Scanner page says the QR Magearna is shiny-locked. Serebii's HOME
 *   gift of the Original Color is not a shiny distribution.
 * - zarude and zarude-dada: Bulbapedia marks Zarude unavailable as a shiny
 *   in Generations VIII and IX. Serebii's Dada distributions are not shiny.
 */
const FORM_RULES = {
  magearna: { shinyLocked: true },
  "magearna-original": { cherishOnly: true, shinyLocked: true },
  zarude: { cherishOnly: true, shinyLocked: true },
  "zarude-dada": { cherishOnly: true, shinyLocked: true },
};

function rulesFor(slug) {
  const found = FORM_RULES[slug] || {};
  return {
    cherishOnly: found.cherishOnly === true,
    shinyLocked: found.shinyLocked === true,
  };
}

// Shown wherever a cherishOnly form lists balls. Not a second list of forms.
const CHERISH_CARD = {
  ball: "cherish-ball",
  name: "Cherish Ball",
  reason: "Only ever available in a Cherish Ball via events",
  cherish: true,
};
