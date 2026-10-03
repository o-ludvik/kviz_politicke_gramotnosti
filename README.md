# Politická gramotnost

Krátké kvízy o tom, jak funguje česká politika. V prvním kvízu „Kolik to stálo stát?“ hráč řadí 10 politických kauz podle toho, kolik stály veřejné rozpočty.

Zadání je v `docs/GDD-politicka-gramotnost.md`. Jediný zdroj faktů je `docs/kauzy-zdroje.md`.

## Spuštění

```bash
npm install
npm run dev      # vývojový server
npm test         # testy (Vitest)
npm run build    # statický web do dist/
npm run preview  # náhled sestaveného webu
```

Web je čistě statický a používá hash routing (`#/`, `#/kviz/kolik-to-stalo`). Poběží proto na libovolném hostingu i v podsložce (GitHub Pages, Netlify, Vercel). Fonty jsou hostované lokálně a web nic nestahuje z cizích domén.

## Úprava dat

1. Uprav `docs/kauzy-zdroje.md` a dodrž stávající formát karet a zdrojů.
2. Spusť `npm run data`. Skript `scripts/convert-kauzy.mjs` přegeneruje `src/data/quizzes/kolik-to-stalo.json` a vypíše řádky `TODO` z podkladů.
3. Spusť `npm test`. Test `src/data/data.test.ts` kontroluje pravidla z GDD kap. 7.4:
   - počet položek,
   - soutěžní číslování `rank`,
   - odkazy `[n]` a zdroje,
   - že u částek nejsou prázdná pole,
   - že `oneLiner` neobsahuje částku,
   - že všechny odkazy začínají `https://`.

JSON jde upravit i ručně, ale pak se rozejde s podklady.

Další nastavení:
- texty rozhraní: `src/copy.ts`,
- adresa pro hlášení chyb: `REPORT_URL` v `src/copy.ts`,
- barvy, fonty a rozestupy: `src/styles/tokens.css`,
- kdy se ukazují částky: `revealAmounts` v JSON kvízu (`"onComplete"` nebo `"onLock"`).

## Přidání kvízu

Další kvíz typu řazení přidáš bez změny kódu:

1. Vytvoř `src/data/quizzes/<id>.json` podle typu `OrderingQuiz` (`src/data/schema.ts`).
2. Přidej do `src/quizzes/registry.ts` záznam se `status: 'active'` a funkcí `load`. Jako vzor poslouží záznam `kolik-to-stalo`.

Jiný typ kvízu (výběr z možností, přiřazování dvojic) dostane vlastní složku v `src/quizzes/` se schématem a komponentou. Komponentu pak podle `type` vybere `src/pages/QuizPage.tsx`.

## Struktura

```
docs/                      zadání a podklady
scripts/convert-kauzy.mjs  převod podkladů do JSON
src/
  App.tsx, router.ts       hash routing
  copy.ts                  texty UI
  data/                    schéma (zod), data, validační test
  pages/                   domovská stránka, stránka kvízu
  quizzes/registry.ts      seznam kvízů
  quizzes/ordering/        kvíz typu řazení
    logic.ts               čisté funkce: moveAmongFree, check, correctSlotRange, shuffle
    state.ts               reducer (MOVE, CHECK, REVEAL, RESTART)
    persistence.ts         ukládání do localStorage (pg:quiz:<id>:v1)
    OrderingQuiz.tsx, ItemCard.tsx, WinOverlay.tsx, CoinRain.tsx, SourcesList.tsx
  styles/                  tokens.css, global.css
```
