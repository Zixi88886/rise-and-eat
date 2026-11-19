// Small visual cues for each breakfast step, worked out from the step's own words so that built-in
// and the student's own breakfasts both get them: a picture, the first word to highlight, and
// how long to wait, if the step says so.

// The picture for a step: the first rule whose words appear in the step wins, so more specific
// rules come first. Steps that match nothing get a plain pointing hand.
export const FALLBACK_STEP_ICON = '👉';

const ICON_RULES = [
  [/rinse|running water/, '\uD83D\uDEB0'],
  [/microwave(?!-safe)|warm canned/, '\u2668\uFE0F'],
  [/blender|blend|shaker|shake|\bdrink\b|into the cup/, '\uD83E\uDD64'],
  [/whisk|scramble/, '\uD83E\uDD63'],
  [/bacon/, '\uD83E\uDD53'],
  [/tortilla|roll it up|fold it over|taco/, '\uD83C\uDF2F'],
  [/pancake|waffle|bubbles/, '\uD83E\uDD5E'],
  [/bagel/, '\uD83E\uDD6F'],
  [/avocado/, '\uD83E\uDD51'],
  [/hash brown/, '\uD83E\uDD54'],
  [/toast|bread|slice of|slices of|sandwich|bun\b/, '\uD83C\uDF5E'],
  [/\bcrack\b|\begg|eggs\b/, '\uD83E\uDD5A'],
  [/cracker/, '\uD83C\uDF58'],
  [/blueberr|strawberr|berries|berry/, '\uD83E\uDED0'],
  [/banana|peel/, '\uD83C\uDF4C'],
  [/apple/, '\uD83C\uDF4E'],
  [/fruit/, '\uD83C\uDF53'],
  [/peanut butter|nut butter|\bnuts\b/, '\uD83E\uDD5C'],
  [/\bbutter\b/, '\uD83E\uDDC8'],
  [/\bjam\b|jelly/, '\uD83C\uDF47'],
  [/hummus/, '\uD83E\uDDC6'],
  [/honey|syrup|drizzle/, '\uD83C\uDF6F'],
  [/cheese/, '\uD83E\uDDC0'],
  [/yogurt/, '\uD83E\uDD5B'],
  [/oat|cereal|granola|jar\b/, '\uD83E\uDD63'],
  [/\bmilk\b/, '\uD83E\uDD5B'],
  [/stir|pour/, '\uD83E\uDD63'],
  [/rice|beans/, '\uD83C\uDF5A'],
  [/pan\b|melt|fry|heat|cook|soften|warm/, '\uD83C\uDF73'],
  [/salt|pepper|season|cinnamon|soy sauce|hot sauce/, '\uD83E\uDDC2'],
  [/\bcut\b|halve|wedge|chop/, '\uD83D\uDD2A'],
  [/plate|serve|stack|pile|layer|top\b|lay\b|add|eat|done|take|put|spoon|mash|press|dip|combine/, '\uD83C\uDF7D\uFE0F'],
];

// A picture for the step, always the same one for the same words.
export function stepIcon(text) {
  const words = String(text || '').toLowerCase();
  const rule = ICON_RULES.find(([pattern]) => pattern.test(words));
  return rule ? rule[1] : FALLBACK_STEP_ICON;
}

// Pictures offered when the student chooses their own for a step; the picker also takes any
// emoji typed from the keyboard.
export const STEP_ICON_CHOICES = [
  '\uD83C\uDF5E', '\uD83E\uDD5A', '\uD83C\uDF73', '\uD83E\uDD53', '\uD83C\uDF2F', '\uD83E\uDD5E',
  '\uD83E\uDD51', '\uD83E\uDDC0', '\uD83E\uDD5B', '\uD83E\uDD63', '\uD83E\uDD64', '\uD83C\uDF4C',
  '\uD83C\uDF4E', '\uD83E\uDED0', '\uD83C\uDF6F', '\uD83E\uDD5C', '\uD83E\uDDC8', '\uD83E\uDDC2',
  '\uD83D\uDD2A', '\uD83C\uDF7D\uFE0F', '\u2668\uFE0F', '\uD83D\uDEB0', '\u23F1\uFE0F', '\uD83D\uDC49',
];

// The words of a step, counted from 0, as the student taps them to highlight.
export function stepWords(text) {
  return String(text || '').match(/\S+/g) || [];
}

// A word's letters and numbers, without the punctuation around it ("Salt," -> "Salt").
function wordParts(word) {
  const [, before, core, after] = word.match(/^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}]*)$/u);
  return { before, core, after };
}

