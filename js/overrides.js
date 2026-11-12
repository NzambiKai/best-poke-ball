"use strict";

/**
 * Rare full replacements for the scorer, keyed by form slug.
 *
 * Leave this empty unless a form's ranked balls are wrong in a way no
 * general weight can fix. An entry replaces that form's three balls.
 * rulesFor(slug).cherishOnly still wins, and it is applied before this list.
 *
 * Shape, when a replacement is actually needed:
 *   { slug, balls: ["dive-ball", "net-ball"], reasons: ["optional", "optional"] }
 * reasons line up with balls. A missing sentence falls back to the template.
 */
const OVERRIDES = [];

function overrideFor(slug) {
  return OVERRIDES.find((entry) => entry.slug === slug) || null;
}
