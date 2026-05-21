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
| Background gradient | `#5B1F9E` → `#4A148C` → `#2E0A52` (violetField, diagonal) |
| Card gloss | `#FFFFFF` 10% → 2% (vertikalus gradientas) |
| Operations card surface | `#3D0F77` |
| Strategy card surface | `#5B1F9E` |
| Highlight border (Operations) | `#FFB300` (1.6 px) |
| Neutral border (Strategy) | `rgba(255,255,255,0.18)` (1 px) |
| Card shadow | `dy=14`, `stdDeviation=22`, flood `#150528` @ 55% |
| Primary text | `#FFFFFF` |
| Secondary text | `rgba(255,255,255,0.70)` |
| Card tail text | `rgba(255,255,255,0.78)` |
| Headline | 64 px, weight 800, tracking −0.02em, 2 lines |
| Card title | 52 px, weight 800, tracking −0.02em |
| Card kicker | 12 px, weight 700, tracking 0.16em, UPPERCASE — gold on Operations, white-70% on Strategy |
| Card tail | 16 px, weight 500 |
| Footer rule | `rgba(255,179,0,0.45)`, 1 px |
| Bottom wordmark | 28 px, weight 700, tracking 0.18em, UPPERCASE |
| Footer price | 16 px, weight 500, tracking 0.04em, right-aligned |

## Hierarchija (skaitymo seka per 2 sekundes)

1. Antraštė kairėje — *Two CEO Playbooks. / One AI System.*
2. Du playbook'ai dešinėje — **Operations** (gold accent) ir **Strategy** (neutral).
3. Domenas apačioje kairėje — *PROMPTANATOMY.CEO*.
4. Kaina apačioje dešinėje — *$9.99 + $19.99*.

## Konceptas: kodėl thumbnail-first

- **„Stop the scroll" framing** — OG paveikslėlis darbą atlieka feed thumbnail'e (~300–550 px), ne desktop hero'e. Viskas, kas neperskaitoma below 14 px source size, pašalinta.
- **Two products, one system** — du paraleliai cards komunikuoja produkto kategoriją net be teksto.
- **Asimetriškas akcentas** — vienas highlighted card (Operations, gold) suteikia hierarchiją; abu equally-accented cards skaldo dėmesį.
- **Premium SaaS look** — Apple × Linear × Stripe estetika, ne Canva template.
- **2-sekundžių taisyklė** — viena dominuojanti idėja, ≤4 pagrindiniai teksto blokai (headline + card×2 + footer).

## Kada eksportuoti PNG iš naujo

- Pakeitus `og-cover.svg` (antraštę, spalvas, layout'ą).
- Pakeitus brand domeną (atnaujink ir HTML meta tag'us).
- Pakeitus pagrindinę žinutę / poziciją.

Po eksporto **commit'ink ir SVG, ir PNG** kartu, kad git history'je būtų aiškus 1:1 ryšys.
