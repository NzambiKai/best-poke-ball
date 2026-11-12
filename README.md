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
- Search box with a static autocomplete of the sample families
- Selected Pokémon panel with Pokémon HOME art and the PokeAPI name
- Three hard-coded ball cards for the selected Pokémon
- Evolution line for that family, with up to three sample ball cards on every stage (a straight line, Eevee's branches, or a single stage such as Lapras)
- Fan-project disclaimer in the footer

## Matching

Not built yet. [`js/balls.js`](js/balls.js) is a stub for a later hand-editable list of balls with colours and theme tags. The page does not read that file. The cards on the page, including the ones under each evolution, are placeholder copy in [`js/evolutions.js`](js/evolutions.js).

## Sources

- [Bootstrap 5.3.9](https://github.com/twbs/bootstrap) from jsDelivr
- [Pokémon HOME sprites](https://github.com/PokeAPI/sprites/tree/master/sprites/pokemon/other/home) in the PokeAPI sprites repo
- Pokémon names and National Dex numbers from [PokeAPI](https://pokeapi.co/) species data
- Ball icons are item sprites from the same sprites repo