// Whether a word can be highlighted (a dash on its own cannot).
export function canHighlight(word) {
  return wordParts(word).core !== '';
}

// The food and things a step is about. The first one found in the big part is highlighted,
// because it is the most important word ("Drop **bread** in the toaster"). Longer names come
// first so "peanut butter" is found before "butter".
const KEY_THINGS = new RegExp(
  '\\b(?:' +
    [
      'peanut butter', 'nut butter', 'cream cheese', 'cottage cheese', 'egg muffins?', 'hash browns?',
      'soy sauce', 'hot sauce', 'protein powder', 'pancake mix', 'maple syrup', 'oatmeal packet',
      'eggs?', 'bread', 'bagel', 'tortilla', 'buns?', 'sandwich', 'banana', 'apple', 'berries', 'fruit',
      'yogurt', 'milk', 'oats?', 'oatmeal', 'granola', 'cereal', 'cheese', 'butter', 'honey', 'syrup',
      'jam', 'jelly', 'hummus', 'avocado', 'bacon', 'turkey', 'rice', 'beans', 'veg', 'cucumber',
      'tomato', 'lettuce', 'mustard', 'cinnamon', 'salt', 'pepper', 'oil', 'waffles?', 'pancakes?',
      'mixture', 'jar', 'stir', 'nuts', 'crackers?', 'chia', 'water', 'wedges', 'cup', 'mug', 'bowl', 'blender', 'pan',
    ].join('|') +
    ')\\b',
  'i'
);

// How long a step says to wait, with its number: "2\u20133 minutes", "20 seconds", "a minute".
const KEY_TIME = /\d+(?:\u2013\d+)?\s*(?:seconds?|minutes?)|\b(?:a|another)\s+minute\b/i;

// The word numbers that overlap the text from `start` to `end`.
function wordsBetween(text, start, end) {
  const numbers = [];
  let index = 0;
  for (const found of text.matchAll(/\S+/g)) {
    if (found.index < end && found.index + found[0].length > start) numbers.push(index);
    index += 1;
  }
  return numbers;
}

// With nothing chosen by the student, the most important words are highlighted: the first food or
// thing named in the big part ("bread", "peanut butter"), otherwise how long to wait ("2\u20133 minutes"),
// otherwise the first word (the action: "Stir", "Roll"). `mainEnd` is where the big part ends.
export function defaultMarks(text, mainEnd = String(text || '').length) {
  const step = String(text || '');
  const main = step.slice(0, mainEnd);
  const found = KEY_THINGS.exec(main) || KEY_TIME.exec(main);
  if (found) return wordsBetween(step, found.index, found.index + found[0].length);
  const first = stepWords(step)[0];
  return first && /^[\p{L}]/u.test(first) ? [0] : [];
}

// The step cut into pieces { text, mark } for showing, where mark is true for the highlighted words.
// Highlighted words next to each other become one highlight, and the pieces always add up to the step.
export function highlightParts(text, marks) {
  const pieces = [];
  let wordIndex = -1;
  (String(text || '').match(/\S+|\s+/g) || []).forEach((token) => {
    if (/^\s/.test(token)) {
      pieces.push({ text: token, mark: false, space: true });
      return;
    }
    wordIndex += 1;
    const { before, core, after } = wordParts(token);
    const marked = marks.includes(wordIndex) && core !== '';
    if (before) pieces.push({ text: before, mark: false });
    if (core) pieces.push({ text: core, mark: marked });
    if (after) pieces.push({ text: after, mark: false });
  });
  pieces.forEach((piece, index) => {
    if (piece.space && pieces[index - 1]?.mark && pieces[index + 1]?.mark) piece.mark = true;
  });
  return pieces.reduce((merged, piece) => {
    const last = merged[merged.length - 1];
    if (last && last.mark === piece.mark) last.text += piece.text;
    else merged.push({ text: piece.text, mark: piece.mark });
    return merged;
  }, []);
}

// The step's pieces for the big main part and the small extra part: { main, extra }, each a list
// of { text, mark } like highlightParts. `split` is the result of splitStep.
export function highlightSplit(split, marks) {
  const pieces = highlightParts(split.text, marks);
  const main = [];
  const extra = [];
  let offset = 0;
  pieces.forEach((piece) => {
    const end = offset + piece.text.length;
    const mainPart = piece.text.slice(0, Math.max(0, split.mainEnd - offset));
    const extraPart = piece.text.slice(Math.max(0, split.extraStart - offset));
    if (mainPart) main.push({ text: mainPart, mark: piece.mark });
    if (extraPart && end > split.extraStart) extra.push({ text: extraPart, mark: piece.mark });
    offset = end;
  });
  return { main, extra };
}

