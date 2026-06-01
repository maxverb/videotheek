# 📼 De Videotheek

Een lokale desktop-webapp om je verzameling Nederlandse tv-series te
catalogiseren — DVD-boxen én downloads. De app draait **volledig op je eigen
computer** (Windows of macOS), zonder cloud, zonder account, zonder internet.
Eén persoon, één database, één bestand.

> Deze handleiding gaat ervan uit dat je alles bent vergeten en gewoon weer
> wilt kunnen starten. Volg de stappen voor jouw systeem van boven naar beneden.

---

## ⚠️ Allerbelangrijkst: je back-up

Je hele verzameling — alle series, personen, credits en mediakoppelingen —
staat in **één bestand**:

```
data/videotheek.db
```

**Wil je niets kwijtraken? Kopieer dan af en toe dat ene bestand**
(`data/videotheek.db`) naar een USB-stick, externe schijf of een andere veilige
plek. De app zelf kun je altijd opnieuw downloaden of opnieuw bouwen; je
gegevens niet. Dit bestand staat bewust **niet** in Git.

(De extra bestanden `videotheek.db-wal` en `videotheek.db-shm` mogen mee als ze
bestaan, maar `videotheek.db` is degene die telt. Sluit de app voordat je
kopieert, dan weet je zeker dat alles weggeschreven is.)

---

## Wat heb je nodig?

**Node.js** (de gratis JavaScript-omgeving). Gebruik de **LTS-versie**
(aanbevolen: **Node.js 20 LTS of nieuwer**). Download hier:

> https://nodejs.org/  → klik op de grote knop met **"LTS"**.

Installeren is "volgende, volgende, voltooien". Daarna heb je een terminal nodig
(zie hieronder per systeem). Je hoeft verder niets te installeren — geen
database-server, niets. De database is gewoon dat ene bestand.

---

## 🪟 Windows (PowerShell)

1. **Open een terminal in deze map.**
   Open de map `videotheek` in de Verkenner, klik in de adresbalk, typ
   `powershell` en druk op Enter. Of: Shift + rechtermuisklik in de map →
   *"PowerShell-venster hier openen"*.

2. **Controleer of Node.js werkt:**
   ```powershell
   node --version
   ```
   Zie je een versienummer (bv. `v20.x.x`)? Top. Zo niet: installeer Node.js
   eerst (zie hierboven) en open daarna een nieuw venster.

3. **Installeer de onderdelen van de app** (eenmalig, of na een update):
   ```powershell
   npm install
   ```

4. **Maak de database aan** (eenmalig):
   ```powershell
   npm run db:init
   ```

5. **(Optioneel) Vul twee voorbeeldseries in** zodat je meteen iets ziet:
   ```powershell
   npm run db:seed
   ```

6. **Start de app:**
   ```powershell
   npm run dev
   ```

7. **Open de app in je browser:** ga naar
   > http://localhost:3000

   Stoppen doe je in PowerShell met **Ctrl + C**.

---

## 🍎 Mac (Terminal)

1. **Open een terminal in deze map.**
   Open de map `videotheek` in Finder. Rechtermuisklik (of Ctrl-klik) op de map
   → *"Diensten"* → *"Nieuwe Terminal bij map"*. (Of open Terminal en typ `cd `
   met een spatie, sleep de map erin, en druk Enter.)

2. **Controleer of Node.js werkt:**
   ```bash
   node --version
   ```
   Zie je een versienummer (bv. `v20.x.x`)? Top. Zo niet: installeer Node.js
   eerst (zie hierboven) en open daarna een nieuw venster.

3. **Installeer de onderdelen van de app** (eenmalig, of na een update):
   ```bash
   npm install
   ```

4. **Maak de database aan** (eenmalig):
   ```bash
   npm run db:init
   ```

5. **(Optioneel) Vul twee voorbeeldseries in** zodat je meteen iets ziet:
   ```bash
   npm run db:seed
   ```

6. **Start de app:**
   ```bash
   npm run dev
   ```

