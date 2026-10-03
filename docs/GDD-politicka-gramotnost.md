# GDD: Politická gramotnost – web s kvízy

Verze 1.0, 3. 10. 2026. Vstupní dokumenty: tento GDD a `kauzy-zdroje.md`.

## 0. Pokyny pro Claude Code

- Nejdřív si přečti celý tento dokument a `docs/kauzy-zdroje.md`.
- `kauzy-zdroje.md` je jediný zdroj faktů. Nepřidávej kauzy a nevymýšlej částky, data, jména, role ani zdroje. Texty přebírej doslova; opravit smíš jen zjevné překlepy. Co v datech chybí, označ `TODO` a na konci práce to vypiš.
- Fakta určují data, chování aplikace určuje tento GDD. Když si odporují, zastav se a zeptej se.
- Postup práce:
  1. Založ projekt (kap. 11).
  2. Převeď `kauzy-zdroje.md` do JSON podle kap. 7 a napiš validační test.
  3. Napiš herní logiku jako čisté funkce a otestuj ji (kap. 6.4, 6.5, 12).
  4. Postav UI (kap. 5, 6, 8, 9).
  5. Dodělej přístupnost a mobil (kap. 10).
  6. Projdi akceptační kritéria (kap. 12) a napiš README.

## 1. Vize

Série krátkých kvízů, které hrou učí orientaci v české politice. Web má v základu výběr kvízů; první kvíz je „Kolik to stálo stát?“. Hráč seřadí deset politických kauz od té, která veřejné rozpočty stála nejvíc, po tu, která je stála nejméně. Po vyřešení u každé kauzy uvidí částku a rozbalí si vysvětlení se zdroji.

Co si má hráč odnést:
- Velký skandál neznamená automaticky velké náklady. Některé kauzy stály miliardy, jiné nic a na jedné stát dokonce vydělal.
- Částky z médií znamenají různé věci: rozsudek, kontrolu NKÚ, obžalobu, nebo jen odhad.
- Dokud soud pravomocně nerozhodne, platí presumpce neviny.

## 2. Cílová skupina a tón

- Středoškoláci, studenti a dospělí bez hlubší znalosti politiky. Hraje se na mobilu i počítači, ve škole i doma.
- Tón je věcný, srozumitelný a nestranický. Hráči se tyká. Žádné hodnocení stran, žádné vtipy na účet politiků.
- Nestrannost platí i pro design: žádné stranické barvy, loga ani fotografie politiků.
- U lidí se píše „Klíčoví aktéři“, nikdy „viníci“.

## 3. Rozsah MVP

V rozsahu:
- domovská stránka s výběrem kvízů,
- kvíz „Kolik to stálo stát?“ včetně kontroly, zamykání, výhry, odhalení částek a rozbalovacích detailů,
- sekce zdrojů viditelná po celou dobu,
- uložení rozehrané hry v prohlížeči,
- responzivita od 320 px a přístupnost podle kap. 10.

Mimo rozsah: backend, uživatelské účty, žebříčky, analytika, redakční systém, další jazyky. Další kvízy se zatím neprogramují, ale architektura s nimi musí počítat (kap. 14).

## 4. Struktura webu

Hash routing, aby web fungoval na libovolném statickém hostingu:

| Cesta | Obsah |
|---|---|
| `#/` | domovská stránka s výběrem kvízů |
| `#/kviz/kolik-to-stalo` | kvíz „Kolik to stálo stát?“ |
| cokoli jiného | přesměrování na `#/` s krátkou hláškou |

Obecně `#/kviz/:quizId`, kde `quizId` odpovídá záznamu v registru kvízů.

## 5. Domovská stránka

- Nahoře název webu „Politická gramotnost“ (pracovní název, viz otevřené otázky) a jedna věta popisu.
- Pod tím seznam kvízů z registru. Každá dlaždice má název, krátký popis, rozsah („10 kauz, asi 5 minut“) a tlačítko podle stavu uloženého v prohlížeči:
  - nezačato: „Hrát“,
  - rozehráno: „Pokračovat“,
  - dohráno: „Zahrát znovu“ (vede do kvízu, kde je hra už vyřešená a částky odhalené; restart je až tam).
