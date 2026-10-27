import { builtInBreakfasts, defaultPrepTasks, prepLibrary, stepPhotos } from './data.js';
import {
  buildBreakfast,
  matchesFilters,
  MAX_MINUTES,
  TAG_OPTIONS,
  tagLabel,
  toggleFavorite,
  toggleTag,
} from './breakfasts.js';
import {
  INGREDIENT_GROUPS,
  canMake,
  countItems,
  describeNeeds,
  haveLabels,
  itemIdOfKind,
  kindIdsOf,
  missingNeeds,
} from './ingredients.js';
import {
  cleanCustomTask,
  countDone,
  cleanTaskIcon,
  describeTask,
  DEFAULT_TASK_ICON,
  moveItem,
  ICON_CHOICES,
  isLibraryTask,
  MAX_TASK_LENGTH,
  ownTask,
  progressWording,
  segmentStates,
  todayKey,
  toggleChecked,
} from './prep.js';
import {
  canHighlight,
  clearStepCue,
  defaultMarks,
  highlightSplit,
  splitStep,
  removeBreakfastCues,
  setStepCue,
  STEP_ICON_CHOICES,
  stepCueFor,
  stepIcon,
  stepTime,
  stepWords,
  toggleMark,
} from './stepcues.js';
import {
  builtInPhotoFor,
  fitSize,
  parseVideoLink,
  removeBreakfastMedia,
  setStepMedia,
  stepMediaFor,
} from './stepmedia.js';
import { dragOffset, isSwipeUp, isTap } from './swipe.js';
import {
  loadCustomBreakfasts,
  saveCustomBreakfasts,
  loadFavorites,
  loadKitchen,
  loadOwnPrepTasks,
  loadOwnTaskIcons,
  loadPrep,
  loadPrepTasks,
  loadStepCues,
  loadStepMedia,
  saveFavorites,
  saveKitchen,
  savePrep,
  savePrepTasks,
  saveStepCues,
  saveStepMedia,
} from './storage.js';

const ANY_TIME = Infinity;
const MINUTE_CHOICES = [
  { minutes: 2, label: '2' },
  { minutes: 5, label: '5' },
  { minutes: 8, label: '8' },
  { minutes: 15, label: '15' },
  { minutes: ANY_TIME, label: 'Any' },
];

const savedKitchen = loadKitchen();
const savedFavorites = loadFavorites();

const state = {
  view: 'home', // 'home' | 'results' | 'detail' | 'add' | 'kitchen' | 'tasks'
  returnTo: 'home', // where Back goes from the detail and add screens
  minutes: null,
  tags: [],
  have: savedKitchen.have, // ingredient ids the student has
  useKitchen: savedKitchen.useKitchen, // show only breakfasts they can make
  strictSeasonings: savedKitchen.strictSeasonings, // salt, oils and so on must be in the kitchen too
  almostOpen: savedKitchen.almostOpen, // the "Almost there" section is unfolded
  favorites: savedFavorites, // ids of the breakfasts the student has hearted
  onlyFavorites: false, // show only the favorites (starts off every visit)
  offset: 0, // index of the first breakfast shown on the results screen
  offsetHistory: [], // earlier offsets, so Previous can go back
  customBreakfasts: loadCustomBreakfasts(),
  selectedId: null,
  formErrors: {},
  formValues: { name: '', minutes: '', stepsText: '', tags: [], needs: [] },
  stepsDone: {},
  timerRunning: false,
  timerRemaining: 0,
  timerTotal: 0,
  interval: null,
};

// The pictures and highlighted words the student chose for breakfast steps (see askToEditStep).
let stepCues = loadStepCues();
// The photos and video links the student added to steps (see askForStepMedia).
let stepMedia = loadStepMedia();

const showBtn = document.getElementById('showBtn');
const tagChipsEl = document.getElementById('tagChips');
const kitchenCardEl = document.getElementById('kitchenCard');
const kitchenCountEl = document.getElementById('kitchenCount');
const kitchenSwitchEl = document.getElementById('kitchenSwitch');
const favoritesChipsEl = document.getElementById('favoritesChips');
const panelInner = document.getElementById('panelInner');
const surpriseBtn = document.getElementById('surpriseBtn');
const addBtnHome = document.getElementById('addBtnHome');
const prepToggle = document.getElementById('prepToggle');
const prepBody = document.getElementById('prepBody');
const prepArrow = document.getElementById('prepArrow');
const prepList = document.getElementById('prepList');
const prepReorderBtn = document.getElementById('prepReorderBtn');
const prepOrderHint = document.getElementById('prepOrderHint');
const prepSub = document.getElementById('prepSub');
const prepSegments = document.getElementById('prepSegments');

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function allBreakfasts() {
  return [...builtInBreakfasts, ...state.customBreakfasts];
}

function findBreakfast(id) {
  return allBreakfasts().find((b) => b.id === id);
}

// A small message that floats at the top of the screen. It disappears after a few seconds,
// unless it is a warning (sticky), which stays until the student dismisses it. It can be
// swiped up or tapped away at any time.
const TOAST_SECONDS = 4;
const TOAST_SLIDE_MILLISECONDS = 200;
const toastEl = document.getElementById('toast');
const toastText = document.getElementById('toastText');
let toastTimer = null;
let toastIsSticky = false;
let toastDragStartY = null;

function showToast(text, sticky = false) {
  clearTimeout(toastTimer);
  toastText.textContent = text;
  toastIsSticky = sticky;
  toastEl.classList.remove('leaving', 'dragging');
  toastEl.style.setProperty('--drag-y', '0px');
  toastEl.classList.toggle('sticky', sticky);
  toastEl.hidden = false;
  startToastTimer();
}

function startToastTimer() {
  clearTimeout(toastTimer);
  if (!toastIsSticky) toastTimer = setTimeout(slideToastAway, TOAST_SECONDS * 1000);
}

function hideToast() {
  clearTimeout(toastTimer);
  toastEl.hidden = true;
}

// Slides the message up out of sight, then hides it.
function slideToastAway() {
  clearTimeout(toastTimer);
  toastEl.classList.add('leaving');
  toastTimer = setTimeout(hideToast, TOAST_SLIDE_MILLISECONDS);
}

toastEl.addEventListener('pointerdown', (event) => {
  if (event.target.closest('.toast-close')) return;
  toastDragStartY = event.clientY;
  clearTimeout(toastTimer);
  toastEl.classList.add('dragging');
  try {
    toastEl.setPointerCapture(event.pointerId);
  } catch {
    // Pointer capture is only a nicety: dragging still works without it.
  }
});

toastEl.addEventListener('pointermove', (event) => {
  if (toastDragStartY === null) return;
  toastEl.style.setProperty('--drag-y', `${dragOffset(toastDragStartY, event.clientY)}px`);
});

function endToastDrag(event) {
  if (toastDragStartY === null) return;
  const startY = toastDragStartY;
  toastDragStartY = null;
  toastEl.classList.remove('dragging');
  if (isSwipeUp(startY, event.clientY) || isTap(startY, event.clientY)) {
    slideToastAway();
  } else {
    toastEl.style.setProperty('--drag-y', '0px'); // not far enough: spring back
    startToastTimer();
  }
}

toastEl.addEventListener('pointerup', endToastDrag);
toastEl.addEventListener('pointercancel', endToastDrag);
document.getElementById('toastClose').addEventListener('click', hideToast);

// ---------- Screens ----------
// Switches screen and redraws. Leaving a breakfast stops its timer.
function showScreen(view) {
  if (state.view === 'detail' && view !== 'detail') stopTimer();
  if (view === 'home') {
    renderKitchenBox();
    renderTagChips();
    renderFavoritesChip();
    renderPrep();
  }
  state.view = view;
  document.body.dataset.screen = view;
  renderPanel();
  window.scrollTo(0, 0);
}

function renderPanel() {
  panelInner.innerHTML = '';
  if (state.view === 'tasks') {
    renderTaskChooser();
  } else if (state.view === 'kitchen') {
    renderKitchen();
  } else if (state.view === 'add') {
    renderAddForm();
  } else if (state.view === 'detail' && findBreakfast(state.selectedId)) {
    renderDetail();
  } else if (state.view === 'results') {
    renderResults();
  }
}

function backButton(label, onClick) {
  const back = el('button', 'back-btn', label);
  back.type = 'button';
  back.prepend(document.createTextNode('← '));
  back.addEventListener('click', onClick);
  return back;
}

function renderEmpty(title, body) {
  const empty = el('div', 'empty-state');
  empty.appendChild(el('strong', '', title));
  empty.appendChild(document.createTextNode(body));
  panelInner.appendChild(empty);
}

// ---------- Home: filters and time ----------
showBtn.addEventListener('click', () => {
  if (state.minutes === null) state.minutes = ANY_TIME;
  resetPaging();
  hideToast();
  showScreen('results');
});

