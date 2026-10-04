// Všechny texty rozhraní (GDD kap. 8). Hodnoty v {složených závorkách} se dosazují.

export const copy = {
  'home.title': 'Politická gramotnost',
  'home.lead': 'Krátké kvízy o tom, jak funguje česká politika. Ke každé odpovědi najdeš zdroje.',
  'home.card.meta': '{n} kauz, asi {m} minut',
  'home.card.start': 'Hrát',
  'home.card.resume': 'Pokračovat',
  'home.card.again': 'Zahrát znovu',
  'home.card.comingSoon': 'Připravujeme',
  'footer.asOf': 'Údaje platí ke {datum}.',
  'footer.report': 'Našel jsi chybu? Napiš nám.',
  'quiz.back': 'Všechny kvízy',
  'quiz.title': 'Kolik to stálo stát?',
  'quiz.instructions':
    'Seřaď kauzy od té, která veřejné rozpočty stála nejvíc, po tu, která je stála nejméně. Karty přetahuj, nebo je posouvej šipkami. Až budeš mít pořadí, zkontroluj ho.',
  'quiz.methodology.toggle': 'Jak počítáme',
  'quiz.methodology.body':
    'Používáme nejlepší veřejně dostupné vyčíslení: rozhodnutí soudu, kontrolu NKÚ, údaje úřadů nebo obžalobu. Po vyřešení u každé částky uvidíš, co přesně znamená. Kauzy, u kterých žádná škoda prokázaná není, mají stejnou hodnotu a na jejich vzájemném pořadí nezáleží. Pokud soud o vině pravomocně nerozhodl, platí presumpce neviny.',
  'quiz.axis.top': 'Nejdražší',
  'quiz.axis.bottom': 'Nejlevnější',
  'card.people': 'Klíčoví aktéři',
  'card.people.toggle': 'Kdo to je?',
  'card.handle.aria': 'Přetáhnout kartu {název}',
  'card.up.aria': 'Posunout {název} výš',
  'card.down.aria': 'Posunout {název} níž',
  'card.locked': 'Správně',
  'live.moved': '{název} je teď na {pozice}. místě.',
  'check.button': 'Zkontrolovat pořadí',
  'check.disabledHint': 'Nejdřív něco přesuň',
  'check.result': 'Správně máš {k} z {n}. Zelené karty zůstanou na svém místě.',
  'check.noNew': 'Tentokrát nic nového. Zkus prohodit jiné karty.',
  'check.attempts': 'Počet kontrol: {a}',
  'win.title': 'Gratulujeme!',
  'win.body': 'Všech {n} kauz máš ve správném pořadí.',
  'win.primary': 'Ukázat částky',
  'win.secondary': 'Zpět na kvízy',
  'reveal.hint': 'Klikni na kauzu a přečti si, odkud částka pochází.',
  'detail.legal': 'Právní stav k {datum}',
  'detail.sources': 'Zdroje',
  'restart.button': 'Zahrát znovu',
  'restart.confirm': 'Opravdu začít znovu? Současný postup se smaže.',
  'sources.title': 'Zdroje',
  'sources.asOf': 'Údaje platí ke {datum}.',
  'sources.contextGroup': 'Politický kontext',
  'notFound': 'Tahle stránka neexistuje, tak tě vracíme na výběr kvízů.',

  // Doplňkové texty pro čtečky obrazovky a přetahování (GDD je výslovně neuvádí).
  'card.slot.aria': '{pozice}. místo: {název}',
  'card.locked.aria': '{název}, správně, zamčeno',
  'card.toggle.aria': 'Podrobnosti ke kauze {název}',
  'source.ref.aria': 'zdroj {n}',
  'dnd.instructions':
    'Kartu zvedneš mezerníkem nebo Enterem. Šipkami nahoru a dolů ji posuneš, mezerníkem nebo Enterem ji pustíš, klávesou Escape přesun zrušíš.',
  'dnd.start': 'Zvedl jsi kartu {název}. Je na {pozice}. místě.',
  'dnd.over': '{název} nad {pozice}. místem.',
  'dnd.cancel': 'Přesun zrušen. {název} zůstává na {pozice}. místě.',
  'sources.newTab': '(otevře se v nové kartě)',
} as const;

export type CopyKey = keyof typeof copy;

export function t(key: CopyKey, vars: Record<string, string | number> = {}): string {
  return copy[key].replace(/\{([^}]+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

/** "2026-10-03" → "3. 10. 2026" */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d}. ${m}. ${y}`;
}

// TODO: adresa pro nahlášení chyby (GDD kap. 5 a 15). Dokud je prázdná,
// zobrazí se v patičce jen text bez odkazu.
export const REPORT_URL = '';