- Kvízy se stavem `comingSoon` se zobrazí jako neaktivní dlaždice s textem „Připravujeme“ a bez odkazu. V registru budou dvě ukázkové („Kdo je kdo ve vládě“, „Jak vzniká zákon“); vlastník je přepíše nebo smaže.
- Patička: „Údaje platí ke 3. 10. 2026“ a odkaz pro nahlášení chyby (adresa je TODO).

```
┌────────────────────────────────────────────┐
│ Politická gramotnost                       │
│ Krátké kvízy o tom, jak funguje česká      │
│ politika. Ke každé odpovědi najdeš zdroje. │
│                                            │
│ ┌────────────────────────────────────────┐ │
│ │ Kolik to stálo stát?                   │ │
│ │ Seřaď 10 politických kauz podle toho,  │ │
│ │ kolik stály veřejné rozpočty.          │ │
│ │ 10 kauz, asi 5 minut        [ Hrát ]   │ │
│ └────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────┐ │
│ │ Kdo je kdo ve vládě      Připravujeme  │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ Údaje platí ke 3. 10. 2026. Našel jsi      │
│ chybu? Napiš nám.                          │
└────────────────────────────────────────────┘
```

## 6. Kvíz „Kolik to stálo stát?“

### 6.1 Herní smyčka

```
[Rozehráno] ──přesouvání──▶ [Rozehráno]
     │
     └─ Zkontrolovat ─▶ správné karty se zamknou
                         │
                         ├─ ne všechny správně ─▶ [Rozehráno]
                         └─ všechny správně ─▶ [Výhra: překryv s animací]
                                                   │
                                                   └─ Ukázat částky ─▶ [Odhaleno]
[Odhaleno] ── Zahrát znovu (s potvrzením) ─▶ [Rozehráno, nové zamíchání]
```

### 6.2 Hlavička kvízu

- Odkaz zpět „Všechny kvízy“.
- Nadpis „Kolik to stálo stát?“ a instrukce (texty v kap. 8).
- Rozbalovací blok „Jak počítáme“ s metodikou, poznámkou o presumpci neviny a datem platnosti údajů.
- Nad seznamem karet štítek „Nejdražší“, pod ním „Nejlevnější“. Sloty jsou očíslované 1–10 v levém okraji; čísla patří slotům, ne kartám.

### 6.3 Karta kauzy

Karta má tři stavy.

**Volná (výchozí):**
- úchyt pro přetažení,
- název kauzy (nadpis),
- jedna věta,
- „Klíčoví aktéři“: seznam „Jméno – role“,
- tlačítka posunu výš a níž.
- Částka, typ částky ani detail nejsou v DOM vůbec, ani skryté. Čtečka obrazovky ani vývojářské nástroje je nesmí prozradit.

**Zamčená (po kontrole na správném místě):**
- zelený okraj, světle zelené pozadí, ikona fajfky a text „Správně“; barva nikdy není jediný signál,
- úchyt a tlačítka posunu zmizí, karta nejde chytit ani posunout (`aria-disabled`, klávesnicí nejde vybrat k přesunu),
- při zamčení krátká animace „razítka“ (kap. 9), s omezeným pohybem bez animace.

**Odhalená (po výhře):**
- vše jako u zamčené, navíc výrazné „razítko“ s částkou, štítek typu částky a jednovětné vysvětlení,
- horní část karty se stane tlačítkem rolety (`<button aria-expanded aria-controls>`), vpravo šipka,
- po kliknutí se pod kartou rozbalí: podrobný popis (odstavce s odkazy [n]), „Právní stav k 3. 10. 2026“ a „Zdroje“ jako odkazy na čísla v sekci zdrojů,
- otevřených může být víc karet najednou; první klik kartu otevře, druhý zavře.

```
Volná:
 3 │ ⠿  Stoka                                 ▲ ▼ │
   │    Podle soudu skupina kolem místostarosty   │
   │    brněnské městské části manipulovala …     │
   │    Klíčoví aktéři: Jiří Švachula – bývalý    │
   │    místostarosta …; Lubomír Smolka – podn.   │

Odhalená a rozbalená:
 6 │ ✓ Stoka                     ┏━━━━━━━━━━━━┓ ▾ │
   │   Podle soudu skupina …     ┃ 49 mil. Kč ┃   │
   │   nárok poškozeného         ┗━━━━━━━━━━━━┛   │
   │   Takovou škodu uplatnila u soudu radnice …  │
   ├──────────────────────────────────────────────┤
   │ Podle soudu organizovaná skupina … [55]      │
   │ Právní stav k 3. 10. 2026: …                 │
   │ Zdroje: [53] [54] [55] [56]                  │
```