// "My kitchen" is its own card, not a filter: it opens the screen where you say what you have.
// The switch under it is one on/off setting ("only show what my kitchen can make"), so it is a
// switch and not one of the filter chips.
function renderKitchenBox() {
  const count = countItems(state.have);
  kitchenCountEl.textContent =
    count === 0 ? 'What do you have?' : `${count} ${count === 1 ? 'item' : 'items'} \u00b7 tap to change`;
  kitchenSwitchEl.setAttribute('aria-checked', String(state.useKitchen));
  kitchenSwitchEl.classList.toggle('on', state.useKitchen);
}

kitchenCardEl.addEventListener('click', () => showScreen('kitchen'));

kitchenSwitchEl.addEventListener('click', () => {
  if (countItems(state.have) === 0) {
    showScreen('kitchen'); // nothing to filter by yet: say what you have first
    return;
  }
  state.useKitchen = !state.useKitchen;
  persistKitchen();
  renderKitchenBox();
});

function setStrictSeasonings(value) {
  state.strictSeasonings = value;
  persistKitchen();
  if (state.view === 'results') renderResults();
}

function persistFavorites() {
  saveFavorites(state.favorites);
}

function persistKitchen() {
  saveKitchen({
    have: state.have,
    useKitchen: state.useKitchen,
    strictSeasonings: state.strictSeasonings,
    almostOpen: state.almostOpen,
  });
}

function renderTagChips() {
  tagChipsEl.innerHTML = '';

  TAG_OPTIONS.forEach((tag) => {
    const active = state.tags.includes(tag.id);
    const chip = el('button', 'chip' + (active ? ' active' : ''), tag.label);
    chip.type = 'button';
    chip.setAttribute('aria-pressed', String(active));
    chip.addEventListener('click', () => {
      state.tags = toggleTag(state.tags, tag.id);
      renderTagChips();
    });
    tagChipsEl.appendChild(chip);
  });
}

// The Favorites chip sits at the very top of the home screen.
function renderFavoritesChip() {
  favoritesChipsEl.innerHTML = '';
  const chip = el(
    'button',
    'chip favorites-chip' + (state.onlyFavorites ? ' active' : ''),
    `\u2665 Favorites (${state.favorites.length})`
  );
  chip.type = 'button';
  chip.setAttribute('aria-pressed', String(state.onlyFavorites));
  chip.addEventListener('click', () => {
    state.onlyFavorites = !state.onlyFavorites;
    renderFavoritesChip();
  });
  favoritesChipsEl.appendChild(chip);
}

surpriseBtn.addEventListener('click', () => {
  const limit = state.minutes ?? ANY_TIME;
  const pool = allBreakfasts().filter((b) => fitsChoices(b, limit));
  if (pool.length === 0) {
    state.minutes = limit;
    resetPaging();
    hideToast();
    showScreen('results');
    return;
  }
  const pick = pool[Math.floor(Math.random() * pool.length)];
  state.selectedId = pick.id;
  state.stepsDone = {};
  hideToast();
  state.returnTo = 'home';
  showScreen('detail');
});

addBtnHome.addEventListener('click', () => openAddForm('home'));

// ---------- Results: one page at a time ----------
function fitsTimeAndTags(breakfast, maxMinutes) {
  return matchesFilters(breakfast, maxMinutes, state.tags, state.onlyFavorites ? state.favorites : null);
}

// Time and tags, plus the kitchen when "Only what I have" is on.
function fitsChoices(breakfast, maxMinutes) {
  return (
    fitsTimeAndTags(breakfast, maxMinutes) &&
    (!state.useKitchen || canMake(breakfast, state.have, state.strictSeasonings))
  );
}

// The student's own breakfasts come first (newest first), then the built-in ones by time.
function ordered(fits) {
  const own = state.customBreakfasts.filter(fits).reverse();
  const builtIn = builtInBreakfasts.filter(fits).sort((a, b) => a.minutes - b.minutes);
  return [...own, ...builtIn];
}

function matchingBreakfasts() {
  return ordered((b) => fitsChoices(b, state.minutes));
}

// With "Only what I have" on: breakfasts missing exactly one ingredient, as { breakfast, missing }.
function almostBreakfasts() {
  if (!state.useKitchen || countItems(state.have) === 0) return [];
  const missingById = new Map();
  const fits = (b) => {
    if (!fitsTimeAndTags(b, state.minutes)) return false;
    const missing = missingNeeds(b, state.have, state.strictSeasonings);
    if (missing.length !== 1) return false;
    missingById.set(b.id, missing[0]);
    return true;
  };
  return ordered(fits).map((breakfast) => ({ breakfast, missing: missingById.get(breakfast.id) }));
}

function filterSummary(count, almostCount = 0) {
  const noun = count === 1 ? 'breakfast' : 'breakfasts';
  const time = state.minutes === ANY_TIME ? 'any time' : `up to ${state.minutes} min`;
  const kitchen = state.useKitchen
    ? [state.strictSeasonings ? 'from your kitchen, with cooking basics' : 'from your kitchen']
    : [];
  const favorites = state.onlyFavorites ? ['favorites'] : [];
  const almost = almostCount > 0 ? [`${almostCount} almost`] : [];
  return [`${count} ${noun}`, time, ...kitchen, ...favorites, ...state.tags.map(tagLabel), ...almost].join(' \u00b7 ');
}

const MIN_ROWS_PER_PAGE = 1;
const MAX_ROWS_PER_PAGE = 8;

function resetPaging() {
  state.offset = 0;
  state.offsetHistory = [];
}

function pageOverflows() {
  return document.documentElement.scrollHeight > window.innerHeight + 1;
}

// Draws the results screen. Row heights vary (long names wrap), so start with the most rows
// and remove rows until the page no longer needs scrolling.
function renderResults() {
  const matches = matchingBreakfasts();
  const almost = almostBreakfasts();
  // The "almost" breakfasts are only part of the list while that section is unfolded.
  const entries = [...matches.map((breakfast) => ({ breakfast })), ...(state.almostOpen ? almost : [])];
  let rowCount = MAX_ROWS_PER_PAGE;
  drawResults(entries, matches.length, almost.length, rowCount);
  while (pageOverflows() && rowCount > MIN_ROWS_PER_PAGE) {
    rowCount -= 1;
    drawResults(entries, matches.length, almost.length, rowCount);
  }
}

// `entries` are the breakfasts you can make, then (if unfolded) the "almost" ones with `missing`.
function drawResults(entries, makeableCount, almostCount, rowCount) {
  panelInner.innerHTML = '';
  panelInner.appendChild(
    backButton('Change choices', () => {
      hideToast();
      showScreen('home');
    })
  );

  if (state.useKitchen) panelInner.appendChild(buildKitchenSummary());
  panelInner.appendChild(buildMinutesPicker());
  panelInner.appendChild(el('div', 'results-summary', filterSummary(makeableCount, almostCount)));

  if (makeableCount === 0 && almostCount === 0) {
    renderEmpty(
      state.onlyFavorites && state.favorites.length === 0 ? 'No favorites yet.' : 'No match.',
      state.onlyFavorites && state.favorites.length === 0
        ? 'Tap \u2665 on a breakfast to save it here.'
        : state.useKitchen
        ? 'You can\u2019t make anything yet. Add more food in My kitchen.'
        : 'Try more minutes or fewer filters.'
    );
    const more = el(
      'button',
      'add-btn',
      state.useKitchen ? 'Change My kitchen' : '+ Add your own breakfast'
    );
    more.type = 'button';
    more.addEventListener('click', () => (state.useKitchen ? showScreen('kitchen') : openAddForm('results')));
    if (state.onlyFavorites) panelInner.appendChild(buildShowAllButton());
    panelInner.appendChild(more);
    return;
  }

  const list = el('div', 'idea-list');

  if (entries.length === 0) {
    // Folded, and nothing can be made yet: only the "Almost there" bar is left to show.
    renderEmpty('You can\u2019t make any yet.', 'Open \u201cAlmost there\u201d to see more.');
    list.appendChild(buildAlmostBar(almostCount));
    panelInner.appendChild(list);
    return;
  }

  state.offset = Math.min(state.offset, entries.length - 1);
  const visible = entries.slice(state.offset, state.offset + rowCount);

  visible.forEach((entry, index) => {
    // When unfolded, the bar goes before the first almost breakfast on the page.
    if (entry.missing && !(index > 0 && visible[index - 1].missing)) {
      list.appendChild(buildAlmostBar(almostCount));
    }
    list.appendChild(buildResultRow(entry.breakfast, entry.missing));
  });
  // When folded, the bar comes after the last breakfast you can make.
  if (!state.almostOpen && almostCount > 0 && state.offset + visible.length >= entries.length) {
    list.appendChild(buildAlmostBar(almostCount));
  }
  panelInner.appendChild(list);

  const canGoBack = state.offsetHistory.length > 0;
  const canGoForward = state.offset + visible.length < entries.length;
  if (canGoBack || canGoForward) {
    panelInner.appendChild(buildPager(entries.length, visible.length, canGoBack, canGoForward));
  }
}

// Turns the Favorites filter off, for when it is hiding everything.
function buildShowAllButton() {
  const button = el('button', 'add-btn show-all-btn', 'Show all breakfasts');
  button.type = 'button';
  button.addEventListener('click', () => {
    state.onlyFavorites = false;
    resetPaging();
    renderResults();
  });
  return button;
}

