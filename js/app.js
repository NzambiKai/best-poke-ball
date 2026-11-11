"use strict";

/**
 * Layout behaviour only: a static sample list for the search box, and
 * swapping the selected Pokémon's HOME artwork and name.
 * Ball matching is a later pass. See js/balls.js.
 */

const HOME_SPRITE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/";

// English species names and National Dex ids from PokeAPI.
const SAMPLES = [
  { id: 1, slug: "bulbasaur", name: "Bulbasaur", types: ["grass", "poison"] },
  { id: 6, slug: "charizard", name: "Charizard", types: ["fire", "flying"] },
  { id: 25, slug: "pikachu", name: "Pikachu", types: ["electric"] },
  { id: 94, slug: "gengar", name: "Gengar", types: ["ghost", "poison"] },
  { id: 131, slug: "lapras", name: "Lapras", types: ["water", "ice"] },
  { id: 197, slug: "umbreon", name: "Umbreon", types: ["dark"] },
  { id: 700, slug: "sylveon", name: "Sylveon", types: ["fairy"] },
];

const TYPE_LABEL = {
  grass: "Grass",
  poison: "Poison",
  fire: "Fire",
  flying: "Flying",
  electric: "Electric",
  ghost: "Ghost",
  water: "Water",
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

let activeIndex = -1;
let currentSlug = "gengar";
let open = false;
let showAll = false;

function dexNumber(id) {
  return `No. ${String(id).padStart(3, "0")}`;
}

function matches(query) {
  if (showAll) return SAMPLES.slice();
  const q = query.trim().toLowerCase();
  if (!q) return SAMPLES.slice();
  return SAMPLES.filter(
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
    const pokemon = SAMPLES.find((entry) => entry.slug === button.dataset.slug);
    if (!pokemon) return;
    choose(pokemon);
  });
}

const fromHash = SAMPLES.find((pokemon) => pokemon.slug === location.hash.replace("#", ""));
const initialPokemon = fromHash || SAMPLES.find((pokemon) => pokemon.slug === "gengar");
search.value = initialPokemon.name;
selectPokemon(initialPokemon);