### 6.4 Přesouvání

- Přetahování myší a prstem. Na dotykových zařízeních musí jít stránka dál normálně posouvat; přetažení se aktivuje až po krátkém podržení nebo posunu úchytu.
- Klávesnice: karta jde vybrat k přesunu z úchytu (mezerník), šipkami posunout a mezerníkem pustit. Navíc mají karty tlačítka ▲ ▼, která fungují myší, prstem i klávesnicí.
- **Zamčené karty se nikdy nepohnou.** Volné karty se přesouvají jen po volných slotech:
  - Přetažení: když hráč pustí kartu nad zamčenou kartou, zamčená zůstane na místě a přesouvaná karta skončí v nejbližším volném slotu ve směru pohybu. Ostatní volné karty se posunou jen po volných slotech a zamčené přeskočí.
  - ▲ prohodí kartu s nejbližší volnou kartou nad ní, zamčené přeskočí. ▼ obdobně dolů. Když nad kartou (pod kartou) žádná volná není, tlačítko je neaktivní.
- Po každém přesunu ohlásí `aria-live` oblast: „Stoka je teď na 4. místě.“
- Pseudokód (implementuj jako čistou funkci a otestuj):

```ts
// order: id karet podle slotů 0..n-1; locked: množina zamčených id
function moveAmongFree(order: string[], locked: Set<string>, fromSlot: number, toSlot: number): string[] {
  const freeSlots = order.map((_, i) => i).filter(i => !locked.has(order[i]));
  const freeIds = freeSlots.map(i => order[i]);
  const from = freeSlots.indexOf(fromSlot);
  // cílový slot zamčený → nejbližší volný slot dál ve směru pohybu;
  // když tam žádný není, nejbližší volný slot na opačné straně
  const direction = toSlot > fromSlot ? 'towardBottom' : 'towardTop';
  const targetSlot = nearestFreeSlot(freeSlots, toSlot, direction);
  const to = freeSlots.indexOf(targetSlot);
  const moved = arrayMove(freeIds, from, to);
  const next = [...order];
  freeSlots.forEach((slot, k) => { next[slot] = moved[k]; });
  return next;
}
```

### 6.5 Kontrola

- Tlačítko „Zkontrolovat pořadí“ pod seznamem. Na mobilu je tlačítko spolu se stavovou hláškou přilepené ke spodnímu okraji obrazovky (respektuj safe-area).
- Když se od poslední kontroly pořadí nezměnilo, je tlačítko neaktivní s popiskem „Nejdřív něco přesuň“. Počet kontrol se zvyšuje jen při skutečné kontrole.
- **Remízy:** karty se stejným `rank` jsou zaměnitelné. Pořadí používá soutěžní číslování (1, 2, …, 6, 7, 7, 7, 10). Karta s pořadím `r` je správně, pokud leží v kterémkoli ze slotů `r-1` až `r-1 + (počet karet s pořadím r) - 1` (sloty číslované od 0).

```ts
function correctSlotRange(items: Item[], rank: number): [number, number] {
  const count = items.filter(i => i.rank === rank).length;
  return [rank - 1, rank - 1 + count - 1];
}
function isCorrectAt(item: Item, slot: number, items: Item[]): boolean {
  const [a, b] = correctSlotRange(items, item.rank);
  return slot >= a && slot <= b;
}
function check(order: string[], locked: Set<string>, items: Item[]) {
  // vrátí { newlyLocked: string[], allCorrect: boolean }
}
```

- Nově správné karty se zamknou (stav „Zamčená“). Špatné karty zůstanou neutrální, bez červené barvy a bez nápovědy, kterým směrem je posunout.
- Stavová hláška (`aria-live="polite"`):
  - přibyla správná karta: „Správně máš 4 z 10. Zelené karty zůstanou na svém místě.“
  - nepřibyla žádná: „Tentokrát nic nového. Zkus prohodit jiné karty.“
- Vedle hlášky „Počet kontrol: 2“.

### 6.6 Výhra

