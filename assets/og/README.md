# Open Graph kortelės (assets/og)

Premium dark social preview kortelė, naudojama LinkedIn, X, Telegram, Slack, Facebook ir GitHub link share preview'ams.

## Failai

- `og-cover.svg` — šaltinis (1200×630, „3-Layer Stack" koncepcija). **Niekada netiesiogiai neteik per `og:image` meta** — daug crawler'ių nepalaiko SVG.
- `og-cover.png` — **production artefaktas**, į kurį rodo `og:image` meta tag'ai. Eksportuojamas iš SVG prieš deploy (žr. žemiau).

## PNG eksportas (vienas komandos paleidimas)

```bash
npx -y svgexport assets/og/og-cover.svg assets/og/og-cover.png 1200:630
```

Alternatyvos:

```bash
# Per Inkscape (jei įdiegtas)
inkscape assets/og/og-cover.svg --export-type=png --export-filename=assets/og/og-cover.png --export-width=1200 --export-height=630

# Per ImageMagick (kokybė prastesnė SVG → PNG)
magick -density 144 assets/og/og-cover.svg -resize 1200x630 assets/og/og-cover.png

# Per Figma — atidaryk SVG, eksportuok kaip PNG @2x → suspausk iki 1200×630
```

Tikslinis dydis ir kokybė:

- 1200×630 px (1.91:1) — universalus OG (LinkedIn, X, Facebook, Telegram, Slack, Discord).
- PNG24 (be prozrachumo nereikia, bet PNG yra rekomenduojamas tekstui).
- Failo dydis: < 300 KB optimalu, < 1 MB privaloma (GitHub limit'as).

## Validavimas po deploy

Po pirmo prod deploy (kad URL grąžintų 200), patikrink rich preview:

- LinkedIn Post Inspector — https://www.linkedin.com/post-inspector/
- Facebook Sharing Debugger — https://developers.facebook.com/tools/debug/
- X (Twitter) Card Validator — https://cards-dev.twitter.com/validator (arba paprastas bandomasis tweet'as)
- Universalus OG preview — https://www.opengraph.xyz/
- Telegram — atsiųsk URL į savo asmeninį chat'ą, peržiūrėk preview.

Jei platforma rodo seną/be paveikslėlio preview, paspausk „Scrape Again" / „Refresh" debugger'yje.

## Dizaino tokens (jei reikia keisti SVG)

| Rolė | Vertė |
|---|---|
| Background | `#0B0B12` |
| Violet glow | `#4A148C` @ 30% → 0% radial |
| Card surface | `#1A1A26` → `#15151F` (vertikalus gradientas) |
| Card border | `#262633` (1.5 px) |
| Highlight border (Process) | `#FFB300` (2 px) + gold dot 5 px |
| Primary text | `#F5F5F7` |
| Secondary / chip text | `#C8C8D2` |
| Headline | 96 px, weight 800, tracking −0.03em, 2 lines |
| Card label | 28 px, weight 700 |
| Lineage chip | 14 px, weight 700, tracking 0.16em, UPPERCASE |
| Bottom wordmark | 22 px, weight 600, tracking 0.20em, UPPERCASE |

## Hierarchija (skaitymo seka per 2 sekundes)

1. Antraštė kairėje — *Run AI like ops.*
2. 3-sluoksnių stack'as dešinėje — Strategy / **Process** (auksinis akcentas) / Execution.
3. Lineage chip kairiame viršuje — *Prompt Anatomy · Operations module*.
4. Domenas apačioje centre — *promptanatomy.ceo*.

## Konceptas: kodėl 3-Layer Stack

- **„System" framing** — vadovai supranta operacijas kaip sluoksnius (strategija → procesas → vykdymas).
- **Save/share potential** — framework'inė kortelė yra bookmark'inama.
- **Premium SaaS look** — Apple × Linear × Stripe estetika, ne Canva template.
- **2-sekundžių taisyklė** — viena dominuojanti idėja, viena metafora, ≤4 pagrindiniai teksto blokai.

## Kada eksportuoti PNG iš naujo

- Pakeitus `og-cover.svg` (antraštę, spalvas, layout'ą).
- Pakeitus brand domeną (atnaujink ir HTML meta tag'us).
- Pakeitus pagrindinę žinutę / poziciją.

Po eksporto **commit'ink ir SVG, ir PNG** kartu, kad git history'je būtų aiškus 1:1 ryšys.
