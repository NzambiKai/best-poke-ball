"use strict";

/**
 * Layout behaviour only: search, the selected Pokémon, and the evolution
 * line. Ball cards are placeholder copy from js/evolutions.js.
 * Matching is a later pass. See js/balls.js, which this page does not read.
 */

const HOME_SPRITE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/";
const ITEM_SPRITE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/";

const BY_SLUG = new Map(POKEDEX.map((pokemon) => [pokemon.slug, pokemon]));
const BY_ID = new Map(POKEDEX.map((pokemon) => [pokemon.id, pokemon]));

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

let activeIndex = -1;
let currentSlug = "gengar";
let open = false;
let showAll = false;

function dexNumber(id) {
  return `No. ${String(id).padStart(3, "0")}`;
}

function matches(query) {
  if (showAll) return POKEDEX.slice();
  const q = query.trim().toLowerCase();
  if (!q) return POKEDEX.slice();
  return POKEDEX.filter(
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

function featuredCard(card, index) {
  const column = document.createElement("div");
  column.className = "col-12 col-lg-4";
  const article = document.createElement("article");
  article.className = "card soft-card ball-card rounded-4 h-100";
  article.dataset.accent = String(index + 1);
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
  hidden.textContent = `Sample result ${index + 1}: `;
  heading.append(hidden, document.createTextNode(card.name));
  headingRow.append(rank, heading);
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
  const cards = (SAMPLE_CARDS[pokemon.id] || []).slice(0, 3);
  featuredBalls.replaceChildren(...cards.map(featuredCard));
  resultsNote.textContent = `Sample cards for ${pokemon.name}. Matching comes in a later pass.`;
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

function stageCard(pokemon) {
  const selected = pokemon.slug === currentSlug;
  const article = document.createElement("article");
  article.className = `card soft-card evo-stage h-100${selected ? " is-selected" : ""}`;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "evo-pick";
  button.setAttribute("aria-pressed", selected ? "true" : "false");

  const image = document.createElement("img");
  image.className = "evo-art";
  image.src = `${HOME_SPRITE}${pokemon.id}.png`;
  image.alt = "";
  image.width = 96;
  image.height = 96;

  const name = document.createElement("span");
  name.className = "evo-name";
  name.textContent = pokemon.name;

  const dex = document.createElement("span");
  dex.className = "evo-dex";
  dex.textContent = dexNumber(pokemon.id);

  button.append(image, name, dex);
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
  (SAMPLE_CARDS[pokemon.id] || []).slice(0, 3).forEach((card) => {
    const item = document.createElement("li");
    item.className = "list-group-item";
    const ball = document.createElement("img");
    ball.className = "evo-ball";
    ball.src = `${ITEM_SPRITE}${card.ball}.png`;
    ball.alt = "";
    ball.width = 60;
    ball.height = 60;
    const text = document.createElement("div");
    const title = document.createElement("div");
    title.className = "fw-bold";
    title.textContent = card.name;
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

function renderEvolution(pokemon) {
  const family = FAMILIES[pokemon.family];
  const restoreFocus = evolutionLine.contains(document.activeElement);
  evolutionNote.textContent = family.note;
  evolutionLine.replaceChildren();

  if (family.shape === "branch") {
    const top = document.createElement("div");
    top.className = "row justify-content-center mb-3";
    const topCol = document.createElement("div");
    topCol.className = "col-12 col-md-8 col-lg-5";
    topCol.append(stageCard(BY_ID.get(family.base)));
    top.append(topCol);

    const label = document.createElement("p");
    label.className = "evo-branch-label mb-2";
    label.textContent = "Evolves into";

    const grid = document.createElement("div");
    grid.className = "row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-3";
    for (const id of family.branches) {
      const col = document.createElement("div");
      col.className = "col";
      col.append(stageCard(BY_ID.get(id)));
      grid.append(col);
    }
    evolutionLine.append(top, label, grid);
  } else if (family.shape === "single") {
    const row = document.createElement("div");
    row.className = "row";
    const col = document.createElement("div");
    col.className = "col-12 col-lg-6";
    col.append(stageCard(BY_ID.get(family.ids[0])));
    row.append(col);
    evolutionLine.append(row);
  } else {
    const line = document.createElement("div");
    line.className = "evo-line";
    family.ids.forEach((id, index) => {
      if (index > 0) line.append(evolutionArrow());
      line.append(stageCard(BY_ID.get(id)));
    });
    evolutionLine.append(line);
  }

  if (restoreFocus) {
    evolutionLine.querySelector(".evo-stage.is-selected .evo-pick")?.focus({ preventScroll: true });
  }
}

function selectPokemon(pokemon) {
  currentSlug = pokemon.slug;
  art.src = `${HOME_SPRITE}${pokemon.id}.png`;
  art.alt = `${pokemon.name}, Pokémon HOME artwork`;
  nameEl.textContent = pokemon.name;
  dexEl.textContent = dexNumber(pokemon.id);
  typesEl.replaceChildren();
  for (const type of pokemon.types) {
    const badge = document.createElement("span");
    badge.className = `badge rounded-pill type-badge type-${type}`;
    badge.textContent = TYPE_LABEL[type] || type;
    typesEl.append(badge);
  }
  for (const button of sampleButtons) {
    const selected = button.dataset.slug === pokemon.slug;
    button.className = selected
      ? "btn btn-outline-danger sample-btn"
      : "btn btn-light border sample-btn";
    button.setAttribute("aria-pressed", selected ? "true" : "false");
  }
  renderFeaturedBalls(pokemon);
  renderEvolution(pokemon);
  document.title = `${pokemon.name} · Best Poké Ball`;
  if (location.hash !== `#${pokemon.slug}`) {
    history.replaceState(null, "", `#${pokemon.slug}`);
  }
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
    empty.textContent = "No sample Pokémon by that name. Try Gengar or Pikachu.";
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
    image.src = `${HOME_SPRITE}${pokemon.id}.png`;
    image.alt = "";
    image.width = 48;
    image.height = 48;
    image.className = "suggestion-art";

    const label = document.createElement("span");
    label.className = "fw-bold";
    label.append(highlight(pokemon.name, search.value));

    const dex = document.createElement("span");
    dex.className = "ms-auto small suggestion-dex";
    dex.textContent = dexNumber(pokemon.id);

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
    const pokemon = BY_SLUG.get(button.dataset.slug);
    if (!pokemon) return;
    choose(pokemon);
  });
}

const fromHash = BY_SLUG.get(location.hash.replace("#", ""));
const initialPokemon = fromHash || BY_SLUG.get("gengar");
search.value = initialPokemon.name;
selectPokemon(initialPokemon);
