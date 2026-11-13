"use strict";

/**
 * Remembers the last Pokémon the visitor looked at.
 * Only a slug is stored. The Pokédex and the page stay out of this file.
 * Missing, invalid, or blocked storage is a silent miss.
 */

const DEFAULT_POKEMON_SLUG = "bulbasaur";
const LAST_VIEWED_KEY = "best-poke-ball.last-viewed";
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function lastViewedStorage() {
  try {
    if (typeof localStorage === "undefined" || !localStorage) return null;
    return localStorage;
  } catch {
    return null;
  }
}

function readLastViewed() {
  const storage = lastViewedStorage();
  if (!storage) return null;
  try {
    const value = storage.getItem(LAST_VIEWED_KEY);
    if (typeof value !== "string" || !SLUG_PATTERN.test(value)) return null;
    return value;
  } catch {
    return null;
  }
}

function rememberLastViewed(slug) {
  if (typeof slug !== "string" || !SLUG_PATTERN.test(slug)) return;
  const storage = lastViewedStorage();
  if (!storage) return;
  try {
    storage.setItem(LAST_VIEWED_KEY, slug);
  } catch {
    // Private mode, a full disk, or a blocked store. The page still shows the Pokémon.
  }
}