- Jakmile jsou po kontrole všechny karty správně, přes celou obrazovku se objeví překryv:
  - nadpis „Gratulujeme!“,
  - text „Všech 10 kauz máš ve správném pořadí.“ a „Počet kontrol: 3“,
  - hlavní tlačítko „Ukázat částky“, vedlejší „Zpět na kvízy“.
- Současně běží animace přes celou obrazovku: **déšť korun**. Asi 3 sekundy padají přes celou šířku obrazovky mince a symboly „Kč“ v barvách z kap. 9 (např. `canvas-confetti` s `shapeFromText`, nebo vlastní canvas). Animace neblokuje kliknutí na tlačítka.
- Při `prefers-reduced-motion: reduce` se nic nepadá, překryv se jen objeví.
- Překryv je modální dialog: `role="dialog"`, `aria-modal="true"`, focus na nadpis, focus nejde ven z dialogu, Esc funguje jako „Ukázat částky“.

### 6.7 Odhalení částek

- Po „Ukázat částky“ se překryv zavře a karty se postupně shora dolů „orazítkují“ částkou (zpoždění asi 120 ms mezi kartami). S omezeným pohybem se částky ukážou hned.
- Nad seznamem se objeví věta „Klikni na kauzu a přečti si, odkud částka pochází.“
- Karty se změní na rolety podle kap. 6.3.
- Místo tlačítka kontroly se objeví „Zahrát znovu“. Po potvrzení („Opravdu začít znovu? Současný postup se smaže.“) se hra vymaže a karty se znovu zamíchají.
- Načasování odhalení je v konfiguraci kvízu: `revealAmounts: "onComplete" | "onLock"`. Výchozí je `"onComplete"`, protože částka u zamčené karty by napovídala pořadí zbylých. Varianta `"onLock"` ukáže částku hned po zamčení, ale rolety se zpřístupní až po výhře.

### 6.8 Zdroje

- Pod kvízem je sekce „Zdroje“, viditelná vždy, i před vyřešením.
- Nad seznamem věta „Údaje platí ke 3. 10. 2026.“
- Zdroje jsou seskupené podle kauzy v pořadí, v jakém jsou kauzy v datech (abecedně), a na konci skupina „Politický kontext“. **Nikdy je neřaď podle řešení.**
- Každý zdroj: číslo [n], název článku jako odkaz (nová karta, `rel="noopener noreferrer"`), vydavatel.
- Každá položka má `id="zdroj-n"`. Odkazy [n] v detailech karet na ni skočí a cílová položka se krátce zvýrazní (s omezeným pohybem jen podbarvení bez animace).

### 6.9 Zamíchání a uložení postupu

- Na začátku se karty náhodně zamíchají tak, aby nebylo vyřešeno a aby na správném místě byla nejvýš jedna karta. Funkce bere generátor náhodných čísel jako parametr, aby šla testovat.
- Stav se ukládá do `localStorage` pod klíčem `pg:quiz:<quizId>:v1`:

```ts
type SavedState = {
  v: 1;
  order: string[];          // id karet podle slotů
  locked: string[];         // zamčená id
  attempts: number;         // počet kontrol
  lastCheckedOrder: string[] | null;
  solved: boolean;
  revealed: boolean;
};
```

- Každé čtení a zápis obal do `try/catch`. Když je uložený stav poškozený, nekompatibilní nebo nesedí s aktuálními daty (jiná sada id), začne se nová hra.

## 7. Datový model

### 7.1 Soubory

- `src/data/quizzes/kolik-to-stalo.json` – data kvízu převedená z `kauzy-zdroje.md`.
- `src/quizzes/registry.ts` – seznam kvízů pro domovskou stránku.

### 7.2 Typy

