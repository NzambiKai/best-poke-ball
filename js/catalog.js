"use strict";

/**
 * Loads the generated National Dex and answers lookup questions.
 * No DOM and no third-party requests.
 */

const REGIONAL_SUFFIXES = ["-alola", "-galar", "-hisui", "-paldea"];

async function loadCatalog() {
  const [pokemon, families] = await Promise.all([
    fetchJson("data/pokemon.json"),
    fetchJson("data/families.json"),
  ]);
  const bySlug = new Map(pokemon.map((entry) => [entry.slug, entry]));
  const bySpecies = new Map();
  for (const entry of pokemon) {
    const list = bySpecies.get(entry.speciesSlug) || [];
    list.push(entry);
    bySpecies.set(entry.speciesSlug, list);
  }
  const parentOf = new Map();
  for (const [slug, children] of Object.entries(families)) {
    for (const child of children) parentOf.set(child, slug);
  }

  function rootOf(speciesSlug) {
    let slug = speciesSlug;
    const seen = new Set();
    while (parentOf.has(slug) && !seen.has(slug)) {
      seen.add(slug);
      slug = parentOf.get(slug);
    }
    return slug;
  }

  function stagesOf(speciesSlug) {
    const stages = [];
    function walk(slug) {
      stages.push(slug);
      for (const child of families[slug] || []) walk(child);
    }
    walk(rootOf(speciesSlug));
    return stages;
  }

  function suffixForLine(entry) {
    if (!entry || entry.kind !== "variety" || entry.isDefault) return null;
    const suffix = REGIONAL_SUFFIXES.find((item) => entry.slug.endsWith(item));
    if (!suffix) return null;
    const shared = stagesOf(entry.speciesSlug).every((slug) =>
      (bySpecies.get(slug) || []).some((form) => form.kind === "variety" && form.slug === `${slug}${suffix}`)
    );
    return shared ? suffix : null;
  }

  function representative(speciesSlug, suffix) {
    const forms = bySpecies.get(speciesSlug) || [];
    if (suffix) {
      const regional = forms.find((form) => form.kind === "variety" && form.slug === `${speciesSlug}${suffix}`);
      if (regional) return regional;
    }
    return forms.find((form) => form.isDefault) || forms[0];
  }

  function familyTree(slug) {
    const entry = bySlug.get(slug);
    if (!entry) return null;
    const suffix = suffixForLine(entry);
    function node(speciesSlug) {
      return {
        pokemon: representative(speciesSlug, suffix),
        evolvesTo: (families[speciesSlug] || []).map(node),
      };
    }
    return node(rootOf(entry.speciesSlug));
  }

  return { pokemon, bySlug, bySpecies, familyTree };
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load ${url}`);
  return response.json();
}