// The bar that folds and unfolds the "almost" breakfasts.
function buildAlmostBar(almostCount) {
  const bar = el('button', 'almost-bar');
  bar.type = 'button';
  bar.setAttribute('aria-expanded', String(state.almostOpen));

  const text = el('span', 'almost-bar-text');
  text.appendChild(el('strong', '', `Almost there (${almostCount})`));
  text.appendChild(
    el('span', '', `1 thing missing \u00b7 tap to ${state.almostOpen ? 'hide' : 'show'}`)
  );

  const arrow = el('span', 'almost-arrow');
  arrow.innerHTML =
    '<svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 6L8 11L13 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  bar.append(text, arrow);
  bar.addEventListener('click', toggleAlmost);
  return bar;
}

function toggleAlmost() {
  state.almostOpen = !state.almostOpen;
  persistKitchen();
  if (state.almostOpen) {
    showAlmostSection();
  } else {
    showLastPage(); // folding takes you back to where the bar sits, after the last breakfast you can make
  }
}

// After unfolding, moves forward until the page that shows the bar and the first almost breakfasts.
function showAlmostSection() {
  renderResults();
  while (!panelInner.querySelector('.almost-bar') && visibleRowCount() > 0) {
    if (state.offset + visibleRowCount() >= currentEntryCount()) break;
    goToNextPage(visibleRowCount());
  }
}

// Goes to the last page of the current list.
function showLastPage() {
  resetPaging();
  renderResults();
  while (visibleRowCount() > 0 && state.offset + visibleRowCount() < currentEntryCount()) {
    goToNextPage(visibleRowCount());
  }
}

function visibleRowCount() {
  return panelInner.querySelectorAll('.idea-row').length;
}

function currentEntryCount() {
  return matchingBreakfasts().length + (state.almostOpen ? almostBreakfasts().length : 0);
}

// How much time the student has. It lives on the results page and narrows the list right away.
function buildMinutesPicker() {
  const wrap = el('div', 'minutes-picker');
  const label = el('div', 'minutes-label', 'Up to\nminutes');
  label.setAttribute('aria-hidden', 'true'); // the group below carries the same words for screen readers
  wrap.appendChild(label);
  const row = el('div', 'chips minutes-chips');
  row.setAttribute('role', 'group');
  row.setAttribute('aria-label', 'Up to how many minutes');
  MINUTE_CHOICES.forEach(({ minutes, label }) => {
    const active = state.minutes === minutes;
    const chip = el('button', 'chip' + (active ? ' active' : ''), label);
    chip.type = 'button';
    chip.setAttribute('aria-pressed', String(active));
    chip.setAttribute('aria-label', minutes === ANY_TIME ? 'Any amount of time' : `${minutes} minutes`);
    chip.addEventListener('click', () => {
      state.minutes = minutes;
      resetPaging();
      renderResults();
    });
    row.appendChild(chip);
  });
  wrap.appendChild(row);
  return wrap;
}

// Shows what the student ticked, so they can check it and fix a wrong tick.
function buildKitchenSummary() {
  const box = el('div', 'kitchen-summary');

  const text = el('div', 'kitchen-summary-text');
  text.appendChild(el('strong', '', 'Your kitchen: '));
  text.appendChild(document.createTextNode(haveLabels(state.have).join(', ') || 'nothing yet'));

  const change = el('button', 'link-btn', 'Change');
  change.type = 'button';
  change.addEventListener('click', () => showScreen('kitchen'));

  box.append(text, change);
  return box;
}

function buildResultRow(b, missing) {
  const item = el('div', 'idea-item');
  const row = el('button', 'idea-row' + (b.custom ? ' custom' : '') + (missing ? ' almost' : ''));
  row.type = 'button';

  const mark = el('span', 'idea-mark');
  mark.style.background = b.accent;
  mark.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="6" fill="white" opacity="0.9"/></svg>';

  const text = el('span', 'idea-text');
  const nameLine = el('div', 'idea-name', b.name);
  if (b.custom) nameLine.appendChild(el('span', 'badge', 'Yours'));
  text.appendChild(nameLine);
  const details = [`${b.minutes} min`, ...(b.tags || []).map(tagLabel)];
  text.appendChild(el('div', 'idea-time', details.join(' · ')));
  if (missing) text.appendChild(el('div', 'missing-note', `Missing: ${missing}`));

  const chev = el('span', 'chev');
  chev.innerHTML =
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="#231A2E" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  row.append(mark, text, chev);
  row.addEventListener('click', () => {
    state.selectedId = b.id;
    state.stepsDone = {};
    hideToast();
    state.returnTo = 'results';
    showScreen('detail');
  });
  item.append(row, buildHeartButton(b, 'in-list'));
  return item;
}

// The heart that adds or removes a favorite. Used in the list and on a breakfast's page.
function buildHeartButton(b, where) {
  const button = el('button', `heart-btn ${where}`);
  button.type = 'button';
  button.innerHTML =
    '<svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 2.8 4.8 6.2 4.8c2.1 0 3.6 1.1 4.4 2.5.4.6.8.6 1.2 0 .8-1.4 2.3-2.5 4.4-2.5 3.4 0 5.3 3.5 3.8 6.9C19.5 16.4 12 21 12 21Z" stroke-width="1.9" stroke-linejoin="round"/></svg>';

  function refresh() {
    const on = state.favorites.includes(b.id);
    button.classList.toggle('on', on);
    button.setAttribute('aria-pressed', String(on));
    button.setAttribute('aria-label', on ? `Remove ${b.name} from favorites` : `Add ${b.name} to favorites`);
  }

  button.addEventListener('click', () => {
    state.favorites = toggleFavorite(state.favorites, b.id);
    persistFavorites();
    const on = state.favorites.includes(b.id);
    showToast(on ? 'Saved' : 'Removed');
    refresh();
    // With the Favorites filter on, a breakfast you just un-hearted leaves the list.
    if (!on && state.onlyFavorites && state.view === 'results') renderResults();
  });

  refresh();
  return button;
}

function buildPager(total, shownCount, canGoBack, canGoForward) {
  const pager = el('div', 'pager');

  const first = state.offset + 1;
  const last = state.offset + shownCount;
  const status = el('div', 'pager-status', `Showing ${first}\u2013${last} of ${total}`);
  status.setAttribute('role', 'status');

  const buttons = el('div', 'pager-buttons');

  const previous = el('button', 'pager-btn', '\u2190 Previous');
  previous.type = 'button';
  previous.disabled = !canGoBack;
  previous.addEventListener('click', () => {
    hideToast();
    state.offset = state.offsetHistory.pop() ?? 0;
    renderResults();
  });

  const next = el('button', 'pager-btn', 'Next \u2192');
  next.type = 'button';
  next.disabled = !canGoForward;
  next.addEventListener('click', () => {
    hideToast();
    goToNextPage(shownCount);
  });

  buttons.append(previous, next);
  pager.append(status, buttons);
  return pager;
}

function goToNextPage(shownCount) {
  state.offsetHistory.push(state.offset);
  state.offset += shownCount;
  renderResults();
}

window.addEventListener('resize', () => {
  if (state.view === 'results') renderPanel();
});

// ---------- Kitchen: what the student has ----------
function toggleHave(id) {
  const isOn = state.have.includes(id);
  const itemId = itemIdOfKind(id);
  if (isOn) {
    // Unticking an item also unticks its kinds.
    state.have = state.have.filter((other) => other !== id && !kindIdsOf(id).includes(other));
  } else {
    // Ticking a kind also ticks its item.
    const parent = itemId && !state.have.includes(itemId) ? [itemId] : [];
    state.have = [...state.have, ...parent, id];
  }
  persistKitchen();
}

function renderKitchen() {
  panelInner.appendChild(backButton('Back', () => showScreen('home')));
  panelInner.appendChild(el('div', 'detail-title', 'What\u2019s in your kitchen?'));
  panelInner.appendChild(buildSay('Tap what you have.', 'Water is counted.'));

  INGREDIENT_GROUPS.forEach((group) => {
    const section = buildGroupSection(group);
    const chips = el('div', 'chips ingredient-chips');
    group.items.forEach((item) => chips.appendChild(buildKitchenItem(item)));
    section.appendChild(chips);
    panelInner.appendChild(section);
  });

  const actions = el('div', 'kitchen-actions');
  const count = el('div', 'kitchen-count');
  count.id = 'kitchenCount';
  count.setAttribute('role', 'status');
  const actionButtons = el('div', 'form-actions');
  const clear = el('button', 'timer-btn ghost', 'Clear all');
  clear.type = 'button';
  clear.id = 'kitchenClear';
  clear.addEventListener('click', () => {
    state.have = [];
    state.useKitchen = false;
    persistKitchen();
    renderPanel();
  });
  const show = el('button', 'timer-btn');
  show.type = 'button';
  show.id = 'kitchenShow';
  show.addEventListener('click', () => {
    state.useKitchen = true;
    persistKitchen();
    if (state.minutes === null) state.minutes = ANY_TIME;
    resetPaging();
    showScreen('results');
  });
  actionButtons.append(clear, show);
  actions.append(count, actionButtons);
  panelInner.appendChild(actions);
  updateKitchenActions();
}