```ts
type Person = { name: string; role: string };

type Amount = {
  display: string;        // "49 mil. Kč", "+956,8 mil. Kč pro stát", "Škoda neprokázána"
  typeLabel: string;      // "nárok poškozeného", "výdaje podle NKÚ", …
  explanation: string;    // jedna věta, co číslo znamená
  sortValueCzk: number;   // jen informativní, řešení určuje rank
};

type OrderingItem = {
  id: string;
  title: string;
  period: string;
  oneLiner: string;       // zobrazuje se před vyřešením, nesmí obsahovat částku
  people: Person[];
  rank: number;           // soutěžní číslování, 1 = nejdražší
  amount: Amount;
  detail: string[];       // odstavce s odkazy ve tvaru [n]
  legalStatus: string;
  sourceIds: number[];
};

type Source = { id: number; title: string; publisher: string; url: string; date?: string };

type SourceGroup = { title: string; itemId?: string; sourceIds: number[] };

type OrderingQuiz = {
  id: string;             // "kolik-to-stalo"
  type: "ordering";
  title: string;
  shortDescription: string;
  estimatedMinutes: number;
  dataAsOf: string;       // "2026-10-03"
  axis: { top: string; bottom: string };
  revealAmounts: "onComplete" | "onLock";
  items: OrderingItem[];  // v pořadí z kauzy-zdroje.md (abecedně), ne podle řešení
  sourceGroups: SourceGroup[];
  sources: Source[];
};

type QuizRegistryEntry = {
  id: string;
  type: "ordering";
  status: "active" | "comingSoon";
  title: string;
  shortDescription: string;
  load?: () => Promise<OrderingQuiz>;
};
```

### 7.3 Ukázka jedné položky

```json
{
  "id": "stoka",
  "title": "Stoka",
  "period": "2015–2019",
  "oneLiner": "Podle soudu skupina kolem místostarosty brněnské městské části manipulovala za úplatky radniční zakázky.",
  "people": [
    { "name": "Jiří Švachula", "role": "bývalý místostarosta Brna-středu, tehdy člen ANO" },
    { "name": "Lubomír Smolka", "role": "podnikatel" }
  ],
  "rank": 6,
  "amount": {
    "display": "49 mil. Kč",
    "typeLabel": "nárok poškozeného",
    "explanation": "Takovou škodu uplatnila u soudu radnice Brno-střed. Státní zástupce celkovou škodu odhadoval až na půl miliardy korun.",
    "sortValueCzk": 49000000
  },
  "detail": [
    "Podle soudu organizovaná skupina kolem místostarosty Jiřího Švachuly v letech 2015–2019 ovlivňovala zakázky městské části Brno-střed výměnou za úplatky [55]. …",
    "Radnice uplatnila škodu 49 milionů korun, státní zástupce celkovou škodu odhadl zhruba na půl miliardy [53][54]. …"
  ],
  "legalStatus": "Původní trest 9,5 roku pro Švachulu zrušil Vrchní soud v Olomouci [55][56]. …",
  "sourceIds": [53, 54, 55, 56]
}
```

Čísla zdrojů ponech přesně podle `kauzy-zdroje.md`, aby šla data proti dokumentu snadno zkontrolovat. Zdroje [57] a [58] patří do skupiny „Politický kontext“. Záložní kauzu eDálnice do dat nepřidávej.

### 7.4 Validace dat (test, který musí projít)

- Všechna `id` položek jsou unikátní; kvíz má přesně 10 položek.
- `rank` tvoří platné soutěžní číslování: po seřazení platí, že každá položka má `rank` rovný 1 + počtu položek s menším `rank`.
- Každé `[n]` v `detail` a `legalStatus` existuje v `sources` a je v `sourceIds` dané položky.
- Každý zdroj je použitý aspoň jednou a patří do nějaké skupiny.
- `amount.display`, `amount.typeLabel` a `amount.explanation` nejsou prázdné.
- `oneLiner` neobsahuje částku: test selže na výrazech jako číslice následovaná „Kč“, „mil“, „mld“, „miliard“, „milion“ nebo „€“.
- Všechny URL začínají `https://`.

### 7.5 Vykreslení textu s odkazy

Texty se vykreslují jako prostý text. Jediné, co se parsuje, jsou značky `[n]`, které se mění na odkazy `#zdroj-n` s popiskem pro čtečku („zdroj 53“). Žádné `dangerouslySetInnerHTML`.

## 8. Texty rozhraní

