"use strict";

/**
 * Layout behaviour only: search, the selected Pokémon, the evolution line,
 * the shiny artwork switch, and the variant section. Pokédex data comes
 * from js/catalog.js. Placeholder ball cards come from js/sample-cards.js.
 * Per-form obtainability comes from rulesFor() in js/form-rules.js.
 * Matching is a later pass. See js/balls.js, which this page does not read.
 */

const ITEM_SPRITE = "assets/items/";

let catalog = null;

const TYPE_LABEL = {
  normal: "Normal",
  grass: "Grass",
  poison: "Poison",
  fire: "Fire",
  flying: "Flying",
  electric: "Electric",
  ghost: "Ghost",
  water: "Water",
  psychic: "Psychic",
  ice: "Ice",
  dark: "Dark",
  fairy: "Fairy",
  dragon: "Dragon",
  steel: "Steel",
};

const searchForm = document.querySelector("#search-form");
const search = document.querySelector("#pokemon-search");
const suggestions = document.querySelector("#suggestions");
const art = document.querySelector("#pokemon-art");
const nameEl = document.querySelector("#pokemon-name");
const dexEl = document.querySelector("#pokemon-dex");
const typesEl = document.querySelector("#pokemon-types");
const sampleButtons = [...document.querySelectorAll(".sample-btn")];
const featuredBalls = document.querySelector("#featured-balls");
const resultsNote = document.querySelector("#results-note");
const evolutionLine = document.querySelector("#evolution-line");
const evolutionNote = document.querySelector("#evolution-note");
const variantSection = document.querySelector("#variant-section");
const variantLine = document.querySelector("#variant-line");
const variantNote = document.querySelector("#variant-note");
const shinyToggle = document.querySelector("#shiny-toggle");
const artCaption = document.querySelector("#art-caption");
const artLock = document.querySelector("#art-lock");

let activeIndex = -1;
let currentSlug = "gengar";
let open = false;
let showAll = false;
let shinyOn = false;

function dexNumber(pokemon) {
  return `No. ${String(pokemon.dex).padStart(3, "0")}`;
}

function shinyTreatment(pokemon) {
  if (!shinyOn) return "off";
  if (rulesFor(pokemon.slug).shinyLocked) return "locked";
  return "shiny";
}

function artworkFor(pokemon) {
  const treatment = shinyTreatment(pokemon);
  if (treatment === "locked") return { src: pokemon.sprites.home, note: "locked", fellBack: "0" };
  if (treatment === "shiny" && pokemon.sprites.shiny) {
    return { src: pokemon.sprites.shiny, note: "", fellBack: "0" };
  }
  if (treatment === "shiny") return { src: pokemon.sprites.home, note: "missing", fellBack: "1" };
  return { src: pokemon.sprites.home, note: "", fellBack: "0" };
}

function lockBadge() {
  const badge = document.createElement("span");
  badge.className = "badge rounded-pill text-bg-secondary";
  badge.textContent = "Shiny-locked";
  return badge;
}

function showSpriteNote(image, mode) {
  const note = image.parentElement?.querySelector(":scope > .sprite-note");
  if (!note) return;
  note.replaceChildren();
  if (mode === "locked") note.append(lockBadge());
  else if (mode === "missing") note.textContent = "No shiny art";
}

function applyHomeSprite(image, pokemon) {
  const choice = artworkFor(pokemon);
  const token = `${Date.now()}-${Math.random()}`;
  image.dataset.spriteToken = token;
  image.dataset.spriteSlug = pokemon.slug;
  image.dataset.fellBack = choice.fellBack;
  showSpriteNote(image, choice.note);
  if (choice.note === "missing") {
    image.title = "Shiny HOME artwork isn't available for this form, so the regular artwork is shown.";
  } else {
    image.removeAttribute("title");
  }
  image.onload = () => {
    if (image.dataset.spriteToken !== token) return;
    if (image === art) syncArtCaption();
  };
  image.onerror = () => {
    if (image.dataset.spriteToken !== token) return;
    image.onerror = null;
  };
  image.src = choice.src;
  if (image === art) syncArtCaption();
}

function homeAlt(pokemon) {
  return shinyTreatment(pokemon) === "shiny"
    ? `${pokemon.name}, shiny Pokémon HOME artwork`
    : `${pokemon.name}, Pokémon HOME artwork`;
}