// A group's heading. The cooking basics get their own color and a kind note.
function buildGroupSection(group) {
  const section = el('div', 'ingredient-group' + (group.basics ? ' basics' : ''));
  section.appendChild(el('div', 'ingredient-group-title', group.title));
  if (group.note) section.appendChild(el('div', 'ingredient-group-note', group.note));
  return section;
}

// One ingredient chip. An item with kinds shows a row of kinds under it once it is ticked.
function buildKitchenItem(item) {
  const wrap = el('div', 'kitchen-item');
  const chip = el('button', 'chip', item.label);
  chip.type = 'button';
  wrap.appendChild(chip);

  let kindsRow = null;
  const kindChips = [];
  if (item.kinds) {
    kindsRow = el('div', 'kinds-row');
    kindsRow.appendChild(el('div', 'kinds-label', `Which kind of ${item.label.toLowerCase()}? (optional)`));
    const kindsChips = el('div', 'chips');
    item.kinds.forEach((kind) => {
      const kindChip = el('button', 'chip small-chip', kind.label);
      kindChip.type = 'button';
      kindChip.addEventListener('click', () => {
        toggleHave(kind.id);
        refresh();
        updateKitchenActions();
      });
      kindChips.push({ id: kind.id, node: kindChip });
      kindsChips.appendChild(kindChip);
    });
    kindsRow.appendChild(kindsChips);
    wrap.appendChild(kindsRow);
  }

  function refresh() {
    const on = state.have.includes(item.id);
    chip.classList.toggle('active', on);
    chip.setAttribute('aria-pressed', String(on));
    if (kindsRow) kindsRow.hidden = !on;
    kindChips.forEach(({ id, node }) => {
      const kindOn = state.have.includes(id);
      node.classList.toggle('active', kindOn);
      node.setAttribute('aria-pressed', String(kindOn));
    });
  }

  chip.addEventListener('click', () => {
    toggleHave(item.id);
    refresh();
    updateKitchenActions();
  });
  refresh();
  return wrap;
}

function updateKitchenActions() {
  const show = document.getElementById('kitchenShow');
  const clear = document.getElementById('kitchenClear');
  if (!show || !clear) return;
  const count = countItems(state.have);
  show.disabled = count === 0;
  show.textContent = count === 0 ? 'Tap what you have' : 'Show what I can make';
  clear.disabled = count === 0;
  document.getElementById('kitchenCount').textContent =
    count === 0 ? 'Nothing yet' : `${count} ${count === 1 ? 'item' : 'items'} ticked`;
}

// ---------- Add form ----------
function openAddForm(returnTo) {
  state.formErrors = {};
  state.formValues = { name: '', minutes: '', stepsText: '', tags: [], needs: [] };
  hideToast();
  state.returnTo = returnTo;
  showScreen('add');
}

function renderAddForm() {
  panelInner.appendChild(backButton('Back', () => showScreen(state.returnTo)));
  panelInner.appendChild(el('div', 'detail-title', 'Add your own breakfast'));
  panelInner.appendChild(el('div', 'detail-sub', 'It is saved on this device.'));

  const form = el('form', 'add-form');
  form.noValidate = true;

  const nameInput = el('input');
  nameInput.id = 'fieldName';
  nameInput.type = 'text';
  nameInput.maxLength = 80;
  nameInput.value = state.formValues.name;
  nameInput.placeholder = 'e.g. Leftover pasta omelet';

  const minutesInput = el('input');
  minutesInput.id = 'fieldMinutes';
  minutesInput.type = 'number';
  minutesInput.min = '1';
  minutesInput.max = String(MAX_MINUTES);
  minutesInput.inputMode = 'numeric';
  minutesInput.value = state.formValues.minutes;
  minutesInput.placeholder = 'e.g. 10';

  const stepsInput = el('textarea');
  stepsInput.id = 'fieldSteps';
  stepsInput.rows = 5;
  stepsInput.value = state.formValues.stepsText;
  stepsInput.placeholder = 'One step per line';

  form.appendChild(formField('Name', nameInput, state.formErrors.name));
  form.appendChild(formField('Minutes', minutesInput, state.formErrors.minutes));
  form.appendChild(formField('Steps', stepsInput, state.formErrors.steps));
  form.appendChild(buildTagPicker());
  form.appendChild(buildIngredientPicker());

  const actions = el('div', 'form-actions');
  const later = el('button', 'timer-btn ghost', 'Save for later');
  later.type = 'submit';
  later.dataset.action = 'later';
  const eatNow = el('button', 'timer-btn', 'Save and eat now');
  eatNow.type = 'submit';
  eatNow.dataset.action = 'eat';
  actions.append(later, eatNow);
  form.appendChild(actions);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    state.formValues = {
      name: nameInput.value,
      minutes: minutesInput.value,
      stepsText: stepsInput.value,
      tags: state.formValues.tags,
      needs: state.formValues.needs,
    };
    const { errors, breakfast } = buildBreakfast(state.formValues, state.customBreakfasts.length);
    state.formErrors = errors;
    if (!breakfast) {
      renderPanel();
      return;
    }
    const updated = [...state.customBreakfasts, breakfast];
    const saved = saveCustomBreakfasts(updated);
    state.customBreakfasts = updated;
    const action = event.submitter?.dataset.action ?? 'eat';
    showNewBreakfast(breakfast, saved, action);
  });

  panelInner.appendChild(form);
}

// Checkboxes for the tags. The choice is kept in state.formValues.tags so a failed save does not lose it.
function buildTagPicker() {
  const group = el('fieldset', 'field tag-picker');
  group.appendChild(el('legend', '', 'Tags (optional)'));
  TAG_OPTIONS.forEach((tag) => {
    const label = el('label', 'tag-option');
    const box = el('input');
    box.type = 'checkbox';
    box.checked = state.formValues.tags.includes(tag.id);
    box.addEventListener('change', () => {
      state.formValues.tags = toggleTag(state.formValues.tags, tag.id);
      group.querySelectorAll('input').forEach((other, i) => {
        other.checked = state.formValues.tags.includes(TAG_OPTIONS[i].id);
      });
    });
    label.append(box, document.createTextNode(` ${tag.label}`));
    group.appendChild(label);
  });
  return group;
}

// Which ingredients the breakfast uses, so it can match "Only what I have". Collapsed to save space.
function buildIngredientPicker() {
  const details = el('details', 'field ingredient-picker');
  details.appendChild(el('summary', '', 'Food it uses (optional)'));
  details.appendChild(buildSay('Tick what it uses.', 'Then it shows with \u201cOnly what I have\u201d.'));
  INGREDIENT_GROUPS.forEach((group) => {
    const section = buildGroupSection(group);
    details.appendChild(section);
    const chips = el('div', 'chips ingredient-chips');
    group.items.forEach((item) => {
      const isOn = state.formValues.needs.includes(item.id);
      const chip = el('button', 'chip' + (isOn ? ' active' : ''), item.label);
      chip.type = 'button';
      chip.setAttribute('aria-pressed', String(isOn));
      chip.addEventListener('click', () => {
        const needs = state.formValues.needs;
        state.formValues.needs = needs.includes(item.id)
          ? needs.filter((id) => id !== item.id)
          : [...needs, item.id];
        const active = state.formValues.needs.includes(item.id);
        chip.classList.toggle('active', active);
        chip.setAttribute('aria-pressed', String(active));
      });
      chips.appendChild(chip);
    });
    section.appendChild(chips);
  });
  return details;
}

function formField(labelText, input, errorText) {
  const wrap = el('div', 'field');
  const label = el('label', '', labelText);
  label.htmlFor = input.id;
  wrap.append(label, input);
  if (errorText) {
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', `${input.id}Error`);
    const error = el('div', 'field-error', errorText);
    error.id = `${input.id}Error`;
    wrap.appendChild(error);
  }
  return wrap;
}

// After saving, either open the new breakfast's steps and timer ("eat") or return to the
// full list ("later"), where it is the first row.
function showNewBreakfast(breakfast, saved, action) {
  state.minutes = ANY_TIME;
  state.tags = [];
  renderTagChips();
  resetPaging();
  state.stepsDone = {};
  state.returnTo = 'results';

  if (action === 'later') {
    showToast(
      saved
        ? `Saved "${breakfast.name}"`
        : 'Not saved. It will be lost if you reload.',
      !saved
    );
    showScreen('results');
    return;
  }

  state.selectedId = breakfast.id;
  showToast(
    saved
      ? `Saved "${breakfast.name}"`
      : 'Not saved. It will be lost if you reload.',
    !saved
  );
  showScreen('detail');
}