| Klíč | Text |
|---|---|
| `home.title` | Politická gramotnost |
| `home.lead` | Krátké kvízy o tom, jak funguje česká politika. Ke každé odpovědi najdeš zdroje. |
| `home.card.meta` | {n} kauz, asi {m} minut |
| `home.card.start` | Hrát |
| `home.card.resume` | Pokračovat |
| `home.card.again` | Zahrát znovu |
| `home.card.comingSoon` | Připravujeme |
| `footer.asOf` | Údaje platí ke {datum}. |
| `footer.report` | Našel jsi chybu? Napiš nám. |
| `quiz.back` | Všechny kvízy |
| `quiz.title` | Kolik to stálo stát? |
| `quiz.instructions` | Seřaď kauzy od té, která veřejné rozpočty stála nejvíc, po tu, která je stála nejméně. Karty přetahuj, nebo je posouvej šipkami. Až budeš mít pořadí, zkontroluj ho. |
| `quiz.methodology.toggle` | Jak počítáme |
| `quiz.methodology.body` | Používáme nejlepší veřejně dostupné vyčíslení: rozhodnutí soudu, kontrolu NKÚ, údaje úřadů nebo obžalobu. Po vyřešení u každé částky uvidíš, co přesně znamená. Kauzy, u kterých žádná škoda prokázaná není, mají stejnou hodnotu a na jejich vzájemném pořadí nezáleží. Pokud soud o vině pravomocně nerozhodl, platí presumpce neviny. |
| `quiz.axis.top` | Nejdražší |
| `quiz.axis.bottom` | Nejlevnější |
| `card.people` | Klíčoví aktéři |
| `card.handle.aria` | Přetáhnout kartu {název} |
| `card.up.aria` | Posunout {název} výš |
| `card.down.aria` | Posunout {název} níž |
| `card.locked` | Správně |
| `live.moved` | {název} je teď na {pozice}. místě. |
| `check.button` | Zkontrolovat pořadí |
| `check.disabledHint` | Nejdřív něco přesuň |
| `check.result` | Správně máš {k} z {n}. Zelené karty zůstanou na svém místě. |
| `check.noNew` | Tentokrát nic nového. Zkus prohodit jiné karty. |
| `check.attempts` | Počet kontrol: {a} |
| `win.title` | Gratulujeme! |
| `win.body` | Všech {n} kauz máš ve správném pořadí. |
| `win.primary` | Ukázat částky |
| `win.secondary` | Zpět na kvízy |
| `reveal.hint` | Klikni na kauzu a přečti si, odkud částka pochází. |
| `detail.legal` | Právní stav k {datum} |
| `detail.sources` | Zdroje |
| `restart.button` | Zahrát znovu |
| `restart.confirm` | Opravdu začít znovu? Současný postup se smaže. |
| `sources.title` | Zdroje |
| `sources.asOf` | Údaje platí ke {datum}. |
| `sources.contextGroup` | Politický kontext |
| `notFound` | Tahle stránka neexistuje, tak tě vracíme na výběr kvízů. |

Všechny texty drž v jednom souboru (`src/copy.ts`), aby šly snadno upravit.

## 9. Vizuální směr

### 9.1 Koncept: úřední spis a razítko

Kvíz je o veřejných penězích, takže vizuální jazyk vychází z úředního papíru: listy spisu, kancelářský papír, fialové razítko. Karty kauz připomínají lístky ve spisu, řazené podél očíslované osy. Jediný výrazný moment je razítko s částkou, které po výhře „dopadne“ na každou kartu. Vše ostatní zůstává klidné a čitelné.

### 9.2 Barvy

| Token | Hex | Použití |
|---|---|---|
| `--paper` | `#EEF0EB` | pozadí stránky, chladný kancelářský papír |
| `--sheet` | `#FFFFFF` | karty, dialogy |
| `--ink` | `#1B2330` | text a nadpisy |
| `--ink-muted` | `#586272` | role aktérů, metadata, popisky |
| `--rule` | `#C8CDD2` | linky, okraje volných karet |
| `--stamp` | `#4B2E83` | razítka s částkami, odkazy, focus |
| `--correct` | `#17663F` | okraj, ikona a text zamčených karet |
| `--correct-tint` | `#DDEFE3` | pozadí zamčených karet |

Zelená je vyhrazená jen pro „správně“. Částky mají vždy barvu razítka, i ta kladná u Bitcoinové kauzy, aby barva nic nenapovídala. Před dokončením ověř kontrast všech kombinací textu a pozadí (WCAG AA).

### 9.3 Typografie