function syncArtCaption() {
  if (!artCaption) return;
  const pokemon = catalog.bySlug.get(art.dataset.spriteSlug || currentSlug);
  const treatment = pokemon ? shinyTreatment(pokemon) : "off";
  if (artLock) {
    artLock.replaceChildren();
    if (treatment === "locked") artLock.append(lockBadge());
  }
  if (treatment === "off" || treatment === "locked") {
    artCaption.textContent = "Pokémon HOME artwork";
    return;
  }
  artCaption.textContent =
    art.dataset.fellBack === "1"
      ? "Regular HOME artwork (shiny file missing)"
      : "Shiny Pokémon HOME artwork";
}

function refreshHomeArt() {
  document.querySelectorAll("[data-sprite-slug]").forEach((image) => {
    const pokemon = catalog.bySlug.get(image.dataset.spriteSlug);
    if (!pokemon) return;
    applyHomeSprite(image, pokemon);
    if (image === art) image.alt = homeAlt(pokemon);
  });
  syncArtCaption();
}

function matches(query) {
  const all = catalog.pokemon;
  if (showAll) return all.slice();
  const q = query.trim().toLowerCase();
  if (!q) return all.slice();
  return all.filter(
    (pokemon) => pokemon.name.toLowerCase().includes(q) || pokemon.slug.includes(q)
  );
}

function highlight(name, query) {
  const fragment = document.createDocumentFragment();
  const q = query.trim().toLowerCase();
  const index = q ? name.toLowerCase().indexOf(q) : -1;
  if (index < 0) {
    fragment.append(document.createTextNode(name));
    return fragment;
  }
  fragment.append(document.createTextNode(name.slice(0, index)));
  const mark = document.createElement("mark");
  mark.textContent = name.slice(index, index + q.length);
  fragment.append(mark);
  fragment.append(document.createTextNode(name.slice(index + q.length)));
  return fragment;
}

function ballPlate(file) {
  const plate = document.createElement("div");
  plate.className = "ball-plate";
  const image = document.createElement("img");
  image.src = `${ITEM_SPRITE}${file}.png`;
  image.alt = "";
  image.width = 60;
  image.height = 60;
  plate.append(image);
  return plate;
}

function cardsFor(pokemon) {
  if (rulesFor(pokemon.slug).cherishOnly) return [CHERISH_CARD];
  return (SAMPLE_CARDS[pokemon.slug] || []).slice(0, 3);
}

function featuredCard(card, index) {
  const column = document.createElement("div");
  column.className = "col-12 col-lg-4";
  const article = document.createElement("article");
  article.className = "card soft-card ball-card rounded-4 h-100";
  article.dataset.accent = card.cherish ? "cherish" : String(index + 1);
  const body = document.createElement("div");
  body.className = "card-body d-flex gap-3 align-items-center";
  const copy = document.createElement("div");
  const headingRow = document.createElement("div");
  headingRow.className = "d-flex align-items-center gap-2 mb-1";
  const rank = document.createElement("span");
  rank.className = "rank-badge";
  rank.setAttribute("aria-hidden", "true");
  rank.textContent = String(index + 1);
  const heading = document.createElement("h3");
  heading.className = "h5 mb-0";
  const hidden = document.createElement("span");
  hidden.className = "visually-hidden";
  hidden.textContent = card.cherish ? "Event only: " : `Sample result ${index + 1}: `;
  heading.append(hidden, document.createTextNode(card.name));
  if (card.cherish) {
    const pill = document.createElement("span");
    pill.className = "badge rounded-pill cherish-pill";
    pill.textContent = "Event only";
    headingRow.append(pill, heading);
  } else {
    headingRow.append(rank, heading);
  }
  const reason = document.createElement("p");
  reason.className = "mb-0 ball-reason";
  reason.textContent = card.reason;
  copy.append(headingRow, reason);
  body.append(ballPlate(card.ball), copy);
  article.append(body);
  column.append(article);
  return column;
}

function renderFeaturedBalls(pokemon) {
  const cards = cardsFor(pokemon);
  if (cards.length === 0) {
    featuredBalls.replaceChildren();
    resultsNote.textContent = "Matching comes in a later pass.";
    return;
  }
  featuredBalls.replaceChildren(...cards.map(featuredCard));
  resultsNote.textContent = cards[0]?.cherish
    ? "Only ever available in a Cherish Ball via events. Matching comes in a later pass."
    : `Sample cards for ${pokemon.name}. Matching comes in a later pass.`;
}

