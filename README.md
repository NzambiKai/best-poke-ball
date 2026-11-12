# Best Poké Ball

Fan-made quick reference for Poké Balls that suit a Pokémon's look and vibe.

Best Poké Ball is not affiliated with Nintendo, Game Freak, or The Pokémon Company.

## View it locally

From the repository root:

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080

The page is static and suited to GitHub Pages. Pokémon data and artwork are in this repository. Bootstrap and the fonts still load from their CDNs, so viewing the layout needs a network connection for those.

## Sync the Pokédex

[`scripts/sync-pokedex.mjs`](scripts/sync-pokedex.mjs) rebuilds `data/` and `assets/` from PokeAPI. It uses Node's built-in `fetch` and does not install packages. HOME sprites are converted to WebP at quality 90 with `cwebp`. `dwebp`, from the same `webp` package, reads those files to write each form's regular and shiny colours into `data/palettes.json`. Ball item icons stay PNG.

```bash
# Debian/Ubuntu
sudo apt-get install webp
node scripts/sync-pokedex.mjs
```

The script resolves the current PokeAPI sprites commit first, then downloads ball icons from that commit and records the sha in `data/source.json`. It writes only `data/` and `assets/`. It reads ball ids from [`js/balls.js`](js/balls.js), [`js/overrides.js`](js/overrides.js), and [`js/form-rules.js`](js/form-rules.js), and it always downloads the Poké Ball icon used as the favicon. A HOME sprite that is already in `assets/` is left in place. Cached responses live in `.cache/`, which is gitignored. Re-running does not change the hand-edited rule list, ball catalogue, or overrides.

## What's in this mockup

- Header and a short introduction
- Search box over the National Dex, showing twelve matches at a time, and a Shiny switch beside it
- Selected Pokémon panel with local Pokémon HOME art and the PokeAPI name. The switch swaps every Pokémon image to the shiny HOME sprite when that file exists, and shows the regular sprite with "No shiny art" when it does not. Ball cards follow the shiny palette whenever shiny art is shown. A form marked `shinyLocked` keeps the regular sprite and the regular palette, and shows a Shiny-locked badge instead of requesting the shiny file
- One to three ball cards for the selected Pokémon, ranked on colour
- Evolution line for that family. A straight chain is a row, a split such as Eevee or Wurmple branches, and a later split such as Applin or Kirlia nests under the branch. A regional form stays on that regional line when every stage has the same suffix
- A Variants section for species that have other forms (regional forms, Mega Evolutions, Gigantamax, gender differences, and other alternate forms). It stays hidden when a Pokémon has none
- Per-form obtainability in [`js/form-rules.js`](js/form-rules.js). `rulesFor(slug)` returns `cherishOnly` and `shinyLocked`, both false unless that form is listed. The rules cover main-series games only. A Cherish-only form shows a single Cherish Ball card instead of the ranked matches. Original Color Magearna, Zarude, and Dada Zarude are seeded as Cherish-only. Magearna, Original Color Magearna, Zarude, and Dada Zarude are seeded as shiny-locked. The list needs verifying
- Fan-project disclaimer in the footer

## Matching

[`js/matching.js`](js/matching.js) shows one to three balls for a form. A ball qualifies only when its shell matches colours measured on the HOME sprite that is on screen ([`data/palettes.json`](data/palettes.json) stores a regular palette and a shiny palette for each form). A faint tint counts as that hue only when a stronger patch of the same hue is on the sprite, or when that pale hue covers most of a light body. A gray shell with a lilac cast is not pink, and a pale pink body still is. A dark neutral coat matches a black or navy shell, a mid gray matches a gray shell, and a light coat matches white. Pink and purple only share a score when the hues are actually close. A shell colour that clashes with the sprite pulls the ball down when that clash is a large part of the ball. A small high-contrast mark can add one more ball after the body matches. When the Master Ball is the only ball that qualified, one or two of the next visual matches are shown with it, because that ball is the rarest one in the games. Balls that pass are ranked by how much of the Pokémon they cover and how much of the ball that colour explains. A later ball can look like an earlier one. A large region the stricter matches left uncovered can add one more ball at a looser colour match. Type tags on [`js/balls.js`](js/balls.js) only break a tie between balls that already passed and whose colour scores are close. Those tags are the ball's look, not its catch bonus. The Shiny switch uses the shiny palette when that form has shiny art. A Shiny-locked form, and a form with no shiny art, keep the regular palette.

The catalogue is the balls a main-series game can catch with, outside Legends: Arceus. Feather, Wing, Jet, Leaden, Gigaton, Hisuian Heavy, and Origin are left out because they are catchable only in that game. Hisuian Poké, Great, and Ultra Balls are left out because their shells repeat the modern balls. Park Ball is left out because it is the Pal Park ball. Strange Ball is left out because it cannot be thrown; it only appears for a Hisuian-ball Pokémon moved to another game. Picnic toys and held items are left out too. The sync downloads icons only for ids still in the catalogue.

[`js/overrides.js`](js/overrides.js) is a hand-edited list of full replacements. It ships empty. `cherishOnly` is applied before that list and before the ranking.

The Cherish rule covers main-series games only. Pokémon GO is out of scope. A Pokémon HOME transfer counts only when its origin is a main-series game. If that exact form has only ever been released in a Cherish Ball, the page shows one Cherish Ball card everywhere balls appear: the selected Pokémon, its evolution stage, and its variant card. The flag is per form. Original Color Magearna, Zarude, and Dada Zarude are Cherish-only. Standard Magearna is ranked with the other forms, because the Legends: Z-A side mission gifts one in a Poké Ball. The seeded list needs verifying.

`shinyLocked` is the other flag in that file. Set it only when no legitimate shiny of that exact form exists in any main-series game. With the Shiny switch on, a locked form keeps the regular artwork and shows a Shiny-locked badge on the selected Pokémon and on that form's evolution and variant image. The page does not request the shiny file. A form that is not locked still uses shiny art, and a missing shiny file still shows "No shiny art". Magearna, Original Color Magearna, Zarude, and Dada Zarude stay seeded from Bulbapedia's main-series shiny-lock list.

## Sources and licensing

Pokémon artwork and ball icons in `assets/` come from the [PokeAPI sprites](https://github.com/PokeAPI/sprites) repository at commit `1b3b7c0a538dd2226ae08d0d2f8955125075bbd4`. The images are copyright The Pokémon Company. That repository is distributed under CC0 1.0. CC0 covers only rights the repository maintainers hold. It does not grant The Pokémon Company's copyright.

Names, National Dex numbers, evolution chains, and form names follow [PokeAPI](https://pokeapi.co/). PokeAPI's code and compilation are BSD-3-Clause. Pokémon and Pokémon character names are trademarks of Nintendo.

HOME sprites are stored as WebP at quality 90. Ball icons, including the favicon, stay PNG. [Bootstrap 5.3.9](https://github.com/twbs/bootstrap) and the Fredoka and Nunito fonts stay on their CDNs. The page does not call PokeAPI or raw.githubusercontent.com while you use it.

This project is a fan work and is not affiliated with Nintendo, Game Freak, or The Pokémon Company.
