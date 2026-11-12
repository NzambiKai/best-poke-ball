# Best Poké Ball

Fan-made quick reference for Poké Balls that suit a Pokémon's look and vibe. This is a layout mockup: the page structure is ready to react to, and matching comes later.

Best Poké Ball is not affiliated with Nintendo, Game Freak, or The Pokémon Company.

## View it locally

From the repository root:

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080

The page is static and suited to GitHub Pages. Pokémon art loads from the PokeAPI sprites repository, so viewing it needs a network connection.

## What's in this mockup

- Header and a short introduction
- Search box with a static autocomplete of the sample families, and a Shiny switch beside it
- Selected Pokémon panel with Pokémon HOME art and the PokeAPI name. The switch swaps every Pokémon image to the shiny HOME sprite, and falls back to the regular sprite if that file is missing
- Three hard-coded ball cards for the selected Pokémon
- Evolution line for that family, with up to three sample ball cards on every stage (a straight line, Eevee's branches, or a single stage such as Lapras)
- A Variants section for species that have other forms (regional forms, Mega Evolutions, Gigantamax, gender differences, and other alternate forms). It stays hidden when a Pokémon has none
- A per-form Cherish Ball flag in [`js/cherish.js`](js/cherish.js). A form marked there shows a single Cherish Ball card instead of the placeholder suggestions. The seed needs verifying
- Fan-project disclaimer in the footer

## Matching

Not built yet. [`js/balls.js`](js/balls.js) is a stub for a later hand-editable list of balls with colours and theme tags. The page does not read that file. The cards on the page, including the ones under each evolution and each variant, are placeholder copy in [`js/evolutions.js`](js/evolutions.js) and [`js/variants.js`](js/variants.js).

The exception is a form flagged in [`js/cherish.js`](js/cherish.js). If that exact form has only ever been released in a Cherish Ball, the page shows one Cherish Ball card everywhere balls appear: the selected Pokémon, its evolution stage, and its variant card. The flag is per form, so Magearna still shows placeholder cards while Original Color Magearna does not. The seeded list needs verifying.

## Sources

- [Bootstrap 5.3.9](https://github.com/twbs/bootstrap) from jsDelivr
- [Pokémon HOME sprites](https://github.com/PokeAPI/sprites/tree/master/sprites/pokemon/other/home) in the PokeAPI sprites repo
- Pokémon names, National Dex numbers, and form names from [PokeAPI](https://pokeapi.co/) species data
- Ball icons are item sprites from the same sprites repo