// ---------- Breakfast detail with timer ----------
function renderDetail() {
  const b = findBreakfast(state.selectedId);

  const backLabel = state.returnTo === 'results' ? 'All matching breakfasts' : 'Change choices';
  panelInner.appendChild(
    backButton(backLabel, () => {
      hideToast();
      showScreen(state.returnTo);
    })
  );

  const head = el('div', 'detail-head');
  head.append(el('div', 'detail-title', b.name), buildHeartButton(b, 'in-detail'));
  panelInner.appendChild(head);
  panelInner.appendChild(
    el('div', 'detail-sub', `${b.minutes} minute${b.minutes === 1 ? '' : 's'}`)
  );

  const needsBox = buildNeedsBox(b);
  if (needsBox) panelInner.appendChild(needsBox);

  const ul = el('ul', 'steps');
  b.steps.forEach((stepText, i) => {
    const li = el('li', 'step' + (state.stepsDone[i] ? ' done' : ''));
    const split = splitStep(stepText);
    const cue = stepCueFor(stepCues, b.id, i, split.text, split.mainEnd);
    const words = el('span', 'step-text');
    appendStepWords(words, split, cue.marks);
    const time = stepTime(split.text);
    if (time) words.appendChild(el('span', 'step-time', `\u23F1\uFE0F ${time}`));
    words.appendChild(buildStepMediaRow(b, i, split.text));
    const picture = el('button', 'step-icon step-icon-btn' + (cue.custom ? ' mine' : ''), cue.icon);
    picture.type = 'button';
    picture.setAttribute('aria-label', `Change the picture and highlighted words for step ${i + 1}`);
    picture.addEventListener('click', (event) => {
      event.stopPropagation(); // changing the picture must not tick the step
      askToEditStep(b, i);
    });
    li.append(el('span', 'step-num'), picture, words);
    li.addEventListener('click', () => {
      state.stepsDone[i] = !state.stepsDone[i];
      redrawDetail();
    });
    ul.appendChild(li);
  });
  panelInner.appendChild(ul);

  panelInner.appendChild(buildTimerBox(b));

  if (b.custom) {
    const del = el('button', 'delete-btn', 'Delete this breakfast');
    del.type = 'button';
    del.addEventListener('click', () => askToDelete(b));
    panelInner.appendChild(del);
  }

  updateTimerDisplay();
}

// "What you'll need": ingredients and seasonings, with a tick for what the student has.
// Collapsed so the steps and timer stay high on the screen.
const BASICS_TITLE = 'Salt, oil and more';

function buildNeedsBox(b) {
  const ingredients = describeNeeds(b.needs, state.have);
  const seasonings = describeNeeds(b.extras, state.have);
  if (ingredients.length + seasonings.length === 0) return null;

  const knowsKitchen = countItems(state.have) > 0;
  const missing = [...ingredients, ...seasonings].filter((need) => !need.have).length;
  const hint = knowsKitchen && missing > 0 ? ` \u00b7 ${missing} missing` : '';

  const box = el('details', 'needs-box');
  box.appendChild(el('summary', '', `What you\u2019ll need (${ingredients.length + seasonings.length})${hint}`));

  [
    ['Ingredients', ingredients],
    [BASICS_TITLE, seasonings],
  ].forEach(([title, list]) => {
    if (list.length === 0) return;
    box.appendChild(el('div', 'needs-title', title));
    const ul = el('ul', 'needs-list' + (title === BASICS_TITLE ? ' basics' : ''));
    list.forEach((need) => {
      const mark = !knowsKitchen ? '' : need.have ? '\u2713 ' : '\u2717 ';
      const suffix = knowsKitchen && !need.have ? ' (missing)' : '';
      ul.appendChild(el('li', need.have || !knowsKitchen ? '' : 'missing', `${mark}${need.label}${suffix}`));
    });
    box.appendChild(ul);
  });
  return box;
}

function redrawDetail() {
  panelInner.innerHTML = '';
  renderDetail();
}

function buildTimerBox(b) {
  const box = el('div', 'timer-box');
  const clock = el('div', 'timer-clock');
  clock.id = 'timerClock';
  const track = el('div', 'timer-track');
  const fill = el('div', 'timer-fill');
  fill.id = 'timerFill';
  track.appendChild(fill);
  box.append(clock, track);

  if (state.timerRemaining <= 0 && state.timerTotal > 0 && !state.timerRunning) {
    box.appendChild(el('div', 'timer-done', 'Time is up. Eat!'));
    return box;
  }

  const label = state.timerRunning
    ? 'Pause'
    : state.timerTotal > 0
      ? 'Resume'
      : `Start ${b.minutes}-minute timer`;
  const startBtn = el('button', 'timer-btn', label);
  startBtn.type = 'button';
  startBtn.addEventListener('click', () => {
    if (state.timerRunning) pauseTimer();
    else startTimer(b.minutes);
    redrawDetail();
  });
  box.appendChild(startBtn);

  if (state.timerTotal > 0) {
    const resetBtn = el('button', 'timer-btn ghost', 'Reset');
    resetBtn.type = 'button';
    resetBtn.addEventListener('click', () => {
      stopTimer();
      redrawDetail();
    });
    box.appendChild(resetBtn);
  }
  return box;
}

function deleteCustomBreakfast(breakfast) {
  state.customBreakfasts = state.customBreakfasts.filter((b) => b.id !== breakfast.id);
  state.favorites = state.favorites.filter((id) => id !== breakfast.id);
  persistFavorites();
  stepCues = removeBreakfastCues(stepCues, breakfast.id);
  saveStepCues(stepCues);
  stepMedia = removeBreakfastMedia(stepMedia, breakfast.id);
  saveStepMedia(stepMedia);
  const saved = saveCustomBreakfasts(state.customBreakfasts);
  state.selectedId = null;
  resetPaging();
  showToast(
    saved
      ? `Deleted "${breakfast.name}".`
      : 'Deleted. It may come back if you reload.',
    !saved
  );
  if (state.minutes === null) state.minutes = ANY_TIME;
  showScreen('results');
}

// ---------- Small windows inside the page ----------
// (Browsers can block their built-in popups, so these are drawn by the page.)
// Escape or tapping outside closes the window. Returns a function that closes it.
function showModal(dialog, focusNode) {
  const backdrop = el('div', 'modal-backdrop');
  backdrop.appendChild(dialog);

  function close() {
    document.removeEventListener('keydown', onKeyDown);
    backdrop.remove();
  }
  function onKeyDown(event) {
    if (event.key === 'Escape') close();
  }

  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) close();
  });
  document.addEventListener('keydown', onKeyDown);
  document.body.appendChild(backdrop);
  focusNode.focus();
  return close;
}

function newDialog(titleText, labelId) {
  const dialog = el('div', 'modal');
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', labelId);
  const title = el('div', 'modal-title', titleText);
  title.id = labelId;
  dialog.appendChild(title);
  return dialog;
}

// Cancel is on the left and Delete on the right.
function askToDelete(breakfast) {
  const dialog = newDialog(`Delete "${breakfast.name}"?`, 'deleteTitle');
  dialog.appendChild(el('div', 'modal-body', 'You cannot undo this.'));

  const buttons = el('div', 'modal-buttons');
  const cancel = el('button', 'timer-btn ghost', 'Cancel');
  cancel.type = 'button';
  const confirm = el('button', 'timer-btn danger', 'Delete');
  confirm.type = 'button';
  buttons.append(cancel, confirm);
  dialog.appendChild(buttons);

  const close = showModal(dialog, cancel);
  cancel.addEventListener('click', close);
  confirm.addEventListener('click', () => {
    close();
    deleteCustomBreakfast(breakfast);
  });
}

// The settings window, opened from the gear at the top right.
function openSettings() {
  const dialog = newDialog('Settings', 'settingsTitle');
  dialog.appendChild(el('div', 'settings-heading', 'Cooking basics'));
  dialog.appendChild(buildSay('If you did not tick one:', 'Salt, oil, sugar and more.'));

  const choices = [
    [false, 'Optional', 'Still show it.'],
    [true, 'Required', 'Hide it.'],
  ];
  const buttons = choices.map(([strict, name, detail]) => {
    const button = el('button', 'settings-option');
    button.type = 'button';
    button.append(el('strong', '', name), el('span', '', detail));
    button.addEventListener('click', () => {
      setStrictSeasonings(strict);
      refresh();
    });
    dialog.appendChild(button);
    return { strict, button };
  });

  function refresh() {
    buttons.forEach(({ strict, button }) => {
      const on = state.strictSeasonings === strict;
      button.classList.toggle('active', on);
      button.setAttribute('aria-pressed', String(on));
    });
  }
  refresh();

  const done = el('button', 'timer-btn settings-done', 'Done');
  done.type = 'button';
  dialog.appendChild(done);

  const close = showModal(dialog, done);
  done.addEventListener('click', close);
}

document.querySelectorAll('.settings-btn').forEach((button) => {
  button.addEventListener('click', openSettings);
});

// ---------- Timer ----------
function startTimer(minutes) {
  if (state.timerTotal === 0) {
    state.timerTotal = minutes * 60;
    state.timerRemaining = minutes * 60;
  }
  state.timerRunning = true;
  clearInterval(state.interval);
  state.interval = setInterval(() => {
    state.timerRemaining -= 1;
    if (state.timerRemaining <= 0) {
      state.timerRemaining = 0;
      state.timerRunning = false;
      clearInterval(state.interval);
      redrawDetail();
      return;
    }
    updateTimerDisplay();
  }, 1000);
}