7. **Open de app in je browser:** ga naar
   > http://localhost:3000

   Stoppen doe je in Terminal met **Ctrl + C**.

---

## Dagelijks gebruik (kort)

Heb je `npm install` en `npm run db:init` al eens gedaan? Dan is starten
voortaan simpel:

```
npm run dev
```

…en daarna in de browser naar **http://localhost:3000**.

---

## Wat kun je in de app?

- **Overzicht** van al je series met posters, een zoekbalk en filters op genre,
  zender en status (lopend/afgelopen).
- **Series, seizoenen en afleveringen** toevoegen, bewerken en verwijderen.
- **Personen** beheren en per persoon zien in welke series, seizoenen en
  afleveringen ze als **cast** of **crew** voorkwamen.
- **Cast & crew** koppelen op precies het juiste niveau: een vaste hoofdrol op
  serieniveau, of juist een eenmalige gastrol in één aflevering. Bij het
  toevoegen kies je een bestaande persoon óf maak je er meteen een nieuwe aan.
- **Media koppelen** (ISO, mp4, upscale, snippet, extra) met het absolute pad op
  je schijf. Per bestand:
  - **▶ Open in speler** — opent het bestand in je standaardspeler (VLC, enz.)
    via het besturingssysteem.
  - **⧉ Kopieer pad** — zet het bestandspad op je klembord.
  - **🎞 In app** — speelt mp4's direct in de app af (met spoelen).
- **ffprobe** (optioneel): staat *FFmpeg* op je systeem, dan kun je met één knop
  resolutie/duur/codec automatisch laten invullen — handig om een upscale van
  het origineel te onderscheiden. Heb je geen ffprobe? Dan geeft de knop netjes
  een melding en gebeurt er verder niets.

---

## Beschikbare commando's (npm-scripts)

| Commando            | Wat het doet                                                |
|---------------------|-------------------------------------------------------------|
| `npm run dev`       | Start de app voor dagelijks gebruik (op localhost:3000).    |
| `npm run build`     | Maakt een geoptimaliseerde productie-build.                 |
| `npm start`         | Start de productie-build (eerst `npm run build` draaien).   |
| `npm run db:init`   | Maakt de database `data/videotheek.db` aan (idempotent).    |
| `npm run db:seed`   | Vult twee voorbeeldseries in (alleen als de db leeg is).    |

> `npm run db:seed -- --force` wist eerst alle data en zet de voorbeelden er
> opnieuw in. **Pas op:** dit verwijdert je eigen ingevoerde gegevens.

---

## Waar staat wat? (voor de nieuwsgierige)

```
data/videotheek.db     ← JOUW VERZAMELING (back-uppen!)
db/schema.sql          ← de databasestructuur
lib/db.ts              ← databaseverbinding (better-sqlite3)
lib/queries.ts         ← lees-queries
lib/actions.ts         ← toevoegen/bewerken/verwijderen (server actions)
lib/validation.ts      ← formuliervalidatie (Zod)
app/                   ← de pagina's (Next.js App Router)
components/            ← herbruikbare UI-onderdelen
scripts/               ← db:init en db:seed
```

Technisch: Next.js (App Router) + TypeScript, SQLite via better-sqlite3,
Tailwind CSS, Zod. Geen externe database-server.

---

## Iets kapot? Een paar veelvoorkomende dingen

- **"node wordt niet herkend" / "command not found: node"** → Node.js is niet
  (goed) geïnstalleerd, of je moet de terminal opnieuw openen na de installatie.
- **De pagina laadt niet op localhost:3000** → draait `npm run dev` nog in de
  terminal? Staat er een foutmelding? Een andere app kan poort 3000 bezet
  houden; sluit die of herstart je computer.
- **"Open in speler" doet niets** → het pad klopt niet meer (bestand verplaatst
  of schijf niet aangesloten), of er is geen standaardspeler ingesteld voor dat
  bestandstype.
- **Poster/afbeelding blijft leeg** → controleer het opgegeven pad; het moet een
  bestaand, lokaal afbeeldingsbestand zijn (jpg/png/webp/…).

Veel kijkplezier. 📺
