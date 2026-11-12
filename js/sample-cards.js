"use strict";

/**
 * Hand-edited placeholder ball cards, keyed by form slug.
 *
 * These are sample copy for the layout. They are not a match result.
 * A slug with no entry shows an empty card list. Cherish-only forms
 * ignore this file and use the Cherish card from js/form-rules.js.
 */
const SAMPLE_CARDS = {
  bulbasaur: [
    { ball: "friend-ball", name: "Friend Ball", reason: "Matches Bulbasaur's green, grassy vibe" },
    { ball: "nest-ball", name: "Nest Ball", reason: "Matches Bulbasaur's small, garden vibe" },
    { ball: "safari-ball", name: "Safari Ball", reason: "Matches Bulbasaur's wild, leafy vibe" },
  ],
  ivysaur: [
    { ball: "friend-ball", name: "Friend Ball", reason: "Matches Ivysaur's green, budding vibe" },
    { ball: "nest-ball", name: "Nest Ball", reason: "Matches Ivysaur's leafy, growing vibe" },
    { ball: "safari-ball", name: "Safari Ball", reason: "Matches Ivysaur's deeper forest vibe" },
  ],
  venusaur: [
    { ball: "friend-ball", name: "Friend Ball", reason: "Matches Venusaur's deep green, floral vibe" },
    { ball: "safari-ball", name: "Safari Ball", reason: "Matches Venusaur's wild, jungle vibe" },
    { ball: "nest-ball", name: "Nest Ball", reason: "Matches Venusaur's broad, leafy vibe" },
  ],
  charmander: [
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Charmander's orange, fiery vibe" },
    { ball: "repeat-ball", name: "Repeat Ball", reason: "Matches Charmander's red, warm vibe" },
    { ball: "level-ball", name: "Level Ball", reason: "Matches Charmander's red and yellow flame" },
  ],
  charmeleon: [
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Charmeleon's red, fiery vibe" },
    { ball: "repeat-ball", name: "Repeat Ball", reason: "Matches Charmeleon's hot, fierce vibe" },
    { ball: "level-ball", name: "Level Ball", reason: "Matches Charmeleon's red and yellow look" },
  ],
  charizard: [
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Charizard's orange, fiery vibe" },
    { ball: "repeat-ball", name: "Repeat Ball", reason: "Matches Charizard's red, blazing vibe" },
    { ball: "level-ball", name: "Level Ball", reason: "Matches Charizard's red and yellow look" },
  ],
  pikachu: [
    { ball: "quick-ball", name: "Quick Ball", reason: "Matches Pikachu's yellow, electric vibe" },
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Pikachu's yellow, energetic vibe" },
    { ball: "love-ball", name: "Love Ball", reason: "Matches Pikachu's bright, cute vibe" },
  ],
  raichu: [
    { ball: "quick-ball", name: "Quick Ball", reason: "Matches Raichu's orange, electric vibe" },
    { ball: "ultra-ball", name: "Ultra Ball", reason: "Matches Raichu's bold yellow and brown look" },
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Raichu's energetic vibe" },
  ],
  vulpix: [
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Vulpix's orange, fiery vibe" },
    { ball: "repeat-ball", name: "Repeat Ball", reason: "Matches Vulpix's warm, fox-fire look" },
    { ball: "level-ball", name: "Level Ball", reason: "Matches Vulpix's red and cream tails" },
  ],
  ninetales: [
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Ninetales's golden, fiery vibe" },
    { ball: "luxury-ball", name: "Luxury Ball", reason: "Matches Ninetales's elegant, flowing look" },
    { ball: "repeat-ball", name: "Repeat Ball", reason: "Matches Ninetales's warm, fox-fire look" },
  ],
  gastly: [
    { ball: "dusk-ball", name: "Dusk Ball", reason: "Matches Gastly's purple, ghostly vibe" },
    { ball: "dream-ball", name: "Dream Ball", reason: "Matches Gastly's hazy, spooky vibe" },
    { ball: "moon-ball", name: "Moon Ball", reason: "Matches Gastly's night-time vibe" },
  ],
  haunter: [
    { ball: "dusk-ball", name: "Dusk Ball", reason: "Matches Haunter's purple, ghostly vibe" },
    { ball: "dream-ball", name: "Dream Ball", reason: "Matches Haunter's mischievous, dreamy vibe" },
    { ball: "moon-ball", name: "Moon Ball", reason: "Matches Haunter's night-time vibe" },
  ],
  gengar: [
    { ball: "dusk-ball", name: "Dusk Ball", reason: "Matches Gengar's purple, ghostly vibe" },
    { ball: "moon-ball", name: "Moon Ball", reason: "Matches Gengar's lunar, night-time vibe" },
    { ball: "dream-ball", name: "Dream Ball", reason: "Matches Gengar's purple, dreamy vibe" },
  ],
  lapras: [
    { ball: "dive-ball", name: "Dive Ball", reason: "Matches Lapras's blue, aquatic vibe" },
    { ball: "lure-ball", name: "Lure Ball", reason: "Matches Lapras's blue, ocean vibe" },
    { ball: "net-ball", name: "Net Ball", reason: "Matches Lapras's blue, watery vibe" },
  ],
  eevee: [
    { ball: "love-ball", name: "Love Ball", reason: "Matches Eevee's brown, cute vibe" },
    { ball: "luxury-ball", name: "Luxury Ball", reason: "Matches Eevee's warm, soft coat" },
    { ball: "nest-ball", name: "Nest Ball", reason: "Matches Eevee's small, fluffy vibe" },
  ],
  vaporeon: [
    { ball: "dive-ball", name: "Dive Ball", reason: "Matches Vaporeon's blue, aquatic vibe" },
    { ball: "lure-ball", name: "Lure Ball", reason: "Matches Vaporeon's ocean look" },
    { ball: "net-ball", name: "Net Ball", reason: "Matches Vaporeon's watery fins" },
  ],
  jolteon: [
    { ball: "quick-ball", name: "Quick Ball", reason: "Matches Jolteon's yellow, electric vibe" },
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Jolteon's spiky, energetic look" },
    { ball: "ultra-ball", name: "Ultra Ball", reason: "Matches Jolteon's sharp yellow and white" },
  ],
  flareon: [
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Flareon's orange, fiery vibe" },
    { ball: "repeat-ball", name: "Repeat Ball", reason: "Matches Flareon's warm, fluffy flame" },
    { ball: "level-ball", name: "Level Ball", reason: "Matches Flareon's red and cream coat" },
  ],
  pichu: [
    { ball: "quick-ball", name: "Quick Ball", reason: "Matches Pichu's yellow, sparking vibe" },
    { ball: "love-ball", name: "Love Ball", reason: "Matches Pichu's tiny, cute vibe" },
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Pichu's yellow, energetic vibe" },
  ],
  espeon: [
    { ball: "dream-ball", name: "Dream Ball", reason: "Matches Espeon's lilac, psychic vibe" },
    { ball: "luxury-ball", name: "Luxury Ball", reason: "Matches Espeon's sleek, elegant look" },
    { ball: "moon-ball", name: "Moon Ball", reason: "Matches Espeon's red gem and night-soft vibe" },
  ],
  umbreon: [
    { ball: "moon-ball", name: "Moon Ball", reason: "Matches Umbreon's black, lunar vibe" },
    { ball: "luxury-ball", name: "Luxury Ball", reason: "Matches Umbreon's sleek, night-time look" },
    { ball: "dusk-ball", name: "Dusk Ball", reason: "Matches Umbreon's dark, dusk vibe" },
  ],
  leafeon: [
    { ball: "friend-ball", name: "Friend Ball", reason: "Matches Leafeon's green, leafy vibe" },
    { ball: "nest-ball", name: "Nest Ball", reason: "Matches Leafeon's mossy, forest look" },
    { ball: "safari-ball", name: "Safari Ball", reason: "Matches Leafeon's wild, grassy vibe" },
  ],
  glaceon: [
    { ball: "dive-ball", name: "Dive Ball", reason: "Matches Glaceon's icy blue vibe" },
    { ball: "premier-ball", name: "Premier Ball", reason: "Matches Glaceon's pale, frosted look" },
    { ball: "luxury-ball", name: "Luxury Ball", reason: "Matches Glaceon's sleek, cool coat" },
  ],
  sylveon: [
    { ball: "love-ball", name: "Love Ball", reason: "Matches Sylveon's pink, cute vibe" },
    { ball: "heal-ball", name: "Heal Ball", reason: "Matches Sylveon's soft, ribboned look" },
    { ball: "dream-ball", name: "Dream Ball", reason: "Matches Sylveon's pink, fairy vibe" },
  ],
  magearna: [
    { ball: "love-ball", name: "Love Ball", reason: "Matches Magearna's pink, crafted vibe" },
    { ball: "luxury-ball", name: "Luxury Ball", reason: "Matches Magearna's elegant, gilded look" },
    { ball: "dream-ball", name: "Dream Ball", reason: "Matches Magearna's soft, fairy colors" },
  ],
  zarude: [
    { ball: "dusk-ball", name: "Dusk Ball", reason: "Matches Zarude's dark, jungle vibe" },
    { ball: "friend-ball", name: "Friend Ball", reason: "Matches Zarude's green, leafy look" },
    { ball: "safari-ball", name: "Safari Ball", reason: "Matches Zarude's wild, forest vibe" },
  ],
  "venusaur-mega": [
    { ball: "friend-ball", name: "Friend Ball", reason: "Matches Mega Venusaur's deep green, floral vibe" },
    { ball: "safari-ball", name: "Safari Ball", reason: "Matches Mega Venusaur's huge jungle look" },
    { ball: "nest-ball", name: "Nest Ball", reason: "Matches Mega Venusaur's broad, leafy vibe" },
  ],
  "charizard-mega-x": [
    { ball: "dusk-ball", name: "Dusk Ball", reason: "Matches Mega Charizard X's blue-black look" },
    { ball: "luxury-ball", name: "Luxury Ball", reason: "Matches Mega Charizard X's dark, sleek vibe" },
    { ball: "ultra-ball", name: "Ultra Ball", reason: "Matches Mega Charizard X's bold black and yellow" },
  ],
  "charizard-mega-y": [
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Mega Charizard Y's orange, fiery vibe" },
    { ball: "repeat-ball", name: "Repeat Ball", reason: "Matches Mega Charizard Y's red, blazing look" },
    { ball: "level-ball", name: "Level Ball", reason: "Matches Mega Charizard Y's red and yellow wings" },
  ],
  "gengar-mega": [
    { ball: "dusk-ball", name: "Dusk Ball", reason: "Matches Mega Gengar's purple, ghostly vibe" },
    { ball: "moon-ball", name: "Moon Ball", reason: "Matches Mega Gengar's lunar, night-time vibe" },
    { ball: "dream-ball", name: "Dream Ball", reason: "Matches Mega Gengar's purple, dreamy look" },
  ],
  "pikachu-original-cap": [
    { ball: "quick-ball", name: "Quick Ball", reason: "Matches Original Cap Pikachu's yellow, electric vibe" },
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Original Cap Pikachu's bright, energetic look" },
    { ball: "love-ball", name: "Love Ball", reason: "Matches Original Cap Pikachu's cute, costumed vibe" },
  ],
  "pikachu-hoenn-cap": [
    { ball: "quick-ball", name: "Quick Ball", reason: "Matches Hoenn Cap Pikachu's yellow, electric vibe" },
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Hoenn Cap Pikachu's bright, energetic look" },
    { ball: "love-ball", name: "Love Ball", reason: "Matches Hoenn Cap Pikachu's cute, costumed vibe" },
  ],
  "pikachu-sinnoh-cap": [
    { ball: "quick-ball", name: "Quick Ball", reason: "Matches Sinnoh Cap Pikachu's yellow, electric vibe" },
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Sinnoh Cap Pikachu's bright, energetic look" },
    { ball: "love-ball", name: "Love Ball", reason: "Matches Sinnoh Cap Pikachu's cute, costumed vibe" },
  ],
  "pikachu-unova-cap": [
    { ball: "quick-ball", name: "Quick Ball", reason: "Matches Unova Cap Pikachu's yellow, electric vibe" },
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Unova Cap Pikachu's bright, energetic look" },
    { ball: "love-ball", name: "Love Ball", reason: "Matches Unova Cap Pikachu's cute, costumed vibe" },
  ],
  "pikachu-kalos-cap": [
    { ball: "quick-ball", name: "Quick Ball", reason: "Matches Kalos Cap Pikachu's yellow, electric vibe" },
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Kalos Cap Pikachu's bright, energetic look" },
    { ball: "love-ball", name: "Love Ball", reason: "Matches Kalos Cap Pikachu's cute, costumed vibe" },
  ],
  "pikachu-alola-cap": [
    { ball: "quick-ball", name: "Quick Ball", reason: "Matches Alola Cap Pikachu's yellow, electric vibe" },
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Alola Cap Pikachu's bright, energetic look" },
    { ball: "love-ball", name: "Love Ball", reason: "Matches Alola Cap Pikachu's cute, costumed vibe" },
  ],
  "raichu-alola": [
    { ball: "dream-ball", name: "Dream Ball", reason: "Matches Alolan Raichu's psychic, dreamy vibe" },
    { ball: "quick-ball", name: "Quick Ball", reason: "Matches Alolan Raichu's yellow, electric look" },
    { ball: "luxury-ball", name: "Luxury Ball", reason: "Matches Alolan Raichu's sleek, floating vibe" },
  ],
  "vulpix-alola": [
    { ball: "dive-ball", name: "Dive Ball", reason: "Matches Alolan Vulpix's icy blue vibe" },
    { ball: "premier-ball", name: "Premier Ball", reason: "Matches Alolan Vulpix's pale, frosted look" },
    { ball: "luxury-ball", name: "Luxury Ball", reason: "Matches Alolan Vulpix's sleek white coat" },
  ],
  "ninetales-alola": [
    { ball: "dive-ball", name: "Dive Ball", reason: "Matches Alolan Ninetales's icy blue mane" },
    { ball: "moon-ball", name: "Moon Ball", reason: "Matches Alolan Ninetales's mystical vibe" },
    { ball: "dream-ball", name: "Dream Ball", reason: "Matches Alolan Ninetales's pale, fairy frost" },
  ],
  "magearna-original": [
    { ball: "love-ball", name: "Love Ball", reason: "Matches Original Color Magearna's red and gold look" },
    { ball: "luxury-ball", name: "Luxury Ball", reason: "Matches Original Color Magearna's gilded vibe" },
    { ball: "repeat-ball", name: "Repeat Ball", reason: "Matches Original Color Magearna's deep red coat" },
  ],
  "pikachu-partner-cap": [
    { ball: "quick-ball", name: "Quick Ball", reason: "Matches Partner Cap Pikachu's yellow, electric vibe" },
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Partner Cap Pikachu's bright, energetic look" },
    { ball: "love-ball", name: "Love Ball", reason: "Matches Partner Cap Pikachu's cute, costumed vibe" },
  ],
  "pikachu-world-cap": [
    { ball: "quick-ball", name: "Quick Ball", reason: "Matches World Cap Pikachu's yellow, electric vibe" },
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches World Cap Pikachu's bright, energetic look" },
    { ball: "love-ball", name: "Love Ball", reason: "Matches World Cap Pikachu's cute, costumed vibe" },
  ],
  "zarude-dada": [
    { ball: "dusk-ball", name: "Dusk Ball", reason: "Matches Dada Zarude's dark, jungle vibe" },
    { ball: "friend-ball", name: "Friend Ball", reason: "Matches Dada Zarude's green, leafy look" },
    { ball: "love-ball", name: "Love Ball", reason: "Matches Dada Zarude's pink cloth" },
  ],
  "venusaur-gmax": [
    { ball: "friend-ball", name: "Friend Ball", reason: "Matches Gigantamax Venusaur's giant flower" },
    { ball: "safari-ball", name: "Safari Ball", reason: "Matches Gigantamax Venusaur's wild, jungle vibe" },
    { ball: "nest-ball", name: "Nest Ball", reason: "Matches Gigantamax Venusaur's broad, leafy look" },
  ],
  "charizard-gmax": [
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Gigantamax Charizard's huge orange flame" },
    { ball: "repeat-ball", name: "Repeat Ball", reason: "Matches Gigantamax Charizard's red blaze" },
    { ball: "level-ball", name: "Level Ball", reason: "Matches Gigantamax Charizard's red and yellow look" },
  ],
  "pikachu-gmax": [
    { ball: "quick-ball", name: "Quick Ball", reason: "Matches Gigantamax Pikachu's huge yellow look" },
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Gigantamax Pikachu's energetic vibe" },
    { ball: "love-ball", name: "Love Ball", reason: "Matches Gigantamax Pikachu's bright, cute vibe" },
  ],
  "gengar-gmax": [
    { ball: "dusk-ball", name: "Dusk Ball", reason: "Matches Gigantamax Gengar's huge purple grin" },
    { ball: "moon-ball", name: "Moon Ball", reason: "Matches Gigantamax Gengar's night-time vibe" },
    { ball: "dream-ball", name: "Dream Ball", reason: "Matches Gigantamax Gengar's dreamy, ghostly look" },
  ],
  "lapras-gmax": [
    { ball: "dive-ball", name: "Dive Ball", reason: "Matches Gigantamax Lapras's blue, aquatic vibe" },
    { ball: "lure-ball", name: "Lure Ball", reason: "Matches Gigantamax Lapras's ocean look" },
    { ball: "net-ball", name: "Net Ball", reason: "Matches Gigantamax Lapras's watery shell" },
  ],
  "eevee-gmax": [
    { ball: "love-ball", name: "Love Ball", reason: "Matches Gigantamax Eevee's huge, fluffy vibe" },
    { ball: "luxury-ball", name: "Luxury Ball", reason: "Matches Gigantamax Eevee's warm coat" },
    { ball: "nest-ball", name: "Nest Ball", reason: "Matches Gigantamax Eevee's soft, bushy look" },
  ],
  "raichu-mega-x": [
    { ball: "quick-ball", name: "Quick Ball", reason: "Matches Mega Raichu X's electric vibe" },
    { ball: "ultra-ball", name: "Ultra Ball", reason: "Matches Mega Raichu X's bold yellow and black" },
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Mega Raichu X's energetic look" },
  ],
  "raichu-mega-y": [
    { ball: "quick-ball", name: "Quick Ball", reason: "Matches Mega Raichu Y's electric vibe" },
    { ball: "love-ball", name: "Love Ball", reason: "Matches Mega Raichu Y's bright look" },
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Mega Raichu Y's energetic look" },
  ],
  "pikachu-female": [
    { ball: "quick-ball", name: "Quick Ball", reason: "Matches Female Pikachu's yellow, electric vibe" },
    { ball: "love-ball", name: "Love Ball", reason: "Matches Female Pikachu's heart-tipped tail" },
    { ball: "heal-ball", name: "Heal Ball", reason: "Matches Female Pikachu's pink, cute look" },
  ],
  "raichu-female": [
    { ball: "quick-ball", name: "Quick Ball", reason: "Matches Female Raichu's orange, electric vibe" },
    { ball: "ultra-ball", name: "Ultra Ball", reason: "Matches Female Raichu's bold yellow look" },
    { ball: "fast-ball", name: "Fast Ball", reason: "Matches Female Raichu's energetic vibe" },
  ],
  "venusaur-female": [
    { ball: "friend-ball", name: "Friend Ball", reason: "Matches Female Venusaur's deep green, floral vibe" },
    { ball: "safari-ball", name: "Safari Ball", reason: "Matches Female Venusaur's wild, jungle vibe" },
    { ball: "nest-ball", name: "Nest Ball", reason: "Matches Female Venusaur's broad, leafy vibe" },
  ],
  "eevee-female": [
    { ball: "love-ball", name: "Love Ball", reason: "Matches Female Eevee's brown, cute vibe" },
    { ball: "luxury-ball", name: "Luxury Ball", reason: "Matches Female Eevee's warm, soft coat" },
    { ball: "nest-ball", name: "Nest Ball", reason: "Matches Female Eevee's small, fluffy look" },
  ],
};