function evolutionArrow() {
  const wrap = document.createElement("div");
  wrap.className = "evo-arrow";
  wrap.setAttribute("aria-hidden", "true");
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M9 6l6 6-6 6");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "2.4");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  svg.append(path);
  wrap.append(svg);
  return wrap;
}

function stageIsSelected(stage, markLine) {
  const current = catalog.bySlug.get(currentSlug);
  if (!current) return false;
  if (stage.slug === current.slug) return true;
  return markLine && stage.isDefault && stage.speciesSlug === current.speciesSlug;
}

function stageCard(pokemon, markLine) {
  const selected = stageIsSelected(pokemon, markLine);
  const article = document.createElement("article");
  article.className = `card soft-card evo-stage h-100${selected ? " is-selected" : ""}`;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "evo-pick";
  button.setAttribute("aria-pressed", selected ? "true" : "false");

  const image = document.createElement("img");
  image.className = "evo-art";
  image.alt = "";
  image.width = 96;
  image.height = 96;
  const fallback = document.createElement("span");
  fallback.className = "sprite-note";
  button.append(image, fallback);
  applyHomeSprite(image, pokemon);

  const name = document.createElement("span");
  name.className = "evo-name";
  name.textContent = pokemon.name;

  const dex = document.createElement("span");
  dex.className = "evo-dex";
  dex.textContent = dexNumber(pokemon);

  button.append(name, dex);
  if (selected) {
    const badge = document.createElement("span");
    badge.className = "badge rounded-pill evo-selected-pill";
    badge.textContent = "Selected";
    button.append(badge);
  }
  button.addEventListener("click", () => {
    if (pokemon.slug !== currentSlug) choose(pokemon);
  });

  const list = document.createElement("ul");
  list.className = "list-group list-group-flush";
  const cards = cardsFor(pokemon);
  if (cards.length === 0) {
    const item = document.createElement("li");
    item.className = "list-group-item evo-reason";
    item.textContent = "Matching comes in a later pass.";
    list.append(item);
  }
  cards.forEach((card) => {
    const item = document.createElement("li");
    item.className = card.cherish ? "list-group-item cherish-entry" : "list-group-item";
    const ball = document.createElement("img");
    ball.className = "evo-ball";
    ball.src = `${ITEM_SPRITE}${card.ball}.png`;
    ball.alt = "";
    ball.width = 60;
    ball.height = 60;
    const text = document.createElement("div");
    const title = document.createElement("div");
    title.className = "fw-bold";
    if (card.cherish) {
      const pill = document.createElement("span");
      pill.className = "badge rounded-pill cherish-pill me-2";
      pill.textContent = "Event only";
      title.append(pill);
    }
    title.append(document.createTextNode(card.name));
    const reason = document.createElement("p");
    reason.className = "mb-0 evo-reason";
    reason.textContent = card.reason;
    text.append(title, reason);
    item.append(ball, text);
    list.append(item);
  });

  article.append(button, list);
  return article;
}

function lineStages(node) {
  const stages = [];
  let cursor = node;
  while (cursor.evolvesTo.length === 1) {
    stages.push(cursor.pokemon);
    cursor = cursor.evolvesTo[0];
  }
  stages.push(cursor.pokemon);
  return { stages, tail: cursor };
}

function evolutionShape(node) {
  if (node.evolvesTo.length === 0) return "single";
  const { tail } = lineStages(node);
  if (tail.evolvesTo.length === 0) return "line";
  if (node.evolvesTo.length > 1 && node.evolvesTo.every((child) => child.evolvesTo.length === 0)) return "branch";
  return "tree";
}

function appendLine(parent, stages) {
  const line = document.createElement("div");
  line.className = "evo-line";
  stages.forEach((stage, index) => {
    if (index > 0) line.append(evolutionArrow());
    line.append(stageCard(stage, true));
  });
  parent.append(line);
}

function renderNestedFamily(node) {
  const wrap = document.createElement("div");
  wrap.append(stageCard(node.pokemon, true));
  if (node.evolvesTo.length === 0) return wrap;
  const grid = document.createElement("div");
  grid.className = "row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3 mt-2";
  for (const child of node.evolvesTo) {
    const col = document.createElement("div");
    col.className = "col";
    col.append(renderNestedFamily(child));
    grid.append(col);
  }
  wrap.append(grid);
  return wrap;
}

