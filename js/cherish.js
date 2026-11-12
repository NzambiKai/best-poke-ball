"use strict";

/**
 * Cherish-only forms. Hand-editable. Keyed by form slug, not by species.
 *
 * Rule: set a slug to true only when that exact form has never been
 * obtainable in any ball except a Cherish Ball, in any game. The page then
 * shows one Cherish Ball card instead of the placeholder suggestions. If
 * the form has ever been caught, gifted, hatched, or transferred in any
 * other ball (a normal Poké Ball, Premier Ball, Strange Ball, or anything
 * else), leave it false or leave it out.
 *
 * Two forms of the same species can disagree. Flipping a flag back to
 * false restores that form's placeholder cards. This does not score a match.
 *
 * The seed below needs verifying. It is not a complete list.
 *
 * Marked true, high confidence as of November 2026:
 * - zarude-dada: the Sword and Shield movie distributions (Japan, Korea,
 *   and the international serial code, 2020–2021) are Cherish Balls on
 *   Serebii's event list. This form is not in Pokémon GO, is not catchable,
 *   and cannot be bred.
 * - magearna-original: only the Pokémon HOME National Pokédex gift, listed
 *   in a Cherish Ball. Pokémon GO has the standard colors, not this form.
 *
 * Left false on purpose:
 * - zarude and magearna: the standard forms have been caught in Pokémon GO
 *   in a Premier Ball, even though their core-series gifts were Cherish Balls.
 * - Cap Pikachu, including Original Cap: the 2017 Sun and Moon passcode
 *   gifts were normal Poké Balls, and several caps were also caught as
 *   Pokémon GO costumes.
 * - Poké Ball Pattern Vivillon: at least the 2014 online download was a
 *   normal Poké Ball.
 * - Fancy Pattern Vivillon: catchable in Scarlet and Violet.
 * - Ash-Greninja: the event Greninja was in a normal Poké Ball.
 * - Pecharunt: caught with a ball of the player's choice, never a Cherish Ball.
 */
const CHERISH_ONLY = {
  "zarude-dada": true,
  "magearna-original": true,
};

const CHERISH_CARD = {
  ball: "cherish-ball",
  name: "Cherish Ball",
  reason: "Only ever available in a Cherish Ball via events",
  cherish: true,
};
