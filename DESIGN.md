# DESIGN.md — De Videotheek

Visuele stijlgids voor "De Videotheek": een lokale desktop-webapp om een
verzameling Nederlandse tv-series te catalogiseren. Eén gebruiker, draait lokaal,
geen mobiel. Posters staan centraal.

**Techniek (vast):** Next.js + Tailwind CSS. Stijl via Tailwind design-tokens en
de bestaande set componentklassen (`.card, .btn, .btn-primary, .btn-danger,
.input, .label, .chip, .link`). De tokennamen blijven gelijk; alleen hun
waarden veranderen, zodat de bestaande componenten 1-op-1 mee-updaten.

---

## 1. Sfeer & richting

**Strak & modern**, licht thema, met een warme ondertoon. Een opgeruimde
media-app waar de posters het werk doen en de interface zelf rustig op de
achtergrond blijft.

Kernwoorden: **strak · modern · rustig · warm-licht · poster-gericht**

**Referentie:** IMDb-achtig (herkenbaar poster-raster, nuchtere interface),
maar bewust kalmer en minder druk — geen reclame, geen visuele ruis.

---

## 2. Kleurtokens

**Thema: LICHT** (warm-wit papier + helder blauw accent + warm-getinte
neutralen). De tokennamen zijn ongewijzigd t.o.v. de oude donkere stijl, maar
hun rol/waarde is omgekeerd naar een licht thema. Let op de twee aandachtspunten
hieronder (`cream` en `amber`).

| Token        | Rol nu                                  | Hex        | Opmerking |
|--------------|------------------------------------------|------------|-----------|
| `ink`        | Pagina-achtergrond (warm-wit)            | `#FAF9F6`  | Was donker; nu de lichte basis |
| `panel`      | Kaart / paneel-achtergrond               | `#FFFFFF`  | Zuiver wit op het warme papier |
| `panel2`     | Secundair paneel / hover-vlak / placeholder | `#F3F1EC` | Heel licht warm-grijs |
| `edge`       | Randen / scheidingslijnen                | `#E7E3DB`  | Zacht warm-grijs, subtiel |
| `cream`      | Hoofdtekst                               | `#1F2329`  | ⚠️ Rol = tekst; nu donker antraciet (omgekeerd t.o.v. oude thema) |
| `muted`      | Subtekst / metadata                      | `#6B7280`  | Warm-neutraal grijs |
| `amber`      | Accent (knoppen, links, actieve filters) | `#2563EB`  | ⚠️ Ondanks de naam bevat dit token nu het **blauwe** accent |
| `amberdark`  | Accent — hover/actief (donkerder)        | `#1D4ED8`  | Donkerder blauw voor hover/pressed |

**Nieuwe tokens (toevoegen):**

| Token         | Rol                          | Hex        |
|---------------|------------------------------|------------|
| `success`     | Bevestiging / "opgeslagen"   | `#16A34A`  |
| `danger`      | Verwijderen / fouten         | `#DC2626`  |
| `dangerdark`  | Danger — hover               | `#B91C1C`  |
| `accent-soft` | Lichte accent-tint (chip-achtergrond, focus-vlak) | `#E8EFFE` |

