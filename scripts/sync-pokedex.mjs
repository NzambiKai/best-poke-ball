/**
 * Rebuild data/ and assets/ from PokeAPI.
 *
 *   node scripts/sync-pokedex.mjs
 *
 * Uses Node's built-in fetch only. HOME sprites are converted with cwebp
 * from the webp package (Debian/Ubuntu: sudo apt-get install webp) at
 * quality 90. Ball item icons stay PNG.
 *
 * Writes only under data/ and assets/. Reads ball ids from the hand-edited
 * files and never changes them. Raw responses are cached in .cache/.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const API = "https://pokeapi.co/api/v2";
const HOME_MARKER = "/sprites/pokemon/other/home/";
const USER_AGENT = "best-pokeball-sync/1.0";
const WEBP_QUALITY = "90";

// Forms that exist only in Pokémon GO. Empty against the current National Dex.
// A listed slug is skipped even when PokeAPI has a HOME sprite for it.
const GO_DENYLIST = new Set();

const HAND_EDITED = ["js/balls.js", "js/sample-cards.js", "js/form-rules.js"];

function outputPath(rel) {
  const abs = path.resolve(ROOT, rel);
  const roots = ["data", "assets"].map((dir) => path.join(ROOT, dir));
  const allowed = roots.some((root) => abs === root || abs.startsWith(root + path.sep));
  if (!allowed) throw new Error(`Refusing to write outside data/ and assets/: ${abs}`);
  return abs;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchResponse(url) {
  let last = "";
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const response = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    });
    if (response.status === 429 || response.status >= 500) {
      const retryAfter = Number(response.headers.get("retry-after"));
      const wait = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 500 * 2 ** attempt;
      last = `${response.status} ${url}`;
      await sleep(wait);
      continue;
    }
    return response;
  }
  throw new Error(last || `Gave up fetching ${url}`);
}

async function fetchJson(url) {
  const cached = cacheFile(url);
  if (fs.existsSync(cached)) return JSON.parse(fs.readFileSync(cached, "utf8"));
  const response = await fetchResponse(url);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  const json = await response.json();
  fs.mkdirSync(path.dirname(cached), { recursive: true });
  fs.writeFileSync(cached, JSON.stringify(json));
  return json;
}

function cacheFile(url) {
  const rel = url.replace(`${API}/`, "").replace(/\/$/, "");
  if (rel.includes("..") || rel.startsWith("/")) throw new Error(`Unexpected API url ${url}`);
  return path.join(ROOT, ".cache", "pokeapi", `${rel}.json`);
}

async function mapPool(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  async function run() {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

function english(names) {
  const hit = (names || []).find((entry) => entry.language.name === "en");
  return hit ? hit.name : null;
}

function typeNames(types) {
  return [...(types || [])].sort((a, b) => a.slot - b.slot).map((entry) => entry.type.name);
}

function assetFor(url) {
  const index = url.indexOf(HOME_MARKER);
  if (index < 0) throw new Error(`Unexpected HOME sprite url ${url}`);
  let rel = url.slice(index + HOME_MARKER.length);
  if (!rel.endsWith(".png") || rel.includes("..") || rel.startsWith("/")) {
    throw new Error(`Unexpected HOME sprite path ${rel}`);
  }
  rel = `${rel.slice(0, -4)}.webp`;
  return `assets/home/${rel}`;
}

async function listAll(resource) {
  const page = await fetchJson(`${API}/${resource}?limit=10000`);
  if (page.next) throw new Error(`${resource} did not fit in one page`);
  return page.results;
}

function requireCwebp() {
  return new Promise((resolve, reject) => {
    const child = spawn("cwebp", ["-version"], { stdio: "ignore" });
    child.on("error", () => {
      reject(new Error("cwebp is required. Install the webp package (Debian/Ubuntu: sudo apt-get install webp)."));
    });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error("cwebp is required. Install the webp package (Debian/Ubuntu: sudo apt-get install webp)."));
    });
  });
}

function convertWebp(pngPath, assetRel) {
  const dest = outputPath(assetRel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  return new Promise((resolve, reject) => {
    const child = spawn("cwebp", ["-quiet", "-q", WEBP_QUALITY, pngPath, "-o", dest], {
      stdio: ["ignore", "ignore", "pipe"],
    });
    let err = "";
    child.stderr.on("data", (chunk) => {
      err += chunk;
    });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`cwebp failed for ${pngPath}: ${err}`));
    });
  });
}

async function downloadFile(url, dest) {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) return;
  const response = await fetchResponse(url);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, bytes);
}

function ballIds() {
  const ids = new Set(["poke-ball"]);
  const pattern = /(?:\bball|\bid):\s*"([a-z0-9-]+)"/g;
  for (const rel of HAND_EDITED) {
    const text = fs.readFileSync(path.join(ROOT, rel), "utf8");
    for (const match of text.matchAll(pattern)) ids.add(match[1]);
  }
  return [...ids].sort();
}

function trackSprite(downloads, url) {
  if (!url) return null;
  const asset = assetFor(url);
  const previous = downloads.get(asset);
  if (previous && previous !== url) throw new Error(`Two sprites map to ${asset}`);
  downloads.set(asset, url);
  return asset;
}

function spriteRecord(downloads, home) {
  return {
    home: trackSprite(downloads, home?.front_default),
    shiny: trackSprite(downloads, home?.front_shiny),
  };
}

async function main() {
  await requireCwebp();
  const downloads = new Map();
  const omittedNoHome = new Set();
  const omittedGo = new Set();

  process.stderr.write("Fetching National Dex lists\n");
  const [speciesList, chainList] = await Promise.all([listAll("pokemon-species"), listAll("evolution-chain")]);
  const speciesDetails = await mapPool(speciesList, 6, async (entry, index) => {
    if (index > 0 && index % 200 === 0) process.stderr.write(`  species ${index}/${speciesList.length}\n`);
    return fetchJson(entry.url);
  });

  const speciesBySlug = new Map();
  const national = [];
  for (const species of speciesDetails) {
    const dex = (species.pokedex_numbers || []).find((entry) => entry.pokedex.name === "national");
    if (!dex) continue;
    const record = {
      slug: species.name,
      english: english(species.names) || species.name,
      dex: dex.entry_number,
      varieties: species.varieties,
      chain: species.evolution_chain.url,
    };
    speciesBySlug.set(species.name, record);
    national.push(record);
  }

  const varietyJobs = national.flatMap((species) =>
    species.varieties.map((variety) => ({ species, name: variety.pokemon.name, url: variety.pokemon.url, isDefault: variety.is_default === true }))
  );
  process.stderr.write(`Fetching ${varietyJobs.length} varieties\n`);
  const varietyPokemon = await mapPool(varietyJobs, 6, async (job, index) => {
    if (index > 0 && index % 200 === 0) process.stderr.write(`  varieties ${index}/${varietyJobs.length}\n`);
    return { job, pokemon: await fetchJson(job.url) };
  });

  process.stderr.write("Fetching forms\n");
  const formList = await listAll("pokemon-form");
  const forms = await mapPool(formList, 6, async (entry, index) => {
    if (index > 0 && index % 200 === 0) process.stderr.write(`  forms ${index}/${formList.length}\n`);
    return fetchJson(entry.url);
  });
  const formByName = new Map(forms.map((form) => [form.name, form]));

  const entries = [];
  const slugs = new Set();
  const varietyBySlug = new Map();

  function addEntry(entry) {
    if (slugs.has(entry.slug)) throw new Error(`Duplicate slug ${entry.slug}`);
    slugs.add(entry.slug);
    entries.push(entry);
  }

  for (const { job, pokemon } of varietyPokemon) {
    const slug = pokemon.name;
    if (GO_DENYLIST.has(slug)) {
      omittedGo.add(slug);
      continue;
    }
    const home = pokemon.sprites?.other?.home;
    if (!home?.front_default) {
      omittedNoHome.add(slug);
      continue;
    }
    const form = formByName.get(slug);
    const name = job.isDefault ? job.species.english : english(form?.names) || job.species.english;
    const entry = {
      slug,
      name,
      dex: job.species.dex,
      speciesSlug: job.species.slug,
      speciesName: job.species.english,
      types: typeNames(pokemon.types),
      kind: "variety",
      isDefault: job.isDefault,
      sprites: spriteRecord(downloads, home),
    };
    addEntry(entry);
    varietyBySlug.set(slug, entry);
    if (home.front_female) {
      const femaleSlug = `${slug}-female`;
      if (GO_DENYLIST.has(femaleSlug)) {
        omittedGo.add(femaleSlug);
      } else {
        addEntry({
          slug: femaleSlug,
          name: `Female ${entry.name}`,
          dex: entry.dex,
          speciesSlug: entry.speciesSlug,
          speciesName: entry.speciesName,
          types: entry.types,
          kind: "female",
          isDefault: false,
          sprites: {
            home: trackSprite(downloads, home.front_female),
            shiny: trackSprite(downloads, home.front_shiny_female),
          },
        });
      }
    }
  }

  for (const species of national) {
    if (![...varietyBySlug.values()].some((entry) => entry.speciesSlug === species.slug && entry.isDefault)) {
      throw new Error(`National species ${species.slug} has no default variety with HOME art`);
    }
  }

  for (const form of forms) {
    const slug = form.name;
    if (slugs.has(slug) || form.is_default) continue;
    if (GO_DENYLIST.has(slug)) {
      omittedGo.add(slug);
      continue;
    }
    const parentSlug = form.pokemon.name;
    const parent = varietyBySlug.get(parentSlug);
    const home = form.sprites?.other?.home;
    if (!home?.front_default) {
      omittedNoHome.add(slug);
      continue;
    }
    if (parent && home.front_default === downloads.get(parent.sprites.home)) continue;
    const species = speciesBySlug.get(parent?.speciesSlug) || [...speciesBySlug.values()].find((item) => item.varieties.some((variety) => variety.pokemon.name === parentSlug));
    if (!species) {
      omittedNoHome.add(slug);
      continue;
    }
    addEntry({
      slug,
      name: english(form.names) || slug,
      dex: species.dex,
      speciesSlug: species.slug,
      speciesName: species.english,
      types: form.types?.length ? typeNames(form.types) : parent?.types || [],
      kind: "form",
      isDefault: false,
      sprites: spriteRecord(downloads, home),
    });
  }

  entries.sort((a, b) => a.dex - b.dex || Number(b.isDefault) - Number(a.isDefault) || a.name.localeCompare(b.name));

  process.stderr.write("Fetching evolution chains\n");
  const chains = await mapPool(chainList, 6, async (entry, index) => {
    if (index > 0 && index % 100 === 0) process.stderr.write(`  chains ${index}/${chainList.length}\n`);
    return fetchJson(entry.url);
  });
  const families = {};
  function walk(node) {
    const name = node.species.name;
    if (!speciesBySlug.has(name)) return;
    const children = [];
    for (const child of node.evolves_to) {
      if (speciesBySlug.has(child.species.name)) children.push(child.species.name);
      walk(child);
    }
    families[name] = children;
  }
  for (const chain of chains) walk(chain.chain);
  for (const species of national) {
    if (!families[species.slug]) families[species.slug] = [];
  }

  process.stderr.write(`Downloading ${downloads.size} HOME sprites\n`);
  const spriteJobs = [...downloads.entries()];
  await mapPool(spriteJobs, 10, async ([asset, url], index) => {
    if (index > 0 && index % 250 === 0) process.stderr.write(`  sprites ${index}/${spriteJobs.length}\n`);
    const rel = asset.slice("assets/home/".length).replace(/\.webp$/, ".png");
    const cached = path.join(ROOT, ".cache", "sprites", rel);
    await downloadFile(url, cached);
    await convertWebp(cached, asset);
  });

  const icons = ballIds();
  process.stderr.write(`Downloading ${icons.length} ball icons\n`);
  for (const id of icons) {
    const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${id}.png`;
    const dest = outputPath(`assets/items/${id}.png`);
    await downloadFile(url, dest);
  }

  const commitResponse = await fetchResponse("https://api.github.com/repos/PokeAPI/sprites/commits/master");
  if (!commitResponse.ok) throw new Error(`${commitResponse.status} sprites commit`);
  const commit = await commitResponse.json();

  const source = {
    generatedAt: new Date().toISOString(),
    pokeapi: `${API}/`,
    spritesRepository: "https://github.com/PokeAPI/sprites",
    spritesCommit: commit.sha,
    webpQuality: Number(WEBP_QUALITY),
    webpTool: "cwebp",
    speciesCount: national.length,
    varietyCount: entries.filter((entry) => entry.kind === "variety").length,
    formCount: entries.filter((entry) => entry.kind === "form").length,
    femaleCount: entries.filter((entry) => entry.kind === "female").length,
    entryCount: entries.length,
    familyCount: Object.keys(families).length,
    goDenylist: [...GO_DENYLIST].sort(),
    omittedGo: [...omittedGo].sort(),
    omittedNoHome: [...omittedNoHome].sort(),
  };

  fs.mkdirSync(outputPath("data"), { recursive: true });
  fs.writeFileSync(outputPath("data/pokemon.json"), `${JSON.stringify(entries, null, 2)}\n`);
  fs.writeFileSync(outputPath("data/families.json"), `${JSON.stringify(families, null, 2)}\n`);
  fs.writeFileSync(outputPath("data/source.json"), `${JSON.stringify(source, null, 2)}\n`);

  if (omittedGo.size) process.stderr.write(`Skipped GO-only forms: ${[...omittedGo].sort().join(", ")}\n`);
  process.stderr.write(`Wrote ${entries.length} entries, ${Object.keys(families).length} families, ${downloads.size} sprites\n`);
  process.stderr.write(`Omitted with no HOME art: ${source.omittedNoHome.join(", ")}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