function pauseTimer() {
  state.timerRunning = false;
  clearInterval(state.interval);
}

function stopTimer() {
  state.timerRunning = false;
  state.timerRemaining = 0;
  state.timerTotal = 0;
  clearInterval(state.interval);
}

function updateTimerDisplay() {
  const clock = document.getElementById('timerClock');
  const fill = document.getElementById('timerFill');
  if (!clock || !fill) return;
  const selected = findBreakfast(state.selectedId);
  const remaining = state.timerTotal > 0 ? state.timerRemaining : selected ? selected.minutes * 60 : 0;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  clock.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  const percent = state.timerTotal > 0 ? 100 - (state.timerRemaining / state.timerTotal) * 100 : 0;
  fill.style.width = `${percent}%`;
}

// ---------- Choosing the Set up tonight tasks ----------
// Turns "Set out a **bowl** or jar" into words with the key word in <strong>, without using innerHTML.
function richText(text) {
  const fragment = document.createDocumentFragment();
  text.split('**').forEach((part, index) => {
    if (part === '') return;
    fragment.appendChild(index % 2 === 1 ? el('strong', '', part) : document.createTextNode(part));
  });
  return fragment;
}

// A small picture that goes with the words. It never carries the meaning alone, so screen readers skip it.
function taskIcon(icon) {
  const node = el('span', 'task-icon', icon);
  node.setAttribute('aria-hidden', 'true');
  return node;
}

// An instruction in two levels: the one important thing big, and a less important extra small underneath.
function buildSay(main, extra) {
  const say = el('div', 'say');
  say.appendChild(el('div', 'say-main', main));
  if (extra) say.appendChild(el('div', 'say-small', extra));
  return say;
}

function savePrepChoice() {
  savePrepTasks(prepTasks, ownTasks, ownIcons);
}

function renderTaskChooser() {
  panelInner.appendChild(backButton('Back', () => showScreen('home')));
  panelInner.appendChild(el('div', 'detail-title', 'Choose tasks'));
  panelInner.appendChild(buildSay('Tap a line to add it.'));

  renderOwnTasks();

  panelInner.appendChild(el('div', 'order-heading', 'Pick from ideas'));
  prepLibrary.forEach((group) => {
    const title = el('div', 'ingredient-group-title task-group-title');
    title.append(taskIcon(group.icon), document.createTextNode(group.title));
    panelInner.appendChild(title);
    group.tasks.forEach((line) => panelInner.appendChild(buildTaskOption(line.id)));
  });

  const bar = el('div', 'kitchen-actions');
  const count = el('div', 'kitchen-count');
  count.id = 'taskCount';
  count.setAttribute('role', 'status');
  const done = el('button', 'timer-btn', 'Done');
  done.type = 'button';
  done.addEventListener('click', () => showScreen('home'));
  const buttons = el('div', 'form-actions');
  buttons.appendChild(done);
  bar.append(count, buttons);
  panelInner.appendChild(bar);
  updateTaskCount();
}

function updateTaskCount() {
  const count = document.getElementById('taskCount');
  if (count) count.textContent = prepTasks.length === 1 ? '1 task on your list' : `${prepTasks.length} tasks on your list`;
}

// One line of the library: a numbered-or-ticked box and the words. Tap to add it to, or take it off, the list.
function buildTaskOption(task) {
  const view = describeTask(task);
  const option = el('button', 'task-option');
  option.type = 'button';
  const box = el('span', 'task-box');
  const words = el('span', 'task-text');
  words.appendChild(richText(view.text));
  if (view.detail) words.appendChild(el('span', 'task-detail', view.detail));
  option.append(box, taskIcon(view.icon), words);

  function refresh() {
    const on = prepTasks.includes(task);
    option.classList.toggle('on', on);
    option.setAttribute('aria-pressed', String(on));
    box.textContent = on ? '\u2713' : '';
  }

  option.addEventListener('click', () => {
    prepTasks = toggleChecked(prepTasks, task);
    savePrepChoice();
    refresh();
    updateTaskCount();
  });
  refresh();
  return option;
}

// The student's own lines, and a box to add one. Tapping a line only puts it on or takes it off
// tonight's list; it stays saved here until its Remove button is used.
function renderOwnTasks() {
  const section = el('div', 'own-tasks');
  section.id = 'ownTasks';
  section.appendChild(el('div', 'order-heading', 'My own'));
  const hint =
    ownTasks.length > 0
      ? buildSay('Tap a line to turn it on or off.', 'Remove deletes it.')
      : buildSay('Write your own lines here.');
  section.appendChild(hint);

  ownTasks.forEach((text) => {
    const id = ownTask(text);
    const row = el('div', 'task-row');

    const option = el('button', 'task-option');
    option.type = 'button';
    const box = el('span', 'task-box');
    option.append(box, el('span', 'task-text', text));

    const picture = el('button', 'icon-pick-btn', describeTask(id, ownIcons).icon);
    picture.type = 'button';
    picture.setAttribute('aria-label', `Change the picture for ${text}`);
    picture.addEventListener('click', () =>
      askForIcon(describeTask(id, ownIcons).icon, (icon) => {
        ownIcons = { ...ownIcons, [text]: icon };
        savePrepChoice();
        picture.textContent = icon;
        showToast('Saved');
      })
    );

    function refresh() {
      const on = prepTasks.includes(id);
      option.classList.toggle('on', on);
      option.setAttribute('aria-pressed', String(on));
      box.textContent = on ? '\u2713' : '';
    }
    option.addEventListener('click', () => {
      prepTasks = toggleChecked(prepTasks, id);
      savePrepChoice();
      refresh();
      updateTaskCount();
    });
    refresh();

    const remove = el('button', 'task-remove-btn', 'Remove');
    remove.type = 'button';
    remove.setAttribute('aria-label', `Remove ${text} for good`);
    remove.addEventListener('click', () => askToRemoveOwnTask(text));

    row.append(picture, option, remove);
    section.appendChild(row);
  });

  const form = el('form', 'own-task-form');
  form.noValidate = true;
  const input = el('input');
  input.type = 'text';
  input.id = 'ownTaskInput';
  input.maxLength = MAX_TASK_LENGTH;
  input.placeholder = 'e.g. Thaw chicken';
  input.setAttribute('aria-label', 'Write your own task');
  let newIcon = DEFAULT_TASK_ICON;
  const pick = el('button', 'icon-pick-btn', newIcon);
  pick.type = 'button';
  pick.setAttribute('aria-label', 'Choose a picture for your new line');
  pick.addEventListener('click', () =>
    askForIcon(newIcon, (icon) => {
      newIcon = icon;
      pick.textContent = icon;
    })
  );
  const add = el('button', 'timer-btn', 'Add');
  add.type = 'submit';
  const error = el('div', 'field-error');
  error.id = 'ownTaskError';
  error.setAttribute('role', 'alert');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const onTheList = prepTasks.map((task) => describeTask(task).plain);
    const result = cleanCustomTask(input.value, [...onTheList, ...ownTasks]);
    if (result.error) {
      error.textContent = result.error;
      input.setAttribute('aria-invalid', 'true');
      return;
    }
    ownTasks = [...ownTasks, result.task];
    if (newIcon !== DEFAULT_TASK_ICON) ownIcons = { ...ownIcons, [result.task]: newIcon };
    prepTasks = [...prepTasks, ownTask(result.task)];
    savePrepChoice();
    redrawOwnTasks();
    updateTaskCount();
    showToast('Added');
  });

  const row = el('div', 'own-task-row');
  row.append(pick, input, add);
  form.append(row, error);
  hint.after(form);
  return panelInner.appendChild(section);
}

// A grid of pictures to tap and a box for any emoji typed from the keyboard (on a phone, the emoji
// keyboard). `onPick` gets the chosen emoji; the grid shows which one is chosen now.
function buildIconChooser(current, choices, onPick) {
  const chooser = el('div', 'icon-chooser');
  const grid = el('div', 'icon-grid');
  const buttons = new Map();
  function show(icon) {
    buttons.forEach((button, buttonIcon) => {
      button.classList.toggle('on', buttonIcon === icon);
      button.setAttribute('aria-pressed', String(buttonIcon === icon));
    });
  }
  function pick(icon) {
    show(icon);
    onPick(icon);
  }

  choices.forEach((icon) => {
    const button = el('button', 'icon-choice', icon);
    button.type = 'button';
    button.addEventListener('click', () => pick(icon));
    buttons.set(icon, button);
    grid.appendChild(button);
  });
  show(current);
  chooser.appendChild(grid);

  const form = el('form', 'icon-type-form');
  form.noValidate = true;
  const input = el('input');
  input.type = 'text';
  input.placeholder = 'Or type an emoji';
  input.setAttribute('aria-label', 'Type or paste an emoji');
  const use = el('button', 'timer-btn', 'Use it');
  use.type = 'submit';
  const error = el('div', 'field-error');
  error.setAttribute('role', 'alert');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const icon = cleanTaskIcon(input.value);
    if (!icon) {
      error.textContent = 'Not an emoji. Try again.';
      input.setAttribute('aria-invalid', 'true');
      return;
    }
    error.textContent = '';
    input.removeAttribute('aria-invalid');
    input.value = '';
    pick(icon);
  });
  const typeRow = el('div', 'own-task-row');
  typeRow.append(input, use);
  form.append(typeRow, error);
  chooser.appendChild(form);
  return chooser;
}