**Contrast (WCAG, tekst op `ink` #FAF9F6):**
- Hoofdtekst `cream` #1F2329 → **≈ 15:1** (AAA).
- Subtekst `muted` #6B7280 → **≈ 4.9:1** (AA voor normale tekst).
- Link/accent `amber` #2563EB → **≈ 5.1:1** (AA).
- Witte tekst op blauwe knop (`amber` #2563EB) → **≈ 5.4:1** (AA).

Vuistregel: alle interactieve tekst minimaal AA. Gebruik felle accentvlakken
(blauw) altijd met witte tekst; gebruik blauw als tekst alleen op licht.

---

## 3. Typografie

**Google Fonts:** koppen in **Space Grotesk**, bodytekst in **IBM Plex Sans**.
Clean grotesk met net een vleugje karakter in de koppen.

```
Koppen:  'Space Grotesk', sans-serif
Body:    'IBM Plex Sans', sans-serif
```

| Stijl            | Font          | Grootte | Gewicht | Regelhoogte | Letter-spacing |
|------------------|---------------|---------|---------|-------------|----------------|
| h1               | Space Grotesk | 30px    | 700     | 1.2         | -0.01em        |
| h2               | Space Grotesk | 22px    | 600     | 1.25        | -0.005em       |
| h3               | Space Grotesk | 17px    | 600     | 1.3         | 0              |
| Body             | IBM Plex Sans | 15px    | 400     | 1.55        | 0              |
| Subtekst/meta    | IBM Plex Sans | 13px    | 400     | 1.45        | 0              |
| Label (formulier)| IBM Plex Sans | 13px    | 500     | 1.4         | 0.01em         |

**Header-titel "De Videotheek":** strak woordmerk in **Space Grotesk 700**,
~18px, kleur `cream` (#1F2329), letter-spacing `-0.01em`. Eén kleur, geen
accent, geen icoon — nuchter en modern. Staat links in de bovenbalk.

---

## 4. Vorm, diepte & ruimte

**Border-radius (vrijwel scherp):**
- `sm`: 2px (chips, kleine tags)
- `base`: 4px (kaarten, knoppen, invoervelden) ← standaard
- `lg`: 6px (modals / grotere panelen, max)

**Diepte — "mix" (vlak in rust, reageert bij hover):**
- In rust: geen schaduw; afbakening via dunne `edge`-randen (1px).
- Bij hover (kaarten/posters): subtiele schaduw
  `box-shadow: 0 4px 14px rgba(31,35,41,0.10)`.
- Modals/popovers mogen wel een rustende schaduw hebben:
  `0 8px 28px rgba(31,35,41,0.12)`.

**Randen:** 1px `edge` (#E7E3DB). Op witte panels subtiel, maar zichtbaar.

**Dichtheid — COMPACT:**
- Basis spacing-eenheid: 4px. Veelgebruikt: 8 / 12 / 16 / 24px.
- Card-padding: 12–16px. Sectie-marges: 24px.
- Postergrid: kleine tussenruimte (gap 12–16px), veel kolommen.

---

## 5. Componentstijlen

Alle overgangen: `transition: 150ms ease`. Focus-ring overal zichtbaar:
`outline: 2px solid amber (#2563EB); outline-offset: 2px` (of een
`box-shadow: 0 0 0 3px accent-soft`).

### `.card`
- Achtergrond `panel` (#FFFFFF), rand 1px `edge`, radius 4px.
- Padding 12–16px, geen schaduw in rust.
- Hover (alleen klikbare kaarten): schaduw `0 4px 14px rgba(31,35,41,0.10)`,
  rand iets donkerder.

### `.btn` (secundair / neutraal)
- Achtergrond `panel` (#FFFFFF), tekst `cream`, rand 1px `edge`, radius 4px.
- Padding 8px 14px, gewicht 500.
- Hover: achtergrond `panel2` (#F3F1EC), rand iets donkerder.
- Active: licht ingedrukt (geen verplaatsing nodig).

### `.btn-primary`
- Achtergrond `amber` (#2563EB), **witte** tekst, geen rand, radius 4px.
- Gewicht 600.
- Hover: achtergrond `amberdark` (#1D4ED8).
- Focus: ring in `accent-soft`.

### `.btn-danger`
- Achtergrond `danger` (#DC2626), **witte** tekst, geen rand, radius 4px.
- Hover: `dangerdark` (#B91C1C).
- Gebruik spaarzaam (alleen onomkeerbare acties zoals verwijderen).

### `.input`
- Achtergrond `panel` (#FFFFFF), tekst `cream`, rand 1px `edge`, radius 4px.
- Padding 8px 10px, placeholder-tekst in `muted`.
- Focus: rand `amber` (#2563EB) + ring `accent-soft`.
- Disabled: achtergrond `panel2`, tekst `muted`.

### `.label`
- IBM Plex Sans 13px / gewicht 500, kleur `cream`, kleine marge onder (4px).
- Optioneel een `muted`-hint ernaast.

### `.chip`
- Kleine tag/filter. Achtergrond `panel2` (#F3F1EC), tekst `cream`,
  rand 1px `edge`, radius 2px (sm), padding 2px 8px, 13px.
- Actief/geselecteerd: achtergrond `accent-soft` (#E8EFFE), tekst `amberdark`,
  rand `amber`.
- Hover: achtergrond iets donkerder.

### `.link`
- Tekst in `amber` (#2563EB), geen onderstreping in rust.
- Hover: `amberdark` (#1D4ED8) + onderstreping.
- Focus: ring zichtbaar.

---

## 6. Posters & beelden

- **Aspectverhouding:** 2:3 (staand, dvd-hoes).
- **Kaart-stijl:** kaal & strak — alleen de poster met 1px `edge`-rand,
  radius 4px. Geen vaste titelbalk eronder.
- **Titel-overlay (alleen bij hover):** onderin de poster een donkere
  gradient-balk `linear-gradient(to top, rgba(15,18,22,0.85), transparent)`
  met de titel (+ jaartal) in wit, IBM Plex Sans. In rust onzichtbaar.
- **Hover-effect:** subtiele schaduw `0 4px 14px rgba(31,35,41,0.10)` +
  titel-overlay fade-in (150ms). Geen zoom (past bij "strak").
- **Placeholder (poster ontbreekt):** vlak in `panel2` (#F3F1EC) met een dun
  lijn-icoon (film/tv) in `muted`, gecentreerd, en daaronder de serietitel
  klein in `muted`. Zelfde 2:3-verhouding en 4px-radius als echte posters.
- **Laad-animatie:** posters vallen licht in (fade + 4px omhoog), licht
  gefaseerd per kaart. Respecteer `prefers-reduced-motion`.

---

## 7. Header / navigatie

- Vaste bovenbalk, achtergrond `ink` (#FAF9F6) of `panel` (#FFFFFF) met een
  1px `edge`-onderrand. Geen schaduw.
- **Links:** woordmerk "De Videotheek" (Space Grotesk 700, `cream`).
- **Midden/rechts:** zoekbalk (`.input`-stijl, met lijn-icoon zoeken links
  in het veld) en de filterbalk (`.chip`-filters).
- **Rechts:** primaire actie "Serie toevoegen" als `.btn-primary`.
- Hoogte compact (~56px), padding horizontaal 16–24px.

---

## 8. Microinteracties

- Standaard overgang: **150ms ease** voor hover-schaduw, kleurwissels en
  overlay-fades.
- Posters: lichte **invallende** animatie bij laden (fade + kleine verschuiving,
  gefaseerd).
- Knoppen/links: directe kleurwissel naar de `*dark`-variant bij hover.
- Modals/popovers: korte fade/scale-in (120–150ms).
- **Altijd** `@media (prefers-reduced-motion: reduce)` respecteren: dan geen
  bewegende dingen, alleen directe kleurstates.

---

## 9. Doe & laat-na

**Wél doen**
- Posters laten leiden; interface rustig en licht eromheen houden.
- Dunne `edge`-randen voor structuur; schaduw alleen als reactie (hover).
- Eén accentkleur (blauw) consistent voor alles wat klikbaar is.
- Compacte, nette spacing-schaal (veelvouden van 4px).
- Dunne lijn-iconen in één stijl; emoji alleen heel spaarzaam (bijv. ⭐ bij
  een waardering).

**Niet doen**
- Geen ronde, "zachte" hoeken (> 6px) of zware slagschaduwen in rust.
- Geen tweede accentkleur of kleurrijke gradients in de interface
  (gradient alleen in de poster-titeloverlay).
- Geen donkere achtergronden of koud/technisch grijs — hou de warme ondertoon.
- Geen drukte: geen overbodige iconen, badges of statistieken bij elke kaart.
- Geen poster-zoom of opvallende animaties; hou het strak en kalm.
