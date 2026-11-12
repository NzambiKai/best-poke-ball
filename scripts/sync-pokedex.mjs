/**
 * Rebuild data/ and assets/ from PokeAPI.
 *
 *   node scripts/sync-pokedex.mjs
 *
 * Uses Node's built-in fetch only. HOME sprites are converted with cwebp
 * from the webp package (Debian/Ubuntu: sudo apt-get install webp) at
 * quality 90. dwebp, from the same package, reads those WebP files to
 * write data/palettes.json. Ball item icons stay PNG.
 *
 * The sprites commit is resolved first. Ball icons are downloaded from
 * that commit, and the same sha is recorded in data/source.json.
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

function requireTool(bin) {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, ["-version"], { stdio: "ignore" });
    const fail = () => {
      reject(new Error(`${bin} is required. Install the webp package (Debian/Ubuntu: sudo apt-get install webp).`));
    };
    child.on("error", fail);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else fail();
    });
  });
}

// Pixels below this OKLab chroma are black, gray, or white rather than a hue.
const NEUTRAL_CHROMA = 0.03;
const BLACK_L = 0.32;
const WHITE_L = 0.85;
const MERGE_DISTANCE = 0.08;
const MIN_COLOR_SHARE = 0.04;
const MAX_COLORS = 4;
const ALPHA_MIN = 170;
const SAMPLE_STEP = 2;

function srgbToLinear(channel) {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function oklabFromRgb(r, g, b) {
  const red = srgbToLinear(r);
  const green = srgbToLinear(g);
  const blue = srgbToLinear(b);
  const l = Math.cbrt(0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue);
  const m = Math.cbrt(0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue);
  const s = Math.cbrt(0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function rgbHex(r, g, b) {
  const channel = (value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0");
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

function round3(value) {
  return Math.round(value * 1000) / 1000;
}

function dwebpPam(webpPath) {
  return new Promise((resolve, reject) => {
    const child = spawn("dwebp", [webpPath, "-pam", "-o", "-"], { stdio: ["ignore", "pipe", "pipe"] });
    const chunks = [];
    let err = "";
    child.stdout.on("data", (chunk) => chunks.push(chunk));
    child.stderr.on("data", (chunk) => {
      err += chunk;
    });
    child.on("error", () => reject(new Error(`dwebp failed for ${webpPath}`)));
    child.on("close", (code) => {
      if (code === 0) resolve(Buffer.concat(chunks));
      else reject(new Error(`dwebp failed for ${webpPath}: ${err}`));
    });
  });
}

function parsePam(buffer) {
  const marker = buffer.indexOf("ENDHDR\n");
  if (marker < 0) throw new Error("PAM header missing");
  const header = buffer.slice(0, marker).toString("ascii");
  let width = 0;
  let height = 0;
  let depth = 0;
  for (const line of header.split("\n")) {
    const [key, value] = line.split(/\s+/);
    if (key === "WIDTH") width = Number(value);
    else if (key === "HEIGHT") height = Number(value);
    else if (key === "DEPTH") depth = Number(value);
  }
  if (!width || !height || depth !== 4) throw new Error(`Unexpected PAM header ${width}x${height} depth ${depth}`);
  return { width, height, body: buffer.slice(marker + "ENDHDR\n".length) };
}

async function extractPalette(webpPath) {
  const { width, height, body } = parsePam(await dwebpPam(webpPath));
  let opaque = 0;
  const neutralPx = {
    black: { n: 0, r: 0, g: 0, b: 0 },
    gray: { n: 0, r: 0, g: 0, b: 0 },
    white: { n: 0, r: 0, g: 0, b: 0 },
  };
  const buckets = new Map();
  for (let y = 0; y < height; y += SAMPLE_STEP) {
    for (let x = 0; x < width; x += SAMPLE_STEP) {
      const index = (y * width + x) * 4;
      const r = body[index];
      const g = body[index + 1];
      const b = body[index + 2];
      const a = body[index + 3];
      if (a < ALPHA_MIN) continue;
      opaque += 1;
      const lab = oklabFromRgb(r, g, b);
      const chroma = Math.hypot(lab[1], lab[2]);
      if (chroma < NEUTRAL_CHROMA) {
        const bucket = lab[0] < BLACK_L ? neutralPx.black : lab[0] > WHITE_L ? neutralPx.white : neutralPx.gray;
        bucket.n += 1;
        bucket.r += r;
        bucket.g += g;
        bucket.b += b;
        continue;
      }
      const key = `${Math.round(lab[0] * 16)},${Math.round(lab[1] * 16)},${Math.round(lab[2] * 16)}`;
      let bucket = buckets.get(key);
      if (!bucket) {
        bucket = { n: 0, r: 0, g: 0, b: 0, L: 0, a: 0, b2: 0 };
        buckets.set(key, bucket);
      }
      bucket.n += 1;
      bucket.r += r;
      bucket.g += g;
      bucket.b += b;
      bucket.L += lab[0];
      bucket.a += lab[1];
      bucket.b2 += lab[2];
    }
  }
  if (!opaque) return null;

  const clusters = [...buckets.values()]
    .map((bucket) => ({
      n: bucket.n,
      r: bucket.r / bucket.n,
      g: bucket.g / bucket.n,
      b: bucket.b / bucket.n,
      L: bucket.L / bucket.n,
      a: bucket.a / bucket.n,
      b2: bucket.b2 / bucket.n,
    }))
    .sort((left, right) => right.n - left.n);

  const merged = [];
  for (const cluster of clusters) {
    let host = null;
    let nearest = MERGE_DISTANCE;
    for (const kept of merged) {
      const distance = Math.hypot(kept.L - cluster.L, kept.a - cluster.a, kept.b2 - cluster.b2);
      if (distance < nearest) {
        nearest = distance;
        host = kept;
      }
    }
    if (!host) {
      merged.push({ ...cluster });
      continue;
    }
    const count = host.n + cluster.n;
    host.r = (host.r * host.n + cluster.r * cluster.n) / count;
    host.g = (host.g * host.n + cluster.g * cluster.n) / count;
    host.b = (host.b * host.n + cluster.b * cluster.n) / count;
    host.L = (host.L * host.n + cluster.L * cluster.n) / count;
    host.a = (host.a * host.n + cluster.a * cluster.n) / count;
    host.b2 = (host.b2 * host.n + cluster.b2 * cluster.n) / count;
    host.n = count;
  }
  merged.sort((left, right) => right.n - left.n);

  const colors = [];
  for (const cluster of merged) {
    const share = cluster.n / opaque;
    if (share < MIN_COLOR_SHARE) continue;
    colors.push({ hex: rgbHex(cluster.r, cluster.g, cluster.b), share: round3(share) });
    if (colors.length === MAX_COLORS) break;
  }
  const neutral = {};
  for (const name of ["black", "gray", "white"]) {
    const bucket = neutralPx[name];
    neutral[name] = round3(bucket.n / opaque);
    if (bucket.n > 0) neutral[`${name}Hex`] = rgbHex(bucket.r / bucket.n, bucket.g / bucket.n, bucket.b / bucket.n);
  }
  return { colors, neutral };
}

async function writePalettes(entries, speciesColorFor) {
  const found = new Map();
  const failed = [];
  await mapPool(entries, 8, async (entry, index) => {
    if (index > 0 && index % 200 === 0) process.stderr.write(`  palettes ${index}/${entries.length}\n`);
    try {
      const palette = await extractPalette(path.join(ROOT, entry.sprites.home));
      if (!palette || (palette.colors.length === 0 && palette.neutral.black + palette.neutral.gray + palette.neutral.white < 0.2)) {
        failed.push(entry.slug);
        return;
      }
      const speciesColor = speciesColorFor(entry);
      if (speciesColor) palette.speciesColor = speciesColor;
      found.set(entry.slug, palette);
    } catch (error) {
      failed.push(entry.slug);
      process.stderr.write(`  palette failed ${entry.slug}: ${error.message}\n`);
    }
  });
  const ordered = {};
  for (const entry of entries) {
    if (found.has(entry.slug)) ordered[entry.slug] = found.get(entry.slug);
  }
  fs.writeFileSync(outputPath("data/palettes.json"), `${JSON.stringify(ordered, null, 2)}\n`);
  return failed.sort();
}

async function resolveSpritesCommit() {
  const response = await fetchResponse("https://api.github.com/repos/PokeAPI/sprites/commits/master");
  if (!response.ok) throw new Error(`${response.status} sprites commit`);
  const commit = await response.json();
  if (!commit.sha || !/^[0-9a-f]{40}$/.test(commit.sha)) throw new Error("Unexpected sprites commit sha");
  return commit.sha;
}

async function downloadBallIcons(commitSha) {
  const icons = ballIds();
  process.stderr.write(`Downloading ${icons.length} ball icons from ${commitSha.slice(0, 12)}\n`);
  for (const id of icons) {
    const url = `https://raw.githubusercontent.com/PokeAPI/sprites/${commitSha}/sprites/items/${id}.png`;
    const dest = outputPath(`assets/items/${id}.png`);
    await downloadFile(url, dest, true);
  }
}

function convertWebp(pngPath, assetRel) {
  const dest = outputPath(assetRel);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) return Promise.resolve();
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

async function downloadFile(url, dest, fresh = false) {
  if (!fresh && fs.existsSync(dest) && fs.statSync(dest).size > 0) return;
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
  await requireTool("cwebp");
  await requireTool("dwebp");
  const spritesCommit = await resolveSpritesCommit();
  process.stderr.write(`Sprites commit ${spritesCommit}\n`);
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
      color: species.color?.name || null,
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
  const femaleSprites = [];

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
    // PokeAPI copies front_default into front_female for many forms. A real
    // gender sprite lives under the HOME female/ directory.
    if (home.front_female && home.front_female.includes("/home/female/")) {
      femaleSprites.push({
        slug,
        species: job.species,
        name: entry.name,
        dex: entry.dex,
        speciesSlug: entry.speciesSlug,
        speciesName: entry.speciesName,
        types: entry.types,
        home: home.front_female,
        shiny: home.front_shiny_female,
      });
    }
  }

  for (const female of femaleSprites) {
    const femaleSlug = female.slug.endsWith("-male")
      ? `${female.slug.slice(0, -"-male".length)}-female`
      : `${female.slug}-female`;
    if (slugs.has(femaleSlug)) continue;
    if (GO_DENYLIST.has(femaleSlug)) {
      omittedGo.add(femaleSlug);
      continue;
    }
    const name = female.slug.endsWith("-male") ? `Female ${female.species.english}` : `Female ${female.name}`;
    addEntry({
      slug: femaleSlug,
      name,
      dex: female.dex,
      speciesSlug: female.speciesSlug,
      speciesName: female.speciesName,
      types: female.types,
      kind: "female",
      isDefault: false,
      sprites: {
        home: trackSprite(downloads, female.home),
        shiny: trackSprite(downloads, female.shiny),
      },
    });
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
    const dest = outputPath(asset);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) return;
    const rel = asset.slice("assets/home/".length).replace(/\.webp$/, ".png");
    const cached = path.join(ROOT, ".cache", "sprites", rel);
    await downloadFile(url, cached);
    await convertWebp(cached, asset);
  });

  await downloadBallIcons(spritesCommit);

  process.stderr.write(`Reading colours from ${entries.length} HOME sprites\n`);
  const paletteFailed = await writePalettes(entries, (entry) =>
    entry.isDefault ? speciesBySlug.get(entry.speciesSlug)?.color || null : null
  );

  const source = {
    generatedAt: new Date().toISOString(),
    pokeapi: `${API}/`,
    spritesRepository: "https://github.com/PokeAPI/sprites",
    spritesCommit,
    webpQuality: Number(WEBP_QUALITY),
    webpTool: "cwebp, dwebp",
    speciesCount: national.length,
    varietyCount: entries.filter((entry) => entry.kind === "variety").length,
    formCount: entries.filter((entry) => entry.kind === "form").length,
    femaleCount: entries.filter((entry) => entry.kind === "female").length,
    entryCount: entries.length,
    familyCount: Object.keys(families).length,
    goDenylist: [...GO_DENYLIST].sort(),
    omittedGo: [...omittedGo].sort(),
    omittedNoHome: [...omittedNoHome].sort(),
    paletteCount: entries.length - paletteFailed.length,
    paletteFailed,
  };

  fs.mkdirSync(outputPath("data"), { recursive: true });
  fs.writeFileSync(outputPath("data/pokemon.json"), `${JSON.stringify(entries, null, 2)}\n`);
  fs.writeFileSync(outputPath("data/families.json"), `${JSON.stringify(families, null, 2)}\n`);
  fs.writeFileSync(outputPath("data/source.json"), `${JSON.stringify(source, null, 2)}\n`);

  if (omittedGo.size) process.stderr.write(`Skipped GO-only forms: ${[...omittedGo].sort().join(", ")}\n`);
  process.stderr.write(`Wrote ${entries.length} entries, ${Object.keys(families).length} families, ${downloads.size} sprites\n`);
  process.stderr.write(`Omitted with no HOME art: ${source.omittedNoHome.join(", ")}\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export { extractPalette, oklabFromRgb };
