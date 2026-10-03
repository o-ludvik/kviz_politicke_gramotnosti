// Převede docs/kauzy-zdroje.md na src/data/quizzes/kolik-to-stalo.json.
// Texty se přebírají doslova; skript nic nedomýšlí. Řádky „TODO“ v podkladech
// se nepřevádějí do dat, ale vypíšou se na konzoli.
//
// Spuštění: npm run data

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const md = readFileSync(join(root, 'docs/kauzy-zdroje.md'), 'utf8');
const outPath = join(root, 'src/data/quizzes/kolik-to-stalo.json');

const todos = [];

function fail(msg) {
  throw new Error(`convert-kauzy: ${msg}`);
}

function section(text, startHeading, endMarker) {
  const start = text.indexOf(startHeading);
  if (start < 0) fail(`chybí sekce ${startHeading}`);
  const end = endMarker ? text.indexOf(endMarker, start + startHeading.length) : -1;
  return text.slice(start, end < 0 ? undefined : end);
}

// „[57] ČT24 (8/2025): Název článku. https://…“
function parseSource(line) {
  const m = line.match(/^\[(\d+)\]\s+(.+?)(?:\s+\(([^)]+)\))?:\s+(.+)\s+(https:\/\/\S+)$/);
  if (!m) fail(`nečitelný zdroj: ${line}`);
  const [, id, publisher, date, rawTitle, url] = m;
  const title = rawTitle.trim().replace(/\.$/, '');
  const source = { id: Number(id), title, publisher: publisher.trim(), url };
  if (date) source.date = date;
  return source;
}

function parseSortValues(text) {
  const table = section(text, '## Správné pořadí', '\n\nHodnota');
  const values = {};
  for (const line of table.split('\n')) {
    const cells = line.split('|').map((c) => c.trim());
    if (cells.length < 6 || !/^\d+$/.test(cells[1])) continue;
    const title = cells[2];
    const value = Number(cells[5].replace(/\s/g, '').replace('−', '-'));
    if (Number.isNaN(value)) fail(`nečitelná sortValue u ${title}`);
    values[title] = value;
  }
  return values;
}

function parseCard(block, sortValues) {
  const lines = block.split('\n');
  const title = lines[0].replace(/^###\s+/, '').trim();
  const field = (label) => {
    const re = new RegExp(`^- \\*\\*${label}[^*]*:\\*\\*\\s*(.*)$`);
    for (const l of lines) {
      const m = l.match(re);
      if (m) return m[1].trim();
    }
    fail(`${title}: chybí pole ${label}`);
  };
  // Odrážky druhé úrovně pod daným polem.
  const subList = (label) => {
    const idx = lines.findIndex((l) => l.startsWith(`- **${label}`));
    if (idx < 0) fail(`${title}: chybí seznam ${label}`);
    const out = [];
    for (let i = idx + 1; i < lines.length && lines[i].startsWith('  - '); i++) {
      out.push(lines[i].slice(4).trim());
    }
    return out;
  };

  const people = subList('Klíčoví aktéři').map((p) => {
    const at = p.indexOf(' – ');
    return at < 0 ? { name: p, role: '' } : { name: p.slice(0, at), role: p.slice(at + 3) };
  });

  const sources = [];
  for (const s of subList('Zdroje')) {
    if (s.startsWith('TODO')) {
      todos.push(`${title}: ${s}`);
      continue;
    }
    sources.push(parseSource(s));
  }

  if (!(title in sortValues)) fail(`${title}: chybí v tabulce řešení`);

  return {
    item: {
      id: field('id').replace(/`/g, ''),
      title,
      period: field('Období'),
      oneLiner: field('Jedna věta'),
      people,
      rank: Number(field('rank')),
      amount: {
        display: field('Částka'),
        typeLabel: field('Typ částky'),
        explanation: field('Vysvětlení částky'),
        sortValueCzk: sortValues[title],
      },
      detail: subList('Podrobný popis'),
      legalStatus: field('Právní stav'),
      sourceIds: sources.map((s) => s.id),
    },
    sources,
  };
}

const sortValues = parseSortValues(md);
const cardsText = section(md, '## Karty kauz', '\n---\n');
const blocks = cardsText.split(/\n(?=### )/).slice(1);

const items = [];
const sources = [];
const sourceGroups = [];
for (const block of blocks) {
  const { item, sources: s } = parseCard(block, sortValues);
  items.push(item);
  sources.push(...s);
  sourceGroups.push({ title: item.title, itemId: item.id, sourceIds: item.sourceIds });
}

const contextText = section(md, 'Zdroje ke kontextu:', '\n\n');
const contextSources = contextText
  .split('\n')
  .filter((l) => l.startsWith('- ['))
  .map((l) => parseSource(l.slice(2)));
sources.push(...contextSources);
sourceGroups.push({ title: 'Politický kontext', sourceIds: contextSources.map((s) => s.id) });

sources.sort((a, b) => a.id - b.id);

const quiz = {
  id: 'kolik-to-stalo',
  type: 'ordering',
  title: 'Kolik to stálo stát?',
  shortDescription: 'Seřaď 10 politických kauz podle toho, kolik stály veřejné rozpočty.',
  estimatedMinutes: 5,
  dataAsOf: '2026-10-03',
  axis: { top: 'Nejdražší', bottom: 'Nejlevnější' },
  revealAmounts: 'onComplete',
  items,
  sourceGroups,
  sources,
};

writeFileSync(outPath, JSON.stringify(quiz, null, 2) + '\n');
console.log(`Zapsáno ${items.length} kauz a ${sources.length} zdrojů do ${outPath}`);
if (todos.length) {
  console.log('\nTODO z podkladů:');
  for (const t of todos) console.log(`- ${t}`);
}