// The word numbers with this word added, or taken away if it was already there. Returns a new list.
export function toggleMark(marks, wordIndex) {
  return marks.includes(wordIndex)
    ? marks.filter((mark) => mark !== wordIndex)
    : [...marks, wordIndex].sort((a, b) => a - b);
}

// What a step shows: the student's own picture and highlighted words if they set them for this
// exact step, otherwise the automatic ones. `cues` is { breakfastId: { stepNumber: { text, icon, marks } } };
// a saved choice is ignored if the step's words are no longer the same.
export function stepCueFor(cues, breakfastId, stepNumber, text, mainEnd = String(text || '').length) {
  const saved = cues[breakfastId]?.[stepNumber];
  const usable = saved && saved.text === text;
  return {
    icon: usable && saved.icon ? saved.icon : stepIcon(text),
    marks: usable && Array.isArray(saved.marks) ? saved.marks : defaultMarks(text, mainEnd),
    custom: Boolean(usable),
  };
}

// The cues with this step's picture and highlighted words saved. Returns a new object.
export function setStepCue(cues, breakfastId, stepNumber, text, { icon, marks }) {
  return { ...cues, [breakfastId]: { ...cues[breakfastId], [stepNumber]: { text, icon, marks } } };
}

// The cues with this step back to automatic. Returns a new object.
export function clearStepCue(cues, breakfastId, stepNumber) {
  const { [stepNumber]: removed, ...others } = cues[breakfastId] || {};
  const next = { ...cues, [breakfastId]: others };
  if (Object.keys(others).length === 0) delete next[breakfastId];
  return next;
}

// The cues without any of this breakfast's steps (for when the breakfast is deleted).
export function removeBreakfastCues(cues, breakfastId) {
  const { [breakfastId]: removed, ...others } = cues;
  return others;
}

// A step has a main part, shown big, and an optional extra part, shown small underneath
// ("Cook 2\u20133 minutes" and "until the white sets"). The step's author can mark where the extra
// part starts with a bar: "Cook 2\u20133 minutes|until the white sets". Without a bar, the extra part
// starts at the first of a few common words ("until", "if you", "while"...). Returns
// { text, mainEnd, extraStart }: `text` is the whole step without the bar, the main part is
// text.slice(0, mainEnd) and the extra part is text.slice(extraStart) (empty if there is none).
const PUNCTUATION_BREAK = /\s*;\s*|\s+\u2014\s+/g;
const WORD_BREAK = /,\s+(?:or|so|then)\b|\s+(?:then|until|while|if you|if it|if needed)\b/g;

export function splitStep(raw) {
  const step = String(raw || '');
  const bar = step.indexOf('|');
  if (bar !== -1) {
    const main = step.slice(0, bar).trimEnd();
    const text = `${main} ${step.slice(bar + 1).trimStart()}`;
    return { text, mainEnd: main.length, extraStart: main.length + 1 };
  }

  const breaks = [];
  for (const found of step.matchAll(PUNCTUATION_BREAK)) {
    breaks.push({ mainEnd: found.index, extraStart: found.index + found[0].length });
  }
  for (const found of step.matchAll(WORD_BREAK)) {
    breaks.push({ mainEnd: found.index, extraStart: found.index + found[0].search(/[A-Za-z]/) });
  }
  // The first break that still leaves two words or more in the main part.
  const chosen = breaks
    .sort((one, two) => one.mainEnd - two.mainEnd)
    .find((point) => stepWords(step.slice(0, point.mainEnd)).length >= 2);
  return chosen ? { text: step, ...chosen } : { text: step, mainEnd: step.length, extraStart: step.length };
}

// How long the step says to wait, as short words ("2–3 min", "20 sec"), or '' if it does not say.
// Only the first time in the step is used.
export function stepTime(text) {
  const step = String(text || '');
  const range = step.match(/(\d+(?:–\d+)?)\s*(seconds?|minutes?)/i);
  if (range) return `${range[1]} ${range[2].toLowerCase().startsWith('sec') ? 'sec' : 'min'}`;
  if (/\b(?:a|another|one)\s+minute\b/i.test(step)) return '1 min';
  return '';
}
