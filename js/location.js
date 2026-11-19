"use strict";

/**
 * Address-bar handling for one visit.
 *
 * An incoming link may name a Pokémon in the hash and the Shiny switch in
 * ?shiny=1. Those are read once. After the page applies them, the address
 * is put back to the plain site URL. Choosing another Pokémon, or flipping
 * the Shiny switch, does not write either value back. A bookmark saved
 * while browsing is therefore the plain URL, and the next visit follows
 * the saved preference. This file does not read or write localStorage.
 */

function incomingLink() {
  let slug = "";
  try {
    slug = decodeURIComponent(location.hash.replace(/^#/, ""));
  } catch {
    slug = "";
  }
  const params = new URLSearchParams(location.search);
  const shiny = params.has("shiny") ? params.get("shiny") === "1" : null;
  return { slug, shiny };
}

function clearBrowseUrl() {
  const url = new URL(location.href);
  url.hash = "";
  url.searchParams.delete("shiny");
  const next = `${url.pathname}${url.search}`;
  const current = `${location.pathname}${location.search}${location.hash}`;
  if (next !== current) history.replaceState(null, "", next);
}