// A window to choose the picture for one of your own lines. `onPick` gets the chosen emoji.
function askForIcon(current, onPick) {
  const dialog = newDialog('Choose a picture', 'iconPickTitle');
  let close = () => {};
  dialog.appendChild(
    buildIconChooser(current, ICON_CHOICES, (icon) => {
      close();
      onPick(icon);
    })
  );

  const cancel = el('button', 'timer-btn ghost', 'Cancel');
  cancel.type = 'button';
  const buttons = el('div', 'modal-buttons');
  buttons.appendChild(cancel);
  dialog.appendChild(buttons);

  close = showModal(dialog, cancel);
  cancel.addEventListener('click', close);
}

// The step's words in two levels: the main part big, and the extra part (if any) small underneath.
function appendStepWords(parent, split, marks) {
  const { main, extra } = highlightSplit(split, marks);
  const addPieces = (box, pieces) =>
    pieces.forEach((piece) => box.appendChild(piece.mark ? el('strong', '', piece.text) : document.createTextNode(piece.text)));
  const big = el('span', 'step-main');
  addPieces(big, main);
  parent.appendChild(big);
  if (extra.length > 0) {
    const small = el('span', 'step-extra');
    addPieces(small, extra);
    parent.appendChild(small);
  }
}

// Under each step: its photo and video if it has them, and a small button to add or change them.
// Taps here must not tick the step.
function buildStepMediaRow(breakfast, stepNumber, text) {
  const { photo, video } = stepMediaFor(stepMedia, breakfast.id, stepNumber, text);
  const row = el('span', 'step-media');
  row.addEventListener('click', (event) => event.stopPropagation());

  // The student's own photo wins over the one that comes with the app.
  const built = photo ? null : builtInPhotoFor(stepPhotos, text);
  if (photo || built) {
    const thumb = el('button', 'media-thumb');
    thumb.type = 'button';
    thumb.setAttribute('aria-label', `Show the photo for step ${stepNumber + 1}`);
    const image = el('img');
    image.src = photo || built.file;
    image.alt = '';
    image.loading = 'lazy';
    thumb.appendChild(image);
    thumb.addEventListener('click', () => showMedia({ photo: photo || built.file, credit: built }));
    row.appendChild(thumb);
  }
  if (video) {
    const play = el('button', 'media-chip play', '\u25B6\uFE0F Video');
    play.type = 'button';
    play.addEventListener('click', () => showMedia({ video }));
    row.appendChild(play);
  }
  const edit = el('button', 'media-chip edit', photo || video ? '\u270F\uFE0F Edit' : '\uD83D\uDCF7 Photo or video');
  edit.type = 'button';
  edit.setAttribute('aria-label', `Add or change the photo and video for step ${stepNumber + 1}`);
  edit.addEventListener('click', () => askForStepMedia(breakfast, stepNumber, text));
  row.appendChild(edit);
  return row;
}

// A big view of a step's photo, or its video playing. Close is at the bottom.
function showMedia({ photo, video, credit }) {
  const dialog = newDialog(photo ? 'Photo' : 'Video', 'mediaViewTitle');
  dialog.classList.add('tall');
  if (photo) {
    const image = el('img', 'media-big');
    image.src = photo;
    image.alt = '';
    dialog.appendChild(image);
    if (credit) dialog.appendChild(buildPhotoCredit(credit));
  } else {
    const link = parseVideoLink(video);
    if (link && link.kind === 'file') {
      const player = el('video', 'media-player');
      player.src = link.src;
      player.controls = true;
      player.playsInline = true;
      dialog.appendChild(player);
    } else if (link) {
      const frame = el('iframe', 'media-player');
      frame.src = link.src;
      frame.title = 'Video';
      frame.allow = 'fullscreen; picture-in-picture';
      frame.setAttribute('allowfullscreen', '');
      dialog.appendChild(frame);
    }
    dialog.appendChild(buildSay('Not playing?', 'Open the link in your browser.'));
    const open = el('a', 'media-open', 'Open link');
    open.href = video;
    open.target = '_blank';
    open.rel = 'noopener noreferrer';
    dialog.appendChild(open);
  }
  const done = el('button', 'timer-btn', 'Close');
  done.type = 'button';
  const buttons = el('div', 'modal-buttons');
  buttons.appendChild(done);
  dialog.appendChild(buttons);
  const close = showModal(dialog, done);
  done.addEventListener('click', close);
}

// "Photo: who took it, licence", with a link to where it came from.
function buildPhotoCredit({ credit, link }) {
  const line = el('div', 'say-small photo-credit');
  line.appendChild(document.createTextNode('Photo: '));
  if (link) {
    const source = el('a', '', credit);
    source.href = link;
    source.target = '_blank';
    source.rel = 'noopener noreferrer';
    line.appendChild(source);
  } else {
    line.appendChild(document.createTextNode(credit));
  }
  return line;
}

// Reads a photo from the device and shrinks it so it takes little room. Gives a "data:" address.
function readPhoto(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Not a photo.'));
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('error', () => reject(new Error('Could not read it.')));
    reader.addEventListener('load', () => {
      const image = new Image();
      image.addEventListener('error', () => reject(new Error('Not a photo.')));
      image.addEventListener('load', () => {
        const { width, height } = fitSize(image.naturalWidth, image.naturalHeight, PHOTO_MAX_SIZE);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      });
      image.src = reader.result;
    });
    reader.readAsDataURL(file);
  });
}

const PHOTO_MAX_SIZE = 640; // the longest side of a saved photo, in pixels

// A window to add, change or remove a step's photo and its video link. Nothing is kept until Save.
function askForStepMedia(breakfast, stepNumber, text) {
  const start = stepMediaFor(stepMedia, breakfast.id, stepNumber, text);
  let photo = start.photo;

  const dialog = newDialog(`Step ${stepNumber + 1}`, 'editMediaTitle');
  dialog.classList.add('tall');

  dialog.appendChild(el('div', 'edit-step-heading', 'Photo'));
  const photoBox = el('div', 'photo-box');
  const photoError = el('div', 'field-error');
  photoError.setAttribute('role', 'alert');
  const file = el('input');
  file.type = 'file';
  file.accept = 'image/*';
  file.hidden = true;
  const choose = el('button', 'timer-btn ghost');
  choose.type = 'button';
  const remove = el('button', 'media-remove', 'Remove');
  remove.type = 'button';
  function drawPhoto() {
    photoBox.innerHTML = '';
    if (photo) {
      const image = el('img', 'media-preview');
      image.src = photo;
      image.alt = '';
      photoBox.appendChild(image);
    }
    choose.textContent = photo ? 'Change photo' : 'Add photo';
    remove.hidden = !photo;
  }
  choose.addEventListener('click', () => file.click());
  remove.addEventListener('click', () => {
    photo = '';
    drawPhoto();
  });
  file.addEventListener('change', () => {
    photoError.textContent = '';
    readPhoto(file.files[0]).then(
      (result) => {
        photo = result;
        drawPhoto();
      },
      (error) => {
        photoError.textContent = error.message;
      }
    );
    file.value = '';
  });
  dialog.append(photoBox, choose, remove, file, photoError);
  drawPhoto();

  dialog.appendChild(el('div', 'edit-step-heading', 'Video'));
  dialog.appendChild(buildSay('Paste a video link.', 'YouTube, Vimeo or a video file.'));
  const video = el('input');
  video.type = 'url';
  video.value = start.video;
  video.placeholder = 'https://';
  video.setAttribute('aria-label', 'Video link');
  const videoError = el('div', 'field-error');
  videoError.setAttribute('role', 'alert');
  dialog.append(video, videoError);

  const buttons = el('div', 'modal-buttons');
  const cancel = el('button', 'timer-btn ghost', 'Cancel');
  cancel.type = 'button';
  const save = el('button', 'timer-btn', 'Save');
  save.type = 'button';
  buttons.append(cancel, save);
  dialog.appendChild(buttons);

  const close = showModal(dialog, cancel);
  cancel.addEventListener('click', close);
  save.addEventListener('click', () => {
    const link = video.value.trim();
    if (link && !parseVideoLink(link)) {
      videoError.textContent = 'Use a YouTube, Vimeo or video link.';
      video.setAttribute('aria-invalid', 'true');
      return;
    }
    const next = setStepMedia(stepMedia, breakfast.id, stepNumber, text, { photo, video: link });
    if (!saveStepMedia(next)) {
      photoError.textContent = 'No room left. Remove a photo.';
      return;
    }
    stepMedia = next;
    close();
    redrawDetail();
    showToast('Saved');
  });
}