function renderEvolution(pokemon) {
  const tree = catalog.familyTree(pokemon.slug);
  const restoreFocus =
    evolutionLine.contains(document.activeElement) ||
    variantLine.contains(document.activeElement);
  evolutionLine.replaceChildren();
  if (!tree) {
    evolutionNote.textContent = "";
    return;
  }
  const shape = evolutionShape(tree);
  if (shape === "branch") {
    evolutionNote.textContent = `${tree.pokemon.name} branches into ${tree.evolvesTo.length} evolutions.`;
    const top = document.createElement("div");
    top.className = "row justify-content-center mb-3";
    const topCol = document.createElement("div");
    topCol.className = "col-12 col-md-8 col-lg-5";
    topCol.append(stageCard(tree.pokemon, true));
    top.append(topCol);
    const label = document.createElement("p");
    label.className = "evo-branch-label mb-2";
    label.textContent = "Evolves into";
    const grid = document.createElement("div");
    grid.className = "row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-3";
    for (const child of tree.evolvesTo) {
      const col = document.createElement("div");
      col.className = "col";
      col.append(stageCard(child.pokemon, true));
      grid.append(col);
    }
    evolutionLine.append(top, label, grid);
  } else if (shape === "single") {
    evolutionNote.textContent = `${tree.pokemon.name} does not evolve.`;
    const row = document.createElement("div");
    row.className = "row";
    const col = document.createElement("div");
    col.className = "col-12 col-lg-6";
    col.append(stageCard(tree.pokemon, true));
    row.append(col);
    evolutionLine.append(row);
  } else if (shape === "line") {
    const { stages } = lineStages(tree);
    evolutionNote.textContent = `Every stage from ${stages[0].name} to ${stages[stages.length - 1].name}.`;
    appendLine(evolutionLine, stages);
  } else {
    evolutionNote.textContent = `${tree.pokemon.name}'s family.`;
    evolutionLine.append(renderNestedFamily(tree));
  }

  if (restoreFocus) {
    evolutionLine.querySelector(".evo-stage.is-selected .evo-pick")?.focus({ preventScroll: true });
  }
}

function renderVariants(pokemon) {
  const others = (catalog.bySpecies.get(pokemon.speciesSlug) || []).filter(
    (entry) => entry.slug !== pokemon.slug
  );
  others.sort((a, b) => Number(b.isDefault) - Number(a.isDefault) || a.name.localeCompare(b.name));
  if (others.length === 0) {
    variantSection.hidden = true;
    variantNote.textContent = "";
    variantLine.replaceChildren();
    return;
  }
  variantSection.hidden = false;
  variantNote.textContent = `Other forms of ${pokemon.speciesName}. Sample ball cards, same as the evolution line. Matching comes in a later pass.`;
  variantLine.replaceChildren();
  for (const form of others) {
    const col = document.createElement("div");
    col.className = "col";
    col.append(stageCard(form, false));
    variantLine.append(col);
  }
}

function rememberLocation(pokemon) {
  const url = new URL(location.href);
  url.hash = pokemon.slug;
  if (shinyOn) url.searchParams.set("shiny", "1");
  else url.searchParams.delete("shiny");
  const next = `${url.pathname}${url.search}${url.hash}`;
  const current = `${location.pathname}${location.search}${location.hash}`;
  if (next !== current) history.replaceState(null, "", next);
}

function selectPokemon(pokemon) {
  currentSlug = pokemon.slug;
  applyHomeSprite(art, pokemon);
  art.alt = homeAlt(pokemon);
  syncArtCaption();
  nameEl.textContent = pokemon.name;
  dexEl.textContent = dexNumber(pokemon);
  typesEl.replaceChildren();
  for (const type of pokemon.types) {
    const badge = document.createElement("span");
    badge.className = `badge rounded-pill type-badge type-${type}`;
    badge.textContent = TYPE_LABEL[type] || type;
    typesEl.append(badge);
  }
  const speciesDefault = (catalog.bySpecies.get(pokemon.speciesSlug) || []).find((entry) => entry.isDefault);
  for (const button of sampleButtons) {
    const selected =
      button.dataset.slug === pokemon.slug ||
      (speciesDefault && button.dataset.slug === speciesDefault.slug);
    button.className = selected
      ? "btn btn-outline-danger sample-btn"
      : "btn btn-light border sample-btn";
    button.setAttribute("aria-pressed", selected ? "true" : "false");
  }
  renderFeaturedBalls(pokemon);
  renderEvolution(pokemon);
  renderVariants(pokemon);
  document.title = `${pokemon.name} · Best Poké Ball`;
  rememberLocation(pokemon);
}

