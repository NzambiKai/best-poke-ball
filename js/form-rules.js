"use strict";

/**
 * Per-form obtainability rules. Hand-editable. Keyed by form slug, not by species.
 *
 * rulesFor(slug) is the only lookup. cherishOnly and shinyLocked both default
 * to false when a slug is missing or a flag is omitted. Two forms of the same
 * species can disagree. This file does not score a ball match.
 *
 * cherishOnly
 *   Set true only when that exact form has never been obtainable in any ball
 *   except a Cherish Ball, in any game. The page then shows one Cherish Ball
 *   card instead of the placeholder suggestions. If the form has ever been
 *   caught, gifted, hatched, or transferred in any other ball (a normal Poké
 *   Ball, Premier Ball, Strange Ball, or anything else), leave the flag false
 *   or leave the slug out. Flipping it back to false restores that form's
 *   placeholder cards.
 *
 * shinyLocked
 *   Set true only when no legitimate shiny of that exact form exists in any
 *   game, including Pokémon GO. With the Shiny switch on, the page keeps the
 *   regular artwork and shows a Shiny-locked badge. It does not request the
 *   shiny file. A missing shiny file for a form that is not locked is a
 *   different case ("No shiny art") and is not recorded here.
 *
 * This list needs verifying. It is not complete.
 *
 * cherishOnly seeds, high confidence as of November 2026:
 * - zarude-dada: the Sword and Shield movie distributions (Japan, Korea, and
 *   the international serial code, 2020–2021) are Cherish Balls on Serebii's
 *   event list. This form is not in Pokémon GO, is not catchable, and cannot
 *   be bred.
 * - magearna-original: only the Pokémon HOME National Pokédex gift, listed in
 *   a Cherish Ball. Pokémon GO has the standard colors, not this form.
 *
 * Left false for cherishOnly on purpose:
 * - zarude and magearna: the standard forms have been caught in Pokémon GO in
 *   a Premier Ball, even though their core-series gifts were Cherish Balls.
 * - Cap Pikachu, including Original Cap: the 2017 Sun and Moon passcode gifts
 *   were normal Poké Balls, and several caps were also Pokémon GO costumes.
 * - Poké Ball Pattern Vivillon: at least the 2014 online download was a
 *   normal Poké Ball.
 * - Fancy Pattern Vivillon: catchable in Scarlet and Violet.
 * - Ash-Greninja: the event Greninja was in a normal Poké Ball.
 * - Pecharunt: caught with a ball of the player's choice, never a Cherish Ball.
 *
 * shinyLocked: no forms are flagged yet.
 */
const FORM_RULES = {
  "zarude-dada": { cherishOnly: true },
  "magearna-original": { cherishOnly: true },
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