- Nadpisy, čísla slotů a částky: **Archivo** (tučné řezy, u částek tabulkové číslice; pokud balíček nabízí osu šířky, použij u částek mírně rozšířený řez).
- Text karet, detailů a zdrojů: **Source Serif 4**, 17–18 px, řádkování kolem 1,55, délka řádku do 70 znaků.
- Ovládací prvky: Archivo, běžná váha.
- Oba fonty hostuj lokálně přes balíčky `@fontsource`. Žádné načítání z Google Fonts CDN (GDPR) a žádné jiné externí požadavky.
- Vyhni se psaní popisků velkými písmeny, středovým tečkám v metadatech a šipkám přilepeným k textu tlačítek.

### 9.4 Rozvržení

- Jeden sloupec, maximální šířka kolem 46 rem, zarovnání vlevo.
- Čísla slotů 1–10 v levém okraji jako osa; jde o skutečné pořadí, takže číslování má smysl. Nad osou „Nejdražší“, pod ní „Nejlevnější“.
- Karty: bílý list s tenkým okrajem `--rule` a mírným zaoblením; zamčené karty zelené podle kap. 9.2. Žádné stíny pod každou kartou, žádné dekorativní přechody.
- Sekce zdrojů menším písmem pod kvízem, oddělená linkou.
- Minimální velikost dotykových cílů 44 × 44 px.

### 9.5 Pohyb

- Přesouvání karet: plynulé posunutí (dnd-kit transformace).
- Zamčení karty: krátké „cvaknutí“ (lehké zmenšení a návrat, do 200 ms) a objevení fajfky.
- Výhra: déšť korun přes celou obrazovku (kap. 6.6).
- Odhalení: razítko s částkou dopadne s mírným pootočením a zmenšením z 1,2 na 1,0, postupně shora dolů.
- Nic dalšího se samo nehýbe. Při `prefers-reduced-motion: reduce` všechny animace vypni a ponech jen okamžité změny stavu.

## 10. Přístupnost

Cíl je WCAG 2.2 AA.

- Celá hra jde dohrát jen klávesnicí, jen dotykem i se čtečkou obrazovky.
- Viditelný focus u všech ovládacích prvků (obrys `--stamp`, 3 px).
- Přesuny a výsledky kontroly se oznamují přes `aria-live="polite"`.
- Seznam karet je `<ol>`, každá karta je položka s číslem slotu v přístupném názvu.
- Zamčení se sděluje textem „Správně“ a ikonou, ne jen barvou.
- Rolety jsou `<button>` s `aria-expanded` a `aria-controls`.
- Dialog výhry splňuje kap. 6.6.
- Před vyřešením nejsou částky v DOM (kap. 6.3).
- Stránka funguje při zvětšení na 200 % a na šířce 320 px bez vodorovného posouvání.
- Jazyk dokumentu je `lang="cs"`.

## 11. Technické řešení

- **Stack:** Vite, React, TypeScript (strict). Přetahování `@dnd-kit/core` a `@dnd-kit/sortable` (pointer, touch i keyboard senzory). Animace výhry `canvas-confetti` nebo vlastní canvas. Validace dat `zod`. Testy Vitest a Testing Library.
- **Bez backendu**, výstupem je statický web.
- **Struktura:**

```
docs/
  GDD-politicka-gramotnost.md
  kauzy-zdroje.md
src/
  main.tsx
  App.tsx                    # hash router
  copy.ts                    # všechny texty UI
  styles/tokens.css          # barvy, typografie, rozestupy
  styles/global.css
  pages/HomePage.tsx
  pages/QuizPage.tsx         # podle typu kvízu vybere komponentu
  quizzes/registry.ts
  quizzes/ordering/
    OrderingQuiz.tsx
    ItemCard.tsx
    WinOverlay.tsx
    CoinRain.tsx
    SourcesList.tsx
    logic.ts                 # moveAmongFree, check, correctSlotRange, shuffle
    logic.test.ts
    persistence.ts
    persistence.test.ts
  data/
    schema.ts                # zod schéma typů z kap. 7
    data.test.ts             # validace z kap. 7.4
    quizzes/kolik-to-stalo.json
```

- **Stav hry:** `useReducer` v `OrderingQuiz` s akcemi `MOVE`, `CHECK`, `REVEAL`, `RESTART`; reducer volá čisté funkce z `logic.ts`. Každá změna stavu se uloží do `localStorage`.
- **Výkon:** žádné těžké knihovny navíc; data kvízu se načítají dynamicky přes `load()` z registru.
- **Bezpečnost:** externí odkazy s `rel="noopener noreferrer"`, žádné vkládání HTML z dat.