function closeList() {
  open = false;
  activeIndex = -1;
  suggestions.hidden = true;
  suggestions.replaceChildren();
  search.setAttribute("aria-expanded", "false");
  search.removeAttribute("aria-activedescendant");
}

function renderSuggestions() {
  const list = matches(search.value);
  suggestions.replaceChildren();
  if (!open) {
    closeList();
    return;
  }

  if (list.length === 0) {
    const empty = document.createElement("div");
    empty.className = "list-group-item sprite-caption";
    empty.textContent = "No Pokémon by that name.";
    suggestions.append(empty);
    suggestions.hidden = false;
    search.setAttribute("aria-expanded", "true");
    search.removeAttribute("aria-activedescendant");
    return;
  }

  list.forEach((pokemon, index) => {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "list-group-item list-group-item-action d-flex align-items-center gap-3";
    option.id = `suggestion-${pokemon.slug}`;
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", index === activeIndex ? "true" : "false");
    if (index === activeIndex) option.classList.add("active");

    const image = document.createElement("img");
    image.alt = "";
    image.width = 48;
    image.height = 48;
    image.className = "suggestion-art";
    applyHomeSprite(image, pokemon);

    const label = document.createElement("span");
    label.className = "fw-bold";
    label.append(highlight(pokemon.name, search.value));

    const dex = document.createElement("span");
    dex.className = "ms-auto small suggestion-dex";
    dex.textContent = dexNumber(pokemon);

    option.append(image, label, dex);
    option.addEventListener("mousedown", (event) => {
      event.preventDefault();
      choose(pokemon);
    });
    suggestions.append(option);
  });

  suggestions.hidden = false;
  search.setAttribute("aria-expanded", "true");
  const active = suggestions.querySelector(".active");
  if (active) search.setAttribute("aria-activedescendant", active.id);
  else search.removeAttribute("aria-activedescendant");
}

function choose(pokemon) {
  search.value = pokemon.name;
  selectPokemon(pokemon);
  closeList();
}

function moveActive(delta) {
  const list = matches(search.value);
  if (!list.length) return;
  open = true;
  if (activeIndex === -1) activeIndex = delta > 0 ? 0 : list.length - 1;
  else activeIndex = (activeIndex + delta + list.length) % list.length;
  renderSuggestions();
  suggestions.querySelector(".active")?.scrollIntoView({ block: "nearest" });
}

search.addEventListener("focus", () => {
  open = true;
  showAll = true;
  activeIndex = -1;
  search.select();
  renderSuggestions();
});

search.addEventListener("input", () => {
  open = true;
  showAll = false;
  activeIndex = -1;
  renderSuggestions();
});

search.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    moveActive(1);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    moveActive(-1);
  } else if (event.key === "Escape") {
    closeList();
  } else if (event.key === "Enter") {
    event.preventDefault();
    const list = matches(search.value);
    const picked = list[activeIndex] || (list.length === 1 ? list[0] : null);
    if (picked) choose(picked);
  }
});

search.addEventListener("blur", () => {
  setTimeout(() => {
    if (!suggestions.contains(document.activeElement)) closeList();
  }, 0);
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".search-panel")) closeList();
});

for (const button of sampleButtons) {
  button.addEventListener("click", () => {
    const pokemon = catalog.bySlug.get(button.dataset.slug);
    if (!pokemon) return;
    choose(pokemon);
  });
}

shinyOn = new URLSearchParams(location.search).get("shiny") === "1";
shinyToggle.checked = shinyOn;
shinyToggle.toggleAttribute("checked", shinyOn);
shinyToggle.addEventListener("change", () => {
  shinyOn = shinyToggle.checked;
  rememberLocation(catalog.bySlug.get(currentSlug));
  refreshHomeArt();
});

loadCatalog()
  .then((loaded) => {
    catalog = loaded;
    const fromHash = catalog.bySlug.get(decodeURIComponent(location.hash.replace("#", "")));
    const initialPokemon = fromHash || catalog.bySlug.get("gengar");
    search.value = initialPokemon.name;
    selectPokemon(initialPokemon);
  })
  .catch((error) => {
    resultsNote.textContent = "Could not load the Pokédex.";
    console.error(error);
  });
