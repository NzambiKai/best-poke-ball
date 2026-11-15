"use strict";

/**
 * Remembers the last Pokémon and whether Shiny is on.
 * The Pokédex and the page stay out of this file.
 * Missing, invalid, or blocked storage is a silent miss.
 */

const DEFAULT_POKEMON_SLUG = "bulbasaur";
const LAST_VIEWED_KEY = "best-poke-ball.last-viewed";
const SHINY_KEY = "best-poke-ball.shiny";
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function preferenceStorage() {
  try {
    if (typeof localStorage === "undefined" || !localStorage) return null;
    return localStorage;
  } catch {
    return null;
  }
}

function readLastViewed() {
  const storage = preferenceStorage();
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
  const storage = preferenceStorage();
  if (!storage) return;
  try {
    storage.setItem(LAST_VIEWED_KEY, slug);
  } catch {
    // Private mode, a full disk, or a blocked store. The page still shows the Pokémon.
  }
}

function readShiny() {
  const storage = preferenceStorage();
  if (!storage) return false;
  try {
    return storage.getItem(SHINY_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberShiny(on) {
  const storage = preferenceStorage();
  if (!storage) return;
  try {
    storage.setItem(SHINY_KEY, on ? "1" : "0");
  } catch {
    // The switch still updates the artwork for this visit.
  }
}
