// Rules for the "Set up tonight" checklist, kept apart from the screen so they are easy to test.

import { prepLibrary } from './data.js';

// Today's date as text, in the student's own time zone: "2026-10-22". The checklist starts
// fresh on a new day, because it is a nightly routine.
export function todayKey(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

// The list with the item at `index` moved one place up (delta -1) or down (delta 1). A move off
// either end changes nothing. Returns a new list.
export function moveItem(items, index, delta) {
  const target = index + delta;
  if (index < 0 || index >= items.length || target < 0 || target >= items.length) return [...items];
  const moved = [...items];
  [moved[index], moved[target]] = [moved[target], moved[index]];
  return moved;
}

// Adds the item to the ticked ones, or removes it if it is already ticked.
export function toggleChecked(checkedItems, item) {
  return checkedItems.includes(item) ? checkedItems.filter((other) => other !== item) : [...checkedItems, item];
}

// How many of the checklist's items are ticked (ticks for items that no longer exist are ignored).
export function countDone(items, checkedItems) {
  return items.filter((item) => checkedItems.includes(item)).length;
}

// For each item in list order, whether it is ticked. The progress bar uses this, so ticking
// item 4 before item 1 fills the fourth segment, not the first.
export function segmentStates(items, checkedItems) {
  return items.map((item) => checkedItems.includes(item));
}

// The longest line a student can write for their own task.
export const MAX_TASK_LENGTH = 80;

// Checks a task the student typed. Returns { task } with the text tidied up, or { error } saying
// what to fix. `existingTasks` are the lines already on the list, so the same line is not added twice.
export function cleanCustomTask(text, existingTasks) {
  const task = String(text || '').trim().replace(/\s+/g, ' ');
  if (!task) return { error: 'Write something first.' };
  if (task.length > MAX_TASK_LENGTH) return { error: 'Too long.' };
  if (existingTasks.some((other) => other.toLowerCase() === task.toLowerCase())) {
    return { error: 'Already on your list.' };
  }
  return { task };
}

// The wording for how far along the checklist is: what is done and what is left.
export function progressWording(done, total) {
  if (total === 0) return { done: 'No tasks chosen', left: 'tap Choose tasks' };
  if (total > 0 && done >= total) return { done: `All ${total} done`, left: 'ready for tomorrow' };
  return { done: `${done} of ${total} done`, left: `${total - done} to go` };
}

// The picture on a line of your own until you choose another (a pencil: "written by me").
export const DEFAULT_TASK_ICON = '\u270F\uFE0F';

// Pictures offered for your own lines; the picker also takes any emoji typed from the keyboard.
export const ICON_CHOICES = [
  '\u270F\uFE0F', '\u2B50', '\u2764\uFE0F', '\u23F0', '\uD83D\uDCDD', '\uD83C\uDF73',
  '\uD83E\uDD5B', '\u2615', '\uD83C\uDF4E', '\uD83C\uDF5E', '\uD83E\uDD63', '\uD83E\uDD57',
  '\uD83D\uDC14', '\uD83E\uDD69', '\uD83E\uDDCA', '\uD83E\uDDFA', '\uD83E\uDDFD', '\uD83D\uDECD\uFE0F',
  '\uD83D\uDCA7', '\uD83C\uDF19', '\u2600\uFE0F', '\uD83C\uDF31', '\uD83D\uDCDA', '\uD83C\uDF89',
];

// The one emoji at the start of what the student typed or pasted, or null if it does not start with
// an emoji (so letters and numbers cannot become a picture).
export function cleanTaskIcon(text) {
  const first = [...new Intl.Segmenter().segment(String(text || '').trim())][0]?.segment;
  return first && /\p{Extended_Pictographic}/u.test(first) ? first : null;
}

const LIBRARY_LINES = new Map(prepLibrary.flatMap((group) => group.tasks).map((task) => [task.id, task]));

// A line the student wrote is saved as "my:" followed by their words, so it can never be mistaken
// for one of the suggested lines.
const OWN_PREFIX = 'my:';

export function ownTask(text) {
  return OWN_PREFIX + text;
}

// The words of the student's own lines found in a saved list (without the "my:" mark).
export function ownTextsIn(tasks) {
  return tasks.filter((task) => task.startsWith(OWN_PREFIX)).map((task) => task.slice(OWN_PREFIX.length));
}

export function isLibraryTask(task) {
  return LIBRARY_LINES.has(task);
}

// What to show for a saved line: its picture, its words (key word between ** **), optional
// detail, and the plain words without the ** marks (for comparing and for screen readers).
export function describeTask(task, ownIcons = {}) {
  const line = LIBRARY_LINES.get(task);
  if (line) return { icon: line.icon, text: line.text, detail: line.detail || '', plain: line.text.replace(/\*\*/g, '') };
  const words = task.startsWith(OWN_PREFIX) ? task.slice(OWN_PREFIX.length) : task;
  const icon = Object.hasOwn(ownIcons, words) ? ownIcons[words] : DEFAULT_TASK_ICON;
  return { icon, text: words, detail: '', plain: words };
}

// Turns a saved line into today's form: the old long wording becomes its id, and anything else
// that is not already an id or a "my:" line was written by the student, so it gets the prefix.
export function migratePrepTask(task, legacyIds) {
  if (Object.hasOwn(legacyIds, task)) return legacyIds[task];
  if (LIBRARY_LINES.has(task) || task.startsWith(OWN_PREFIX)) return task;
  return OWN_PREFIX + task;
}