## 12. Testy a akceptační kritéria

### 12.1 Automatické testy

1. Data projdou schématem a validací z kap. 7.4.
2. `correctSlotRange` vrací pro tři karty s `rank` 7 sloty 6–8.
3. `isCorrectAt` přijme kterékoli pořadí karet se stejným `rank`.
4. `moveAmongFree` nikdy nepohne zamčenou kartou (náhodný test se stovkami přesunů a náhodnými zámky).
5. Zamíchání nikdy nevrátí vyřešený stav a nejvýš jedna karta je na správném místě; se stejným seedem vrací stejný výsledek.
6. `check` správně vrací nově zamčené karty a `allCorrect`.
7. Poškozený nebo nekompatibilní uložený stav vede k nové hře bez chyby.
8. Před vyřešením DOM neobsahuje žádný text `amount.display` ani `amount.explanation`.
9. Po vyřešení se objeví dialog; po „Ukázat částky“ jsou částky vidět a rolety přepínají `aria-expanded`.
10. Každý odkaz `[n]` v detailech vede na existující `#zdroj-n`.

### 12.2 Akceptační kritéria (ruční kontrola)

- Domovská stránka ukazuje kvíz a dvě neaktivní dlaždice „Připravujeme“.
- Karty jdou přesouvat myší, prstem na telefonu, klávesnicí i tlačítky ▲ ▼.
- Po kontrole se správné karty zabarví zeleně, ukážou „Správně“ a už nejdou posunout; ostatní karty kolem nich se přesouvají jen po volných slotech.
- Hláška ukazuje počet správných karet a počet kontrol; bez změny pořadí nejde kontrolovat znovu.
- Po správném seřazení všech karet se objeví „Gratulujeme!“ s deštěm korun přes celou obrazovku.
- Po „Ukázat částky“ má každá karta částku, typ a vysvětlení a po kliknutí rozbalí popis, právní stav a zdroje.
- Sekce zdrojů je vidět po celou dobu, je seskupená abecedně podle kauz a odkazy otevírají články v nové kartě.
- Po obnovení stránky hra pokračuje tam, kde skončila; „Zahrát znovu“ ji po potvrzení vymaže.
- S omezeným pohybem v systému se nic samo nehýbe.
- Na šířce 320 px a při zvětšení 200 % nic nepřetéká.
- Hra jde dohrát se čtečkou obrazovky (VoiceOver nebo NVDA).
- Prohlížeč nestahuje nic z cizích domén (kontrola v záložce Network).

## 13. Nasazení

- `npm run build` vytvoří statický web v `dist/`. V `vite.config.ts` nastav `base: './'`, aby web fungoval i v podsložce.
- Doporučený hosting: GitHub Pages (s GitHub Actions), Netlify nebo Vercel. Díky hash routingu není potřeba přesměrování.
- README: jak spustit (`npm install`, `npm run dev`, `npm test`), jak upravit data a jak přidat kvíz.

## 14. Rozšiřitelnost

- Nový kvíz stejného typu (řazení) vznikne jen přidáním JSON souboru a záznamu v registru, bez změny kódu.
- `QuizPage` vybírá komponentu podle `type`. Další typy (výběr z možností, přiřazování dvojic) se přidají jako nové složky v `src/quizzes/` se svým schématem.
- Texty UI, barvy i fonty jsou v jednom místě (`copy.ts`, `tokens.css`).

## 15. Otevřené otázky pro vlastníka

- Konečný název webu, doména a adresa pro nahlášení chyb.
- Ukazovat částky až po vyřešení (výchozí), nebo už po zamčení karty (`revealAmounts: "onLock"`)?
- Nadpisy některých článků v sekci zdrojů napovídají částky (např. „bitcoiny za miliardu“). Pokud to vadí, šlo by před vyřešením ukazovat jen vydavatele a nadpisy odkrýt po výhře.
- Ponechat Frakci ID (peníze EU, nikdo z SPD obviněn) a Čapí hnízdo (dotace z roku 2008)? Náhradou je záložní kauza eDálnice z `kauzy-zdroje.md`.
