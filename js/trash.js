// The trash bin: things the student deleted wait here for 30 days, then are gone for good.
// This file holds only the rules (no screen, no saving), so they can be checked with pretend dates.
//
// A trash is { items, gone }:
//   items: what is waiting, each { id, kind, key, label, deletedAt, data }
//   gone:  the built-in foods and breakfasts that were deleted for good, as "kind:key" (they stay hidden)
//
// kind is one of:
//   'builtin-food'       a food that comes with the app            key = its id
//   'builtin-breakfast'  a breakfast that comes with the app       key = its id
//   'own-food'           a food the student typed                  key = its name
//   'own-basic'          a cooking basic the student typed         key = its name
//   'own-breakfast'      a breakfast the student made              key = its id

export const TRASH_DAYS = 30;
const DAY_MILLISECONDS = 24 * 60 * 60 * 1000;

export const TRASH_KINDS = ['builtin-food', 'builtin-breakfast', 'own-food', 'own-basic', 'own-breakfast'];

export function emptyTrash() {
  return { items: [], gone: [] };
}

// Built-in things are hidden, not erased: even after they are gone for good they stay hidden.
function isBuiltIn(kind) {
  return kind === 'builtin-food' || kind === 'builtin-breakfast';
}

function goneKey(entry) {
  return `${entry.kind}:${entry.key}`;
}

// The trash with this thing in it. `thing` is { kind, key, label, data }. Returns a new trash.
// Putting the same thing in again replaces the older entry.
export function moveToTrash(trash, thing, now) {
  const entry = { id: `${thing.kind}:${thing.key}:${now}`, kind: thing.kind, key: thing.key, label: thing.label, deletedAt: now, data: thing.data || {} };
  const others = trash.items.filter((item) => !(item.kind === entry.kind && item.key === entry.key));
  return { items: [...others, entry], gone: trash.gone };
}

// The trash without this entry, and the entry (null if there is none by this id). A restored built-in
// thing is no longer hidden, because hiding comes from the trash. Returns { trash, entry }.
export function restoreFromTrash(trash, id) {
  const entry = trash.items.find((item) => item.id === id) || null;
  if (!entry) return { trash, entry: null };
  return { trash: { items: trash.items.filter((item) => item.id !== id), gone: trash.gone }, entry };
}

// Deletes one entry for good. A built-in food or breakfast stays hidden (it is added to `gone`).
export function deleteForGood(trash, id) {
  const entry = trash.items.find((item) => item.id === id) || null;
  if (!entry) return { trash, entry: null };
  const gone = isBuiltIn(entry.kind) && !trash.gone.includes(goneKey(entry)) ? [...trash.gone, goneKey(entry)] : trash.gone;
  return { trash: { items: trash.items.filter((item) => item.id !== id), gone }, entry };
}

// Deletes everything in the trash for good. Returns { trash, entries }.
export function emptyAll(trash) {
  let next = trash;
  const entries = [];
  trash.items.forEach((item) => {
    const done = deleteForGood(next, item.id);
    next = done.trash;
    entries.push(done.entry);
  });
  return { trash: next, entries };
}

// Whole days still left before this entry is deleted for good (30 on the first day, 1 on the last).
export function daysLeft(entry, now) {
  return Math.max(0, Math.ceil((entry.deletedAt + TRASH_DAYS * DAY_MILLISECONDS - now) / DAY_MILLISECONDS));
}

// The last days before a thing is deleted for good are marked in red.
export const SOON_DAYS = 3;

// What the trash icon shows: how many things are in the trash, and whether any of them is about to be deleted.
export function trashSummary(trash, now) {
  return { count: trash.items.length, soon: trash.items.some((item) => daysLeft(item, now) <= SOON_DAYS) };
}

// What a screen reader says for the trash icon (the count is in the words too, not only on the little badge).
export function trashButtonLabel(count) {
  return count === 0 ? 'Open the trash' : `Open the trash, ${count} ${count === 1 ? 'thing' : 'things'} inside`;
}

// True when the entry has been in the trash for 30 days or more.
export function isExpired(entry, now) {
  return now - entry.deletedAt >= TRASH_DAYS * DAY_MILLISECONDS;
}

// Deletes for good everything that has waited 30 days. Returns { trash, purged }.
export function purgeExpired(trash, now) {
  let next = trash;
  const purged = [];
  trash.items.filter((item) => isExpired(item, now)).forEach((item) => {
    const done = deleteForGood(next, item.id);
    next = done.trash;
    purged.push(done.entry);
  });
  return { trash: next, purged };
}

// The ids of the built-in things of this kind that are hidden: waiting in the trash, or gone for good.
export function hiddenKeys(trash, kind) {
  const waiting = trash.items.filter((item) => item.kind === kind).map((item) => item.key);
  const prefix = `${kind}:`;
  const forGood = trash.gone.filter((key) => key.startsWith(prefix)).map((key) => key.slice(prefix.length));
  return new Set([...waiting, ...forGood]);
}

// Brings back every built-in thing that was deleted for good (the ones waiting in the trash stay there).
export function bringBackBuiltIn(trash) {
  return { items: trash.items, gone: [] };
}

// A trash read from saved data: anything that is not usable is left out. Always returns a trash.
export function cleanTrash(saved) {
  if (!saved || typeof saved !== 'object') return emptyTrash();
  const items = Array.isArray(saved.items) ? saved.items : [];
  const usable = items.filter(
    (item) =>
      item &&
      typeof item.id === 'string' &&
      TRASH_KINDS.includes(item.kind) &&
      typeof item.key === 'string' &&
      item.key !== '' &&
      typeof item.label === 'string' &&
      Number.isFinite(item.deletedAt)
  );
  const seen = new Set();
  const unique = usable
    .filter((item) => {
      const name = `${item.kind}:${item.key}`;
      if (seen.has(name)) return false;
      seen.add(name);
      return true;
    })
    .map((item) => ({ ...item, data: item.data && typeof item.data === 'object' ? item.data : {} }));
  const gone = Array.isArray(saved.gone)
    ? saved.gone.filter((key) => typeof key === 'string' && TRASH_KINDS.some((kind) => isBuiltIn(kind) && key.startsWith(`${kind}:`)))
    : [];
  return { items: unique, gone: [...new Set(gone)] };
}