// A window to set the picture and the highlighted words of one step, for any breakfast. Nothing is
// kept until Save; "Reset" returns the step to the picture and word the app chose.
function askToEditStep(breakfast, stepNumber) {
  const split = splitStep(breakfast.steps[stepNumber]);
  const text = split.text;
  const start = stepCueFor(stepCues, breakfast.id, stepNumber, text, split.mainEnd);
  let icon = start.icon;
  let marks = [...start.marks];

  const dialog = newDialog(`Step ${stepNumber + 1}`, 'editStepTitle');
  dialog.classList.add('tall');

  const preview = el('div', 'step-preview');
  const previewIcon = el('span', 'step-icon');
  const previewWords = el('span', 'step-text');
  preview.append(previewIcon, previewWords);
  function drawPreview() {
    previewIcon.textContent = icon;
    previewWords.innerHTML = '';
    appendStepWords(previewWords, split, marks);
  }
  dialog.appendChild(preview);

  dialog.appendChild(el('div', 'edit-step-heading', 'Picture'));
  dialog.appendChild(
    buildIconChooser(icon, STEP_ICON_CHOICES, (chosen) => {
      icon = chosen;
      drawPreview();
    })
  );

  dialog.appendChild(el('div', 'edit-step-heading', 'Highlighted words'));
  dialog.appendChild(buildSay('Tap words to highlight.'));
  const wordsBox = el('div', 'word-chips');
  stepWords(text).forEach((word, index) => {
    const chip = el('button', 'word-chip', word);
    chip.type = 'button';
    chip.disabled = !canHighlight(word);
    function refresh() {
      chip.classList.toggle('on', marks.includes(index));
      chip.setAttribute('aria-pressed', String(marks.includes(index)));
    }
    chip.addEventListener('click', () => {
      marks = toggleMark(marks, index);
      refresh();
      drawPreview();
    });
    refresh();
    wordsBox.appendChild(chip);
  });
  dialog.appendChild(wordsBox);
  drawPreview();

  const reset = el('button', 'step-reset', 'Reset');
  reset.type = 'button';
  dialog.appendChild(reset);

  const buttons = el('div', 'modal-buttons');
  const cancel = el('button', 'timer-btn ghost', 'Cancel');
  cancel.type = 'button';
  const save = el('button', 'timer-btn', 'Save');
  save.type = 'button';
  buttons.append(cancel, save);
  dialog.appendChild(buttons);

  const close = showModal(dialog, cancel);
  cancel.addEventListener('click', close);
  function keep(next) {
    stepCues = next;
    saveStepCues(stepCues);
    close();
    redrawDetail();
    showToast('Saved');
  }
  reset.addEventListener('click', () => keep(clearStepCue(stepCues, breakfast.id, stepNumber)));
  save.addEventListener('click', () => {
    const sameAsAutomatic =
      icon === stepIcon(text) && marks.join() === defaultMarks(text, split.mainEnd).join();
    keep(
      sameAsAutomatic
        ? clearStepCue(stepCues, breakfast.id, stepNumber)
        : setStepCue(stepCues, breakfast.id, stepNumber, text, { icon, marks })
    );
  });
}

// Asks first, because removing a line of your own cannot be undone. Cancel is on the left.
function askToRemoveOwnTask(text) {
  const dialog = newDialog(`Remove "${text}"?`, 'removeOwnTitle');
  dialog.appendChild(el('div', 'modal-body', 'You cannot undo this.'));

  const buttons = el('div', 'modal-buttons');
  const cancel = el('button', 'timer-btn ghost', 'Cancel');
  cancel.type = 'button';
  const confirm = el('button', 'timer-btn danger', 'Remove');
  confirm.type = 'button';
  buttons.append(cancel, confirm);
  dialog.appendChild(buttons);

  const close = showModal(dialog, cancel);
  cancel.addEventListener('click', close);
  confirm.addEventListener('click', () => {
    close();
    ownTasks = ownTasks.filter((other) => other !== text);
    delete ownIcons[text];
    prepTasks = prepTasks.filter((task) => task !== ownTask(text));
    savePrepChoice();
    redrawOwnTasks();
    updateTaskCount();
    showToast('Removed');
  });
}

function redrawOwnTasks() {
  const old = document.getElementById('ownTasks');
  const next = renderOwnTasks();
  old.replaceWith(next);
}

// ---------- Prep tonight ----------
let prepTasks = loadPrepTasks() ?? [...defaultPrepTasks]; // the lines on the student's list, in order
let ownIcons = loadOwnTaskIcons(); // the picture chosen for each of the student's own lines, by its words
let ownTasks = loadOwnPrepTasks(); // the words of the student's own lines, even when off tonight's list
let prepChecked = loadPrep(todayKey()); // the lines ticked today; a new day starts empty
let prepOpen = false;
let prepOrdering = false; // true while the home list shows arrows for changing the order

function renderPrep() {
  prepList.innerHTML = '';
  if (prepTasks.length === 0) {
    prepList.appendChild(el('li', 'prep-empty', 'No tasks. Tap Choose tasks.'));
  }
  prepTasks.forEach((text, index) => {
    const isDone = prepChecked.includes(text);
    const li = el('li', 'prep-item' + (isDone ? ' checked' : ''));
    const box = el('span', 'prep-box');
    // The box shows the item's number until it is done, then a tick, like its segment above.
    if (isDone) {
      box.innerHTML =
        '<svg viewBox="0 0 16 16" fill="none"><path d="M3 8L6.5 11.5L13 4.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    } else {
      box.textContent = String(index + 1);
    }
    const view = describeTask(text, ownIcons);
    const words = el('span', 'prep-text');
    words.appendChild(richText(view.text));
    li.append(box, taskIcon(view.icon), words);
    if (prepOrdering) {
      li.classList.add('ordering');
      [['up', -1, '\u25B2'], ['down', 1, '\u25BC']].forEach(([name, delta, arrow]) => {
        const button = el('button', 'order-btn', arrow);
        button.type = 'button';
        button.dataset.move = name;
        button.setAttribute('aria-label', `Move ${view.plain} ${name}, now number ${index + 1} of ${prepTasks.length}`);
        button.disabled = index + delta < 0 || index + delta >= prepTasks.length;
        button.addEventListener('click', () => {
          prepTasks = moveItem(prepTasks, index, delta);
          savePrepChoice();
          renderPrep();
          keepPrepFocus(text, name);
        });
        li.appendChild(button);
      });
    } else {
      li.addEventListener('click', () => {
        prepChecked = toggleChecked(prepChecked, text);
        savePrep(todayKey(), prepChecked);
        renderPrep();
      });
    }
    prepList.appendChild(li);
  });
  prepList.classList.toggle('ordering', prepOrdering);
  prepOrderHint.hidden = !prepOrdering;
  prepReorderBtn.querySelector('.btn-label').textContent = prepOrdering ? 'Done' : 'Change order';
  prepReorderBtn.querySelector('.btn-icon').textContent = prepOrdering ? '\u2705' : '\u2195\uFE0F';
  prepReorderBtn.classList.toggle('on', prepOrdering);
  prepReorderBtn.setAttribute('aria-pressed', String(prepOrdering));
  prepReorderBtn.disabled = prepTasks.length < 2 && !prepOrdering;
  renderPrepProgress();
}

// After a line moves, put focus back on the arrow just used, or the other arrow if that one is now at the end.
function keepPrepFocus(task, name) {
  const item = prepList.children[prepTasks.indexOf(task)];
  const button = item && item.querySelector(`[data-move="${name}"]`);
  const other = item && item.querySelector('.order-btn:not(:disabled)');
  const target = button && !button.disabled ? button : other;
  if (target) target.focus();
}

// How far along the checklist is: one numbered segment for each item, in list order (a tick when
// that item is done, whatever order they were done in), and one line of words with what is done
// and what is left.
function renderPrepProgress() {
  const done = countDone(prepTasks, prepChecked);
  const total = prepTasks.length;
  const wording = progressWording(done, total);

  prepSegments.innerHTML = '';
  prepSegments.classList.toggle('compact', total > 9); // too many boxes for numbers: just the fill
  segmentStates(prepTasks, prepChecked).forEach((isDone, index) => {
    prepSegments.appendChild(el('span', 'prep-segment' + (isDone ? ' done' : ''), isDone ? '\u2713' : String(index + 1)));
  });
  prepSegments.setAttribute('aria-valuemax', String(total));
  prepSegments.setAttribute('aria-valuenow', String(done));
  prepSegments.setAttribute('aria-valuetext', wording.done);

  prepSub.innerHTML = '';
  prepSub.classList.toggle('all-done', done >= total);
  prepSub.append(el('strong', 'prep-done-text', wording.done), el('span', 'prep-sep', ' \u00b7 '), el('span', 'prep-left-text', wording.left));
}

document.getElementById('prepChooseBtn').addEventListener('click', () => showScreen('tasks'));
prepReorderBtn.addEventListener('click', () => {
  prepOrdering = !prepOrdering;
  renderPrep();
});

prepToggle.addEventListener('click', () => {
  prepOpen = !prepOpen;
  prepBody.classList.toggle('open', prepOpen);
  prepArrow.classList.toggle('open', prepOpen);
  prepToggle.setAttribute('aria-expanded', String(prepOpen));
});

// ---------- Start ----------
document.body.dataset.screen = 'home';
renderTagChips();
renderFavoritesChip();
renderKitchenBox();
renderPrep();
