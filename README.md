# Politická gramotnost

Krátké kvízy o tom, jak funguje česká politika. V prvním kvízu „Kolik to stálo stát?“ hráč řadí 10 politických kauz podle toho, kolik stály veřejné rozpočty.

Zadání je v `docs/GDD-politicka-gramotnost.md`. Podklady ke kauzám jsou v `docs/kauzy-zdroje.md`; editovatelná data kvízu jsou v `quizzes/kolik-to-stalo/`.

## Spuštění

```bash
npm install
npm run dev      # vývojový server
npm test         # testy (Vitest)
npm run build    # statický web do dist/
npm run preview  # náhled sestaveného webu
```

Web je čistě statický a používá hash routing (`#/`, `#/kviz/kolik-to-stalo`). Poběží proto na libovolném hostingu i v podsložce. Fonty jsou hostované lokálně a web nic nestahuje z cizích domén.

## GitHub Pages

Deploy běží přes GitHub Actions (`.github/workflows/pages.yml`) při pushi na `main`.

V nastavení repozitáře zapni **Settings → Pages → Build and deployment → Source: GitHub Actions**. Po prvním úspěšném běhu workflow bude web na `https://<user>.github.io/kviz_politicke_gramotnosti/`.

## Úprava dat kvízu

Data kvízu „Kolik to stálo stát?“ jsou v `quizzes/kolik-to-stalo/data.json` — pole objektů kauz:

- `id`, `name`, `actors`, `shortDesc`, `longDesc`, `cost`, `index`, `sources`

Správné pořadí určuje pole `index` (1 = nejdražší). `cost` se jen zobrazuje po vyřešení.

Meta kvízu (název, osa, `revealAmounts`, …) je v `quizzes/kolik-to-stalo/meta.json`. Vstupní bod složky je `index.ts`.

Po úpravě spusť `npm test`. Test `src/data/data.test.ts` kontroluje schéma, unikátní `index` 1..N a `https://` URL.

Další nastavení:
- texty rozhraní: `src/copy.ts`,
- adresa pro hlášení chyb: `REPORT_URL` v `src/copy.ts`,
- barvy, fonty a rozestupy: `src/styles/tokens.css`.

## Přidání kvízu

Další kvíz typu řazení přidáš bez změny kódu registru:

1. Vytvoř složku `quizzes/<id>/` podle vzoru `kolik-to-stalo` (`index.ts`, `meta.json`, `data.json`).
2. Domovská stránka ho najde přes `import.meta.glob` v `src/quizzes/discover.ts`.

Jiný typ kvízu (výběr z možností, přiřazování dvojic) dostane vlastní složku v `src/quizzes/` se schématem a komponentou. Komponentu pak podle `type` vybere `src/pages/QuizPage.tsx`.

## Struktura

```
docs/                      zadání a podklady
quizzes/<id>/              data a vstupní bod každého kvízu
  index.ts
  meta.json
  data.json
.github/workflows/         deploy na GitHub Pages
src/
  App.tsx, router.ts       hash routing
  copy.ts                  texty UI
  data/                    schéma (zod), validační test
  pages/                   domovská stránka, stránka kvízu
  quizzes/discover.ts      objevování složek quizzes/
  quizzes/ordering/        engine kvízu typu řazení
  styles/                  tokens.css, global.css
```
