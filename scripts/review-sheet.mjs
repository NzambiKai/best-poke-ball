/**
 * Dev-only contact sheet for ball picks. Not loaded by the site.
 *
 *   node scripts/review-sheet.mjs [out-dir]
 *   node scripts/review-sheet.mjs --shiny [out-dir]
 *
 * Writes sheet-1.png, sheet-2.png, ... and picks.txt. Each row is the HOME
 * sprite, the extracted palette, and the balls js/matching.js chose.
 * --shiny uses the shiny sprite and the shiny palette. Forms with no shiny
 * art are listed in missing.txt and left off the sheet.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const shinyMode = args.includes("--shiny");
const outDir = path.resolve(args.find((arg) => !arg.startsWith("--")) || "/tmp/review-sheets");
fs.mkdirSync(outDir, { recursive: true });

const REQUIRED = [
  "pikachu", "charizard", "gengar", "sylveon", "umbreon", "lapras", "snorlax", "metagross", "scizor", "mewtwo",
  "machamp", "gholdengo", "annihilape", "venusaur-female", "heracross", "decidueye", "lopunny-mega", "houndoom", "ponyta-galar",
  "bulbasaur", "charmander", "squirtle", "chikorita", "cyndaquil", "totodile", "treecko", "torchic", "mudkip",
  "turtwig", "chimchar", "piplup", "snivy", "tepig", "oshawott", "chespin", "fennekin", "froakie",
  "rowlet", "litten", "popplio", "grookey", "scorbunny", "sobble", "sprigatito", "fuecoco", "quaxly",
  "venusaur", "blastoise", "typhlosion", "sceptile", "blaziken", "infernape", "empoleon", "serperior", "greninja",
  "cinderace", "meowscarada", "skeledirge",
  "articuno", "zapdos", "moltres", "mew", "lugia", "ho-oh", "rayquaza", "dialga", "palkia", "giratina-altered",
  "reshiram", "zekrom", "xerneas", "yveltal", "solgaleo", "lunala", "zacian", "koraidon", "miraidon", "calyrex",
  "charizard-mega-x", "charizard-mega-y", "gengar-mega", "gyarados-mega", "mewtwo-mega-x", "mewtwo-mega-y",
  "gardevoir-mega", "lucario-mega", "scizor-mega", "garchomp-mega",
  "ninetales-alola", "raichu-alola", "meowth-galar", "rapidash-galar", "slowpoke-galar", "articuno-galar",
  "growlithe-hisui", "zoroark-hisui", "wooper-paldea", "tauros-paldea-blaze-breed", "moltres-galar", "sneasel-hisui",
  "jigglypuff", "ditto", "magnemite", "onix", "porygon", "castform", "cresselia", "togekiss", "darkrai", "absol",
  "spiritomb", "milotic", "dragapult", "mimikyu-disguised", "tinkaton", "ceruledge", "flutter-mane",
  "eevee", "espeon", "vaporeon", "jolteon", "flareon", "leafeon", "glaceon",
  "gyarados", "dragonite", "tyranitar", "gardevoir", "lucario", "garchomp", "salamence",
  "pidgey", "rattata", "chansey", "gligar", "miltank", "bulbasaur", "suicune", "genesect", "aerodactyl", "sableye",
];

const src = ["js/balls.js", "js/overrides.js", "js/form-rules.js", "js/matching.js"].map((file) => fs.readFileSync(path.join(ROOT, file), "utf8")).join("\n");
const pokemon = JSON.parse(fs.readFileSync(path.join(ROOT, "data/pokemon.json"), "utf8"));
const palettes = JSON.parse(fs.readFileSync(path.join(ROOT, "data/palettes.json"), "utf8"));
const bySlug = Object.fromEntries(pokemon.map((mon) => [mon.slug, mon]));
const slugs = [];
const seen = new Set();
const missingShiny = [];
for (const slug of REQUIRED) {
  if (seen.has(slug) || !bySlug[slug] || !palettes[slug]) continue;
  seen.add(slug);
  if (shinyMode && !palettes[slug].shiny) {
    missingShiny.push(slug);
    continue;
  }
  slugs.push(slug);
}

const rows = [];
const sandbox = { bySlug, palettes, slugs, rows, shinyMode, console };
vm.runInNewContext(`${src}
for (const slug of slugs) {
  const mon = bySlug[slug];
  const stored = palettes[slug];
  const palette = shinyMode ? stored.shiny : stored.regular;
  const regions = regionsFor(palette);
  const ranked = rankBalls(mon, palette);
  rows.push({
    slug,
    name: shinyMode ? "Shiny " + mon.name : mon.name,
    sprite: shinyMode ? mon.sprites.shiny : mon.sprites.home,
    colors: (palette.colors || []).map((color) => ({ hex: color.hex, share: color.share })),
    neutral: palette.neutral || {},
    picks: ranked.map((row) => {
      const matched = [...row.covered.keys()].map((index) => regions[index]).filter(Boolean);
      return {
        id: row.ball.id,
        name: row.ball.name.replace(" Ball", ""),
        score: Number(row.score.toFixed(3)),
        loose: Boolean(row.loose),
        castOnly: matched.length > 0 && matched.every((region) => region.cast),
      };
    }),
  });
}
`, sandbox);

const flags = [];
for (const row of rows) {
  for (const pick of row.picks) {
    if (pick.castOnly) flags.push(`${row.slug}: ${pick.name} matches only a faint cast`);
  }
}
fs.writeFileSync(path.join(outDir, "picks.txt"), rows.map((row) => `${row.slug}\t${row.picks.map((pick) => `${pick.name}${pick.loose ? "*" : ""} ${pick.score}`).join(", ")}`).join("\n") + "\n");
if (shinyMode) fs.writeFileSync(path.join(outDir, "missing.txt"), missingShiny.join("\n") + (missingShiny.length ? "\n" : ""));
fs.writeFileSync(path.join(outDir, "flags.txt"), flags.join("\n") + (flags.length ? "\n" : ""));
fs.writeFileSync(path.join(outDir, "rows.json"), JSON.stringify(rows));

const drawer = spawnSync("python3", [path.join(ROOT, "scripts/review-draw.py")], {
  input: JSON.stringify({ root: ROOT, outDir, rows }),
  encoding: "utf8",
  maxBuffer: 1024 * 1024,
});
if (drawer.status !== 0) {
  console.error(drawer.stderr || drawer.stdout);
  process.exit(drawer.status || 1);
}
process.stdout.write(drawer.stdout);
console.log(`rows ${rows.length}, cast-only flags ${flags.length}${shinyMode ? `, missing shiny ${missingShiny.length}` : ""}`);
if (flags.length) console.log(flags.join("\n"));
