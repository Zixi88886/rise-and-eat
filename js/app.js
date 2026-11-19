import { builtInBreakfasts, defaultPrepTasks, prepLibrary, stepPhotos } from './data.js';
import { isNight } from './theme.js';
import {
  daysLeft,
  emptyAll,
  hiddenKeys,
  moveToTrash,
  purgeExpired,
  restoreFromTrash,
  SOON_DAYS,
  trashButtonLabel,
  trashSummary,
  bringBackBuiltIn,
} from './trash.js';
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
  canMake,
  cleanOwnFood,
  countItems,
  describeNeeds,
  haveLabels,
  itemIdOfKind,
  kindIdsOf,
  MAX_FOOD_LENGTH,
  missingNeedItems,
  missingNeeds,
  ownBasics,
  ownFoodId,
  ownFoods,
  setHiddenFoods,
  setOwnBasics,
  setOwnFoods,
  typedItems,
  visibleGroups,
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
  chineseAlmost,
  chineseForStep,
  chineseFoods,
  chineseHaveLabels,
  chineseKindsLabel,
  chineseKitchenCount,
  chineseMinutes,
  chineseNames,
  chineseNeedLabel,
  chineseTaskCount,
  chineseTasks,
  chineseNeedsSummary,
  chineseOf,
  chineseSaved,
  chineseDaysLeft,
  chineseMovedToTrash,
  chineseStepNumber,
  chineseStepTime,
  chineseProgress,
  chineseShowing,
  chineseStartTimer,
  chineseSummary,
  chineseUi,
  findKnownFood,
  languageClass,
} from './chinese.js';
import {
  frenchAlmost,
  frenchFoods,
  frenchForStep,
  frenchHaveLabels,
  frenchKindsLabel,
  frenchKitchenCount,
  frenchMinutes,
  frenchMinutesLong,
  frenchNames,
  frenchNeedItem,
  frenchNeedLabel,
  frenchNeedsSummary,
  frenchOf,
  frenchProgress,
  frenchRemoveFood,
  frenchSaved,
  frenchShowing,
  frenchStartTimer,
  frenchDaysLeft,
  frenchMovedToTrash,
  frenchStepNumber,
  frenchStepTime,
  frenchSummary,
  frenchTaskCount,
  frenchTasks,
  frenchUi,
} from './french.js';
import { LANGUAGE_CHOICES } from './languages.js';
import {
  builtInPhotoFor,
  fitSize,
  parseVideoLink,
  photoAltText,
  removeBreakfastMedia,
  setStepMedia,
  stepMediaFor,
} from './stepmedia.js';
import { dragOffset, isSwipeUp, isTap } from './swipe.js';
import {
  isUsableBreakfast,
  loadCustomBreakfasts,
  saveCustomBreakfasts,
  loadFavorites,
  loadKitchen,
  loadLanguage,
  loadTheme,
  loadOwnBasics,
  loadTrash,
  loadOwnFoods,
  loadOwnPrepTasks,
  loadOwnTaskIcons,
  loadPrep,
  loadPrepTasks,
  loadStepCues,
  loadStepMedia,
  saveFavorites,
  saveKitchen,
  saveLanguage,
  saveTheme,
  saveOwnBasics,
  saveTrash,
  saveOwnFoods,
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

let ownFoodNames = loadOwnFoods(); // the foods the student typed, in order
setOwnFoods(ownFoodNames);
let ownBasicNames = loadOwnBasics(); // the cooking basics the student typed, in order
setOwnBasics(ownBasicNames);
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

// The trash: what the student deleted, waiting 30 days (see trash.js). What has waited 30 days is deleted for good
// when the app opens. The built-in foods and breakfasts that are in the trash (or gone for good) are hidden.
let trash = purgeExpired(loadTrash(), Date.now()).trash;
saveTrash(trash);
let hiddenBreakfastIds = new Set();

function applyTrash() {
  setHiddenFoods(hiddenKeys(trash, 'builtin-food'));
  hiddenBreakfastIds = hiddenKeys(trash, 'builtin-breakfast');
  updateTrashIcons();
}

// The trash icons (home and the bar at the top): the number inside, red when something is about to be deleted for good.
function updateTrashIcons() {
  const { count, soon } = trashSummary(trash, Date.now());
  const words = trashButtonLabel(count);
  document.querySelectorAll('.trash-btn').forEach((button) => {
    button.setAttribute('aria-label', words);
    button.title = words;
    const badge = button.querySelector('.trash-badge');
    badge.hidden = count === 0;
    badge.textContent = String(count);
    badge.classList.toggle('soon', soon);
  });
}
applyTrash();

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

// The built-in breakfasts that are not in the trash.
function shownBuiltInBreakfasts() {
  return builtInBreakfasts.filter((breakfast) => !hiddenBreakfastIds.has(breakfast.id));
}

function allBreakfasts() {
  return [...shownBuiltInBreakfasts(), ...state.customBreakfasts];
}

function findBreakfast(id) {
  return allBreakfasts().find((b) => b.id === id);
}

// A small message that floats at the top of the screen. It disappears after a few seconds,
// unless it is a warning (sticky), which stays until the student dismisses it. It can be
// swiped up or tapped away at any time.
const TOAST_SECONDS = 4;
const UNDO_SECONDS = 8; // a message with an Undo button stays longer
const TOAST_SLIDE_MILLISECONDS = 200;
const toastEl = document.getElementById('toast');
const toastText = document.getElementById('toastText');
let toastTimer = null;
let toastIsSticky = false;
let toastDragStartY = null;
let toastSeconds = TOAST_SECONDS;
const toastAction = document.getElementById('toastAction');
let toastActionRun = null;

// `action` is { run } for a message with an Undo button: tapping it calls run().
function showToast(text, sticky = false, chinese = chineseOf(text), french = frenchOf(text), action = null) {
  clearTimeout(toastTimer);
  toastText.textContent = wordsInChosenLanguage(text, chinese, french);
  toastActionRun = action ? action.run : null;
  toastAction.hidden = !action;
  if (action) toastAction.textContent = wordsInChosenLanguage('Undo');
  toastSeconds = action ? UNDO_SECONDS : TOAST_SECONDS;
  toastIsSticky = sticky;
  toastEl.classList.remove('leaving', 'dragging');
  toastEl.style.setProperty('--drag-y', '0px');
  toastEl.classList.toggle('sticky', sticky);
  toastEl.hidden = false;
  startToastTimer();
}

function startToastTimer() {
  clearTimeout(toastTimer);
  if (!toastIsSticky) toastTimer = setTimeout(slideToastAway, toastSeconds * 1000);
}

function hideToast() {
  clearTimeout(toastTimer);
  toastEl.hidden = true;
  toastActionRun = null;
}

// Slides the message up out of sight, then hides it.
function slideToastAway() {
  clearTimeout(toastTimer);
  toastEl.classList.add('leaving');
  toastTimer = setTimeout(hideToast, TOAST_SLIDE_MILLISECONDS);
}

toastEl.addEventListener('pointerdown', (event) => {
  if (event.target.closest('.toast-close, .toast-action')) return;
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
toastAction.addEventListener('click', () => {
  const run = toastActionRun;
  hideToast();
  if (run) run();
});

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
  moveBackButtonToTopBar();
}

// The Back button sits in a small bar fixed at the top, with the settings gear, so both stay in
// reach however far the page is scrolled. The home screen has no Back button, so it has no bar.
function moveBackButtonToTopBar() {
  const bar = document.getElementById('topBar');
  const inner = document.getElementById('topBarInner');
  // Safe to do twice: a screen that was drawn again without a new Back button keeps the one already in the bar.
  const back = panelInner.querySelector('.back-btn');
  if (back) {
    inner.querySelectorAll('.back-btn').forEach((old) => old.remove());
    inner.prepend(back);
  }
  bar.hidden = state.view === 'home' || !inner.querySelector('.back-btn');
}

// The English words of a text, marked for the languages that have a translation of it. In Chinese only mode
// the English with a Chinese translation is hidden (class "en"); in French only mode the English with a French
// translation is hidden (class "en-f"). English with no translation in the chosen language stays.
function englishSpan(english, hasChinese, hasFrench) {
  return el('span', [hasChinese && 'en', hasFrench && 'en-f'].filter(Boolean).join(' '), english);
}

// The lines under (or beside) the English: one in Chinese and/or one in French. Which of them shows
// depends on the chosen language, so both are always written and the page's class hides the others.
// Returns a fragment that can be appended like an element.
function buildLines(chinese, french, className) {
  const lines = document.createDocumentFragment();
  if (chinese !== null && chinese !== undefined) lines.append(buildChineseLine(chinese, className));
  if (french !== null && french !== undefined) lines.append(buildFrenchLine(french, className));
  return lines;
}

// A fixed English text with its Chinese and French beside it, when it has some. A text with
// neither is shown as plain English.
function appendBilingual(parent, english, lineClass = 'zh-inline') {
  const chinese = chineseOf(english);
  const french = frenchOf(english) === english ? null : frenchOf(english); // "Pause" is the same word: show it once
  if (chinese === null && french === null) {
    parent.appendChild(document.createTextNode(english));
  } else {
    parent.append(englishSpan(english, chinese !== null, french !== null), buildLines(chinese, french, lineClass));
  }
  return parent;
}

function bilingualEl(tag, className, english, chineseClass) {
  return appendBilingual(el(tag, className), english, chineseClass);
}

// English words (already worked out) with their Chinese, and their French if there is some, beside them.
function appendEnglishAndChinese(parent, english, chinese, lineClass = 'zh-inline', french = null) {
  if (french === english) french = null; // the same words in French ("2 minutes") are shown once
  const sameInChinese = chinese === english; // a name you typed is the same in Chinese: it is shown once
  parent.append(englishSpan(english, !sameInChinese, french !== null), buildLines(sameInChinese ? null : chinese, french, lineClass));
  return parent;
}

function backButton(label, onClick) {
  const back = el('button', 'back-btn');
  back.append('\u2190 ');
  appendBilingual(back, label);
  back.type = 'button';
  back.addEventListener('click', onClick);
  return back;
}

function renderEmpty(title, body) {
  const empty = el('div', 'empty-state');
  empty.appendChild(appendBilingual(el('strong'), title, 'zh-line'));
  empty.appendChild(appendBilingual(el('span'), body, 'zh-line'));
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
// A line of Chinese words (a small span) to put under or next to the English ones.
function buildChineseLine(words, className) {
  const line = el('span', className, words);
  line.lang = 'zh-Hans';
  return line;
}

// A line of French words. It uses the same classes as a line of Chinese, so it looks the same.
function buildFrenchLine(words, className) {
  const line = el('span', className, words);
  line.lang = 'fr';
  return line;
}

// The Chinese words for the labels written in index.html: each has a data-zh name.
function fillChineseLabels() {
  document.querySelectorAll('[data-zh]').forEach((node) => {
    const words = chineseUi[node.dataset.zh];
    if (typeof words === 'string') node.textContent = words;
  });
  // The French words for the same labels: each has a data-fr name.
  document.querySelectorAll('[data-fr]').forEach((node) => {
    const words = frenchUi[node.dataset.fr];
    if (typeof words === 'string') node.textContent = words;
  });
}

function renderKitchenBox() {
  const count = countItems(state.have);
  kitchenCountEl.textContent = '';
  kitchenCountEl.appendChild(
    el('span', 'en en-f', count === 0 ? 'What do you have?' : `${count} ${count === 1 ? 'item' : 'items'} \u00b7 tap to change`)
  );
  kitchenCountEl.appendChild(
    buildLines(
      count === 0 ? chineseUi.kitchenEmpty : chineseUi.kitchenItems(count),
      count === 0 ? frenchUi.kitchenEmpty : frenchUi.kitchenItems(count),
      'zh-line'
    )
  );
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
    const chip = el('button', 'chip' + (active ? ' active' : ''));
    chip.append(el('span', 'en en-f', tag.label), buildLines(chineseUi.tags[tag.id], frenchUi.tags[tag.id], 'chip-zh'));
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
  const chip = el('button', 'chip favorites-chip' + (state.onlyFavorites ? ' active' : ''));
  chip.append(
    '\u2665 ',
    el('span', 'en en-f', `Favorites (${state.favorites.length})`),
    buildLines(`${chineseUi.favorites} (${state.favorites.length})`, `${frenchUi.favorites} (${state.favorites.length})`, 'chip-zh')
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
  const builtIn = shownBuiltInBreakfasts().filter(fits).sort((a, b) => a.minutes - b.minutes);
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
    missingById.set(b.id, { label: missing[0], need: missingNeedItems(b, state.have, state.strictSeasonings)[0] });
    return true;
  };
  return ordered(fits).map((breakfast) => ({
    breakfast,
    missing: missingById.get(breakfast.id).label,
    missingNeed: missingById.get(breakfast.id).need,
  }));
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
  // Opening "Almost there" or turning the page draws only the list, so the Back button it drew is moved up to the
  // bar here too (before, a second Back button stayed in the list).
  moveBackButtonToTopBar();
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
  const summary = el('div', 'results-summary');
  appendEnglishAndChinese(
    summary,
    filterSummary(makeableCount, almostCount),
    chineseSummary({
      count: makeableCount,
      anyTime: state.minutes === ANY_TIME,
      maxMinutes: state.minutes,
      useKitchen: state.useKitchen,
      strict: state.strictSeasonings,
      onlyFavorites: state.onlyFavorites,
      tags: state.tags,
      almost: almostCount,
    }),
    'zh-line',
    frenchSummary({
      count: makeableCount,
      anyTime: state.minutes === ANY_TIME,
      maxMinutes: state.minutes,
      useKitchen: state.useKitchen,
      strict: state.strictSeasonings,
      onlyFavorites: state.onlyFavorites,
      tags: state.tags,
      almost: almostCount,
    })
  );
  panelInner.appendChild(summary);

  if (makeableCount === 0 && almostCount === 0) {
    renderEmpty(
      state.onlyFavorites && state.favorites.length === 0 ? 'No favorites yet.' : 'No match.',
      state.onlyFavorites && state.favorites.length === 0
        ? 'Tap \u2665 on a breakfast to save it here.'
        : state.useKitchen
        ? 'You can\u2019t make anything yet. Add more food in My kitchen.'
        : 'Try more minutes or fewer filters.'
    );
    const more = bilingualEl('button', 'add-btn', state.useKitchen ? 'Change My kitchen' : '+ Add your own breakfast');
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
    list.appendChild(buildResultRow(entry.breakfast, entry.missing, entry.missingNeed));
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
  const button = bilingualEl('button', 'add-btn show-all-btn', 'Show all breakfasts');
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
  const almostZh = chineseAlmost(almostCount, state.almostOpen);
  const almostFr = frenchAlmost(almostCount, state.almostOpen);
  text.appendChild(appendEnglishAndChinese(el('strong'), `Almost there (${almostCount})`, almostZh.title, 'zh-line', almostFr.title));
  text.appendChild(
    appendEnglishAndChinese(el('span'), `1 thing missing \u00b7 tap to ${state.almostOpen ? 'hide' : 'show'}`, almostZh.sub, 'zh-line', almostFr.sub)
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
  const label = bilingualEl('div', 'minutes-label', 'Up to\nminutes', 'zh-line');
  label.setAttribute('aria-hidden', 'true'); // the group below carries the same words for screen readers
  wrap.appendChild(label);
  const row = el('div', 'chips minutes-chips');
  row.setAttribute('role', 'group');
  row.setAttribute('aria-label', 'Up to how many minutes');
  MINUTE_CHOICES.forEach(({ minutes, label }) => {
    const active = state.minutes === minutes;
    const chip = el('button', 'chip' + (active ? ' active' : ''));
    appendBilingual(chip, label, 'chip-zh');
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
  const english = el('span', 'en en-f');
  english.appendChild(el('strong', '', 'Your kitchen: '));
  english.appendChild(document.createTextNode(haveLabels(state.have).join(', ') || 'nothing yet'));
  text.appendChild(english);
  const chinese = buildChineseLine('', 'zh-line');
  chinese.append(el('strong', '', chineseOf('Your kitchen:')), chineseHaveLabels(state.have).join('、') || chineseOf('nothing yet'));
  text.appendChild(chinese);
  const french = buildFrenchLine('', 'zh-line');
  french.append(el('strong', '', frenchOf('Your kitchen:')), ` ${frenchHaveLabels(state.have).join(', ') || frenchOf('nothing yet')}`);
  text.appendChild(french);

  const change = bilingualEl('button', 'link-btn', 'Change');
  change.type = 'button';
  change.addEventListener('click', () => showScreen('kitchen'));

  box.append(text, change);
  return box;
}

function buildResultRow(b, missing, missingNeed) {
  const item = el('div', 'idea-item');
  const row = el('button', 'idea-row' + (b.custom ? ' custom' : '') + (missing ? ' almost' : ''));
  row.type = 'button';

  const mark = el('span', 'idea-mark');
  mark.style.background = b.accent;
  mark.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="6" fill="white" opacity="0.9"/></svg>';

  const text = el('span', 'idea-text');
  const nameLine = el('div', 'idea-name');
  nameLine.appendChild(englishSpan(b.name, Boolean(chineseNames[b.id]), Boolean(frenchNames[b.id])));
  if (b.custom) nameLine.appendChild(bilingualEl('span', 'badge', 'Yours'));
  text.appendChild(nameLine);
  text.appendChild(buildLines(chineseNames[b.id] ?? null, frenchNames[b.id] ?? null, 'idea-name-zh'));
  const details = [`${b.minutes} min`, ...(b.tags || []).map(tagLabel)];
  const detailsZh = [chineseMinutes(b.minutes), ...(b.tags || []).map((tag) => chineseUi.tags[tag] || tag)];
  const detailsFr = [frenchMinutes(b.minutes), ...(b.tags || []).map((tag) => frenchUi.tags[tag] || tag)];
  text.appendChild(appendEnglishAndChinese(el('div', 'idea-time'), details.join(' · '), detailsZh.join(' · '), 'zh-line', detailsFr.join(' · ')));
  if (missing) {
    text.appendChild(
      appendEnglishAndChinese(
        el('div', 'missing-note'),
        `Missing: ${missing}`,
        `${chineseOf('Missing:')}${chineseNeedLabel(missingNeed)}`,
        'zh-line',
        `${frenchOf('Missing:')} ${frenchNeedLabel(missingNeed)}`
      )
    );
  }

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
  item.append(row, buildHeartButton(b, 'in-list'), buildCornerCross(b.name, () => deleteBreakfast(b, row)));
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
  const status = appendEnglishAndChinese(
    el('div', 'pager-status'),
    `Showing ${first}\u2013${last} of ${total}`,
    chineseShowing(first, last, total),
    'zh-line',
    frenchShowing(first, last, total)
  );
  status.setAttribute('role', 'status');

  const buttons = el('div', 'pager-buttons');

  const previous = el('button', 'pager-btn');
  previous.append(el('span', 'pager-arrow', '\u2190'), appendBilingual(el('span', 'pager-label'), 'Previous', 'zh-line'));
  previous.type = 'button';
  previous.disabled = !canGoBack;
  previous.addEventListener('click', () => {
    hideToast();
    state.offset = state.offsetHistory.pop() ?? 0;
    renderResults();
  });

  const next = el('button', 'pager-btn');
  next.append(appendBilingual(el('span', 'pager-label'), 'Next', 'zh-line'), el('span', 'pager-arrow', '\u2192'));
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
  panelInner.appendChild(bilingualEl('div', 'detail-title', 'What\u2019s in your kitchen?', 'zh-line'));
  panelInner.appendChild(buildSay('Tap what you have.', 'Water is counted.'));

  const typedHandlers = {
    isOn: (id) => state.have.includes(id),
    onToggle: (id) => {
      toggleHave(id);
      updateKitchenActions();
    },
    onAdded: (id) => {
      toggleHave(id); // a food you typed in your kitchen is a food you have
      updateKitchenActions();
    },
    onRemoved: () => {
      state.have = state.have.filter((id) => typedItems().some((food) => food.id === id) || !id.startsWith('own:'));
      persistKitchen();
      updateKitchenActions();
    },
  };
  panelInner.appendChild(buildOwnFoodsSection(typedHandlers));

  visibleGroups().forEach((group) => {
    const section = buildGroupSection(group);
    const chips = el('div', 'chips ingredient-chips');
    group.items.forEach((item) => chips.appendChild(buildKitchenItem(item)));
    section.appendChild(chips);
    if (group.basics) section.appendChild(buildOwnFoodsSection(typedHandlers, 'basic'));
    panelInner.appendChild(section);
  });

  const actions = el('div', 'kitchen-actions');
  const count = el('div', 'kitchen-count');
  count.id = 'kitchenCount';
  count.setAttribute('role', 'status');
  const actionButtons = el('div', 'form-actions');
  const clear = bilingualEl('button', 'timer-btn ghost', 'Clear all', 'zh-line');
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
  section.appendChild(bilingualEl('div', 'ingredient-group-title', group.title));
  if (group.note) section.appendChild(bilingualEl('div', 'ingredient-group-note', group.note));
  return section;
}

// One ingredient chip. An item with kinds shows a row of kinds under it once it is ticked.
function buildKitchenItem(item) {
  const wrap = el('div', 'kitchen-item');
  const chip = el('button', 'chip');
  appendEnglishAndChinese(chip, item.label, chineseFoods[item.id], 'chip-zh', frenchFoods[item.id]);
  chip.type = 'button';
  wrap.appendChild(buildRemovableChip(chip, item.label, () => deleteBuiltInFood(item, chip)));

  let kindsRow = null;
  const kindChips = [];
  if (item.kinds) {
    kindsRow = el('div', 'kinds-row');
    kindsRow.appendChild(
      appendEnglishAndChinese(
        el('div', 'kinds-label'),
        `Which kind of ${item.label.toLowerCase()}? (optional)`,
        chineseKindsLabel(item.id),
        'zh-line',
        frenchKindsLabel(item.id)
      )
    );
    const kindsChips = el('div', 'chips');
    item.kinds.forEach((kind) => {
      const kindChip = el('button', 'chip small-chip');
      appendEnglishAndChinese(kindChip, kind.label, chineseFoods[kind.id], 'chip-zh', frenchFoods[kind.id]);
      kindChip.type = 'button';
      kindChip.addEventListener('click', () => {
        toggleHave(kind.id);
        refresh();
        updateKitchenActions();
      });
      kindChips.push({ id: kind.id, node: kindChip });
      kindsChips.appendChild(buildRemovableChip(kindChip, kind.label, () => deleteBuiltInFood(kind, kindChip)));
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
  show.textContent = '';
  appendBilingual(show, count === 0 ? 'Tap what you have' : 'Show what I can make', 'zh-line');
  clear.disabled = count === 0;
  const countBox = document.getElementById('kitchenCount');
  countBox.textContent = '';
  appendEnglishAndChinese(
    countBox,
    count === 0 ? 'Nothing yet' : `${count} ${count === 1 ? 'item' : 'items'} ticked`,
    chineseKitchenCount(count),
    'zh-line',
    frenchKitchenCount(count)
  );
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
  panelInner.appendChild(bilingualEl('div', 'detail-title', 'Add your own breakfast', 'zh-line'));
  panelInner.appendChild(bilingualEl('div', 'detail-sub', 'It is saved on this device.', 'zh-line'));

  const form = el('form', 'add-form');
  form.noValidate = true;

  const nameInput = el('input');
  nameInput.id = 'fieldName';
  nameInput.type = 'text';
  nameInput.maxLength = 80;
  nameInput.value = state.formValues.name;
  nameInput.placeholder = wordsInChosenLanguage('e.g. Leftover pasta omelet');

  const minutesInput = el('input');
  minutesInput.id = 'fieldMinutes';
  minutesInput.type = 'number';
  minutesInput.min = '1';
  minutesInput.max = String(MAX_MINUTES);
  minutesInput.inputMode = 'numeric';
  minutesInput.value = state.formValues.minutes;
  minutesInput.placeholder = wordsInChosenLanguage('e.g. 10');

  const stepsInput = el('textarea');
  stepsInput.id = 'fieldSteps';
  stepsInput.rows = 5;
  stepsInput.value = state.formValues.stepsText;
  stepsInput.placeholder = wordsInChosenLanguage('One step per line');

  form.appendChild(formField('Name', nameInput, state.formErrors.name));
  form.appendChild(formField('Minutes', minutesInput, state.formErrors.minutes));
  form.appendChild(formField('Steps', stepsInput, state.formErrors.steps));
  form.appendChild(buildTagPicker());
  form.appendChild(buildIngredientPicker());

  const actions = el('div', 'form-actions');
  const later = bilingualEl('button', 'timer-btn ghost', 'Save for later', 'zh-line');
  later.type = 'submit';
  later.dataset.action = 'later';
  const eatNow = bilingualEl('button', 'timer-btn', 'Save and eat now', 'zh-line');
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
  group.appendChild(bilingualEl('legend', '', 'Tags (optional)'));
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
    label.append(box, ' ');
    appendEnglishAndChinese(label, tag.label, chineseUi.tags[tag.id], 'zh-inline', frenchUi.tags[tag.id]);
    group.appendChild(label);
  });
  return group;
}

// Which ingredients the breakfast uses, so it can match "Only what I have". Collapsed to save space.
function buildIngredientPicker() {
  const details = el('details', 'field ingredient-picker');
  details.appendChild(bilingualEl('summary', '', 'Food it uses (optional)'));
  details.appendChild(buildSay('Tick what it uses.', 'Then it shows with \u201cOnly what I have\u201d.'));
  const typedHandlers = {
    isOn: (id) => state.formValues.needs.includes(id),
    onToggle: (id) => {
      const needs = state.formValues.needs;
      state.formValues.needs = needs.includes(id) ? needs.filter((other) => other !== id) : [...needs, id];
    },
    onAdded: (id) => {
      state.formValues.needs = [...state.formValues.needs, id]; // a food you typed here is one this breakfast uses
    },
    onRemoved: () => {
      state.formValues.needs = state.formValues.needs.filter((id) => typedItems().some((food) => food.id === id) || !id.startsWith('own:'));
    },
  };
  details.appendChild(buildOwnFoodsSection(typedHandlers));
  visibleGroups().forEach((group) => {
    const section = buildGroupSection(group);
    details.appendChild(section);
    const chips = el('div', 'chips ingredient-chips');
    group.items.forEach((item) => {
      const isOn = state.formValues.needs.includes(item.id);
      const chip = el('button', 'chip' + (isOn ? ' active' : ''));
      appendEnglishAndChinese(chip, item.label, chineseFoods[item.id], 'chip-zh', frenchFoods[item.id]);
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
    if (group.basics) section.appendChild(buildOwnFoodsSection(typedHandlers, 'basic'));
  });
  return details;
}

// The two lists the student can type into: foods, and cooking basics. They work the same way; a basic
// sits in the Cooking basics group and counts as a seasoning for a breakfast.
const OWN_LISTS = {
  food: {
    title: 'My own foods',
    hint: 'Type a food, then tap Add.',
    example: 'e.g. Kimchi',
    ariaLabel: 'Type a food',
    items: ownFoods,
    names: () => ownFoodNames,
    change(names) {
      ownFoodNames = names;
      saveOwnFoods(names);
      setOwnFoods(names);
    },
  },
  basic: {
    title: 'My own basics',
    hint: 'Type a basic, then tap Add.',
    example: 'e.g. Chili flakes',
    ariaLabel: 'Type a cooking basic',
    items: ownBasics,
    names: () => ownBasicNames,
    change(names) {
      ownBasicNames = names;
      saveOwnBasics(names);
      setOwnBasics(names);
    },
  },
};

// The foods (or cooking basics) the student typed, with a box to type another. Used on My kitchen (tap = you
// have it) and in the Add a breakfast form (tap = the breakfast uses it); `handlers` say what a tap means there.
function buildOwnFoodsSection(handlers, kind = 'food') {
  const list = OWN_LISTS[kind];
  const section = el('div', 'ingredient-group own-foods' + (kind === 'basic' ? ' own-basics' : ''));
  section.appendChild(bilingualEl('div', 'ingredient-group-title', list.title));
  section.appendChild(buildSay(list.hint));

  if (list.items().length > 0) {
    const chips = el('div', 'chips ingredient-chips');
    list.items().forEach((food) => {
      const chip = el('button', 'chip', food.label);
      chip.type = 'button';
      function refresh() {
        const on = handlers.isOn(food.id);
        chip.classList.toggle('active', on);
        chip.setAttribute('aria-pressed', String(on));
      }
      chip.addEventListener('click', () => {
        handlers.onToggle(food.id);
        refresh();
      });
      refresh();
      chips.appendChild(
        buildRemovableChip(chip, food.label, () =>
          deleteOwnFood(food, kind, chip, () => {
            handlers.onRemoved(food.id);
            section.replaceWith(buildOwnFoodsSection(handlers, kind));
          })
        )
      );
    });
    section.appendChild(chips);
  }

  const form = el('form', 'own-task-form');
  form.noValidate = true;
  const row = el('div', 'own-task-row');
  const input = el('input');
  input.type = 'text';
  input.maxLength = MAX_FOOD_LENGTH;
  input.placeholder = wordsInChosenLanguage(list.example);
  input.setAttribute('aria-label', list.ariaLabel);
  const add = bilingualEl('button', 'timer-btn', 'Add', 'zh-line');
  add.type = 'submit';
  row.append(input, add);
  const error = el('div', 'field-error');
  error.setAttribute('role', 'alert');
  form.append(row, error);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const result = cleanOwnFood(input.value, findKnownFood);
    if (result.error) {
      error.textContent = wordsInChosenLanguage(result.error);
      input.setAttribute('aria-invalid', 'true');
      return;
    }
    list.change([...list.names(), result.name]);
    handlers.onAdded(list.items()[list.items().length - 1].id);
    section.replaceWith(buildOwnFoodsSection(handlers, kind));
    showToast('Added');
  });
  section.appendChild(form);
  return section;
}

// ---------- Deleting, and the trash ----------
// Nothing is erased at once: a deleted thing goes to the trash (see trash.js), a message offers Undo, and the
// trash window in Settings can bring it back for 30 days. Returns the new trash entry, or null if the device
// has no room to keep it (then nothing is deleted).
function putInTrash(thing) {
  const next = moveToTrash(trash, thing, Date.now());
  if (!saveTrash(next)) {
    showToast('Not deleted. No room left.', true);
    return null;
  }
  trash = next;
  applyTrash();
  return next.items.find((item) => item.kind === thing.kind && item.key === thing.key);
}

// The message after deleting something, with an Undo button.
function announceDeleted(name, entry) {
  showToast(`Moved to trash: "${name}"`, false, chineseMovedToTrash(name), frenchMovedToTrash(name), {
    run: () => {
      if (restoreEntry(entry.id)) {
        redrawAfterTrashChange();
        showToast('Restored');
      }
    },
  });
}

// Draws again everything that shows foods, breakfasts or favorites.
function redrawAfterTrashChange() {
  renderKitchenBox();
  renderFavoritesChip();
  renderPanel();
}

// A chip with a small "x" button at its top right corner. The "x" is a real button beside the chip (not inside it),
// named by what it does ("Delete Eggs"), and its drawn circle is smaller than the area you can tap.
function buildRemovableChip(chip, label, onDelete) {
  const box = el('span', 'chip-box');
  box.append(chip, buildCornerCross(label, onDelete));
  return box;
}

// The small "x" itself (used on foods and on breakfast rows): a real button named "Delete ...".
function buildCornerCross(label, onDelete) {
  const cross = el('button', 'chip-x');
  cross.type = 'button';
  cross.setAttribute('aria-label', `Delete ${label}`);
  cross.title = `Delete ${label}`;
  const dot = el('span', 'chip-x-dot', '\u2715');
  dot.setAttribute('aria-hidden', 'true');
  cross.appendChild(dot);
  cross.addEventListener('click', onDelete);
  return cross;
}

// A chip is gone from the page after a delete: the next chip gets the focus, so a keyboard user does not lose their place.
function focusChipLike(chip) {
  const index = [...panelInner.querySelectorAll('.chip-box > .chip')].indexOf(chip);
  return () => {
    const after = [...panelInner.querySelectorAll('.chip-box > .chip')];
    if (after.length > 0) after[Math.max(0, Math.min(index, after.length - 1))].focus();
  };
}

// A food that comes with the app, or one of its kinds (oat milk...): it is hidden, and unticked. A food takes its
// kinds with it.
function deleteBuiltInFood(item, chip) {
  const kindIds = (item.kinds || []).map((kind) => kind.id);
  const refocus = focusChipLike(chip);
  const entry = putInTrash({
    kind: 'builtin-food',
    key: item.id,
    label: item.label,
    data: { wasTicked: state.have.includes(item.id), kinds: kindIds.filter((id) => state.have.includes(id)) },
  });
  if (!entry) return;
  state.have = state.have.filter((id) => id !== item.id && !kindIds.includes(id));
  persistKitchen();
  redrawAfterTrashChange();
  refocus();
  announceDeleted(item.label, entry);
}

// A food or cooking basic the student typed. `afterwards` redraws the box it was in.
function deleteOwnFood(food, kind, chip, afterwards) {
  const refocus = focusChipLike(chip);
  const list = OWN_LISTS[kind];
  const names = list.names();
  const entry = putInTrash({
    kind: kind === 'basic' ? 'own-basic' : 'own-food',
    key: food.label,
    label: food.label,
    data: { index: names.indexOf(food.label), wasTicked: state.have.includes(food.id) },
  });
  if (!entry) return;
  list.change(names.filter((name) => name !== food.label));
  state.have = state.have.filter((id) => id !== food.id);
  persistKitchen();
  afterwards();
  renderKitchenBox();
  refocus();
  announceDeleted(food.label, entry);
}

// Any breakfast, built in or the student's own. The student's own one takes its pictures and photos with it
// into the trash, so Restore brings back all of it.
function deleteBreakfast(breakfast, row = null) {
  const rowNumber = row ? [...panelInner.querySelectorAll('.idea-row')].indexOf(row) : -1;
  const favorite = state.favorites.includes(breakfast.id);
  const thing = breakfast.custom
    ? {
        kind: 'own-breakfast',
        key: breakfast.id,
        label: breakfast.name,
        data: {
          breakfast,
          favorite,
          index: state.customBreakfasts.findIndex((other) => other.id === breakfast.id),
          cues: stepCues[breakfast.id] || null,
          media: stepMedia[breakfast.id] || null,
        },
      }
    : { kind: 'builtin-breakfast', key: breakfast.id, label: breakfast.name, data: { favorite } };
  const entry = putInTrash(thing);
  if (!entry) return;
  if (breakfast.custom) {
    state.customBreakfasts = state.customBreakfasts.filter((other) => other.id !== breakfast.id);
    saveCustomBreakfasts(state.customBreakfasts);
    stepCues = removeBreakfastCues(stepCues, breakfast.id);
    saveStepCues(stepCues);
    stepMedia = removeBreakfastMedia(stepMedia, breakfast.id);
    saveStepMedia(stepMedia);
  }
  state.favorites = state.favorites.filter((id) => id !== breakfast.id);
  persistFavorites();
  state.selectedId = null;
  if (state.minutes === null) state.minutes = ANY_TIME;
  renderFavoritesChip();
  if (row) {
    // deleted from the list: stay on the same page of the list, and give the focus to the row that took its place
    renderPanel();
    const rows = [...panelInner.querySelectorAll('.idea-row')];
    if (rows.length > 0) rows[Math.max(0, Math.min(rowNumber, rows.length - 1))].focus();
  } else {
    resetPaging();
    showScreen('results');
  }
  announceDeleted(breakfast.name, entry);
}

// Puts a thing from the trash back where it was. Returns false, and leaves it in the trash, if it cannot come
// back (for example a food with the same name was typed meanwhile).
function restoreEntry(id) {
  const entry = trash.items.find((item) => item.id === id);
  if (!entry) return false;
  const data = entry.data;
  if (entry.kind === 'own-food' || entry.kind === 'own-basic') {
    if (findKnownFood(entry.key)) {
      showToast('Already in the list.');
      return false;
    }
    const list = OWN_LISTS[entry.kind === 'own-basic' ? 'basic' : 'food'];
    const names = [...list.names()];
    const at = Number.isInteger(data.index) && data.index >= 0 ? Math.min(data.index, names.length) : names.length;
    names.splice(at, 0, entry.key);
    list.change(names);
    if (data.wasTicked) state.have = [...state.have, ownFoodId(entry.key)];
    persistKitchen();
  } else if (entry.kind === 'builtin-food') {
    // a kind (oat milk) that was ticked brings its food (milk) back ticked too
    const food = itemIdOfKind(entry.key);
    if (data.wasTicked) state.have = [...new Set([...state.have, entry.key, ...(food ? [food] : []), ...(Array.isArray(data.kinds) ? data.kinds : [])])];
    persistKitchen();
  } else if (entry.kind === 'builtin-breakfast') {
    if (data.favorite && !state.favorites.includes(entry.key)) state.favorites = [...state.favorites, entry.key];
    persistFavorites();
  } else if (entry.kind === 'own-breakfast') {
    const back = data.breakfast;
    if (!isUsableBreakfast(back)) {
      showToast('Could not read it.');
      return false;
    }
    if (!state.customBreakfasts.some((other) => other.id === back.id)) {
      const at = Number.isInteger(data.index) && data.index >= 0 ? Math.min(data.index, state.customBreakfasts.length) : state.customBreakfasts.length;
      state.customBreakfasts = [...state.customBreakfasts.slice(0, at), back, ...state.customBreakfasts.slice(at)];
      saveCustomBreakfasts(state.customBreakfasts);
    }
    if (data.cues) {
      stepCues = { ...stepCues, [back.id]: data.cues };
      saveStepCues(stepCues);
    }
    if (data.media) {
      stepMedia = { ...stepMedia, [back.id]: data.media };
      saveStepMedia(stepMedia);
    }
    if (data.favorite && !state.favorites.includes(back.id)) state.favorites = [...state.favorites, back.id];
    persistFavorites();
  }
  trash = restoreFromTrash(trash, id).trash;
  saveTrash(trash);
  applyTrash();
  return true;
}

// The trash window: what was deleted, how long it stays, and buttons to bring it back or delete it for good.
const TRASH_ICONS = { 'builtin-food': '🍽️', 'own-food': '🍽️', 'own-basic': '🧂', 'builtin-breakfast': '🥣', 'own-breakfast': '🥣' };
const TRASH_KIND_WORDS = { 'builtin-food': 'Food', 'own-food': 'Food', 'own-basic': 'Cooking basic', 'builtin-breakfast': 'Breakfast', 'own-breakfast': 'Breakfast' };

// The name of a thing in the trash in each language: a built-in one has its translations, one you typed has only your words.
function trashNames(entry) {
  if (entry.kind === 'builtin-food') return { chinese: chineseFoods[entry.key], french: frenchFoods[entry.key] };
  if (entry.kind === 'builtin-breakfast') return { chinese: chineseNames[entry.key], french: frenchNames[entry.key] };
  return {};
}

function openTrash() {
  trash = purgeExpired(trash, Date.now()).trash; // the app may have stayed open for days
  saveTrash(trash);
  applyTrash();
  const dialog = newDialog('Trash', 'trashTitle');
  dialog.classList.add('tall');
  dialog.appendChild(buildSay('Things stay here 30 days.', 'Then they are deleted for good.'));
  const listBox = el('div', 'trash-list');
  const extras = el('div', 'trash-extras');
  dialog.append(listBox, extras);

  const done = bilingualEl('button', 'timer-btn', 'Close', 'zh-line');
  done.type = 'button';
  const buttons = el('div', 'modal-buttons');
  buttons.appendChild(done);
  dialog.appendChild(buttons);
  const close = showModal(dialog, done);
  done.addEventListener('click', close);

  function draw() {
    listBox.innerHTML = '';
    extras.innerHTML = '';
    if (trash.items.length === 0) listBox.appendChild(bilingualEl('div', 'trash-empty', 'The trash is empty.', 'zh-line'));
    [...trash.items]
      .sort((a, b) => b.deletedAt - a.deletedAt)
      .forEach((entry) => listBox.appendChild(buildTrashRow(entry, draw)));
    if (trash.items.length > 0) {
      const empty = bilingualEl('button', 'timer-btn ghost trash-empty-btn', 'Empty trash', 'zh-line');
      empty.type = 'button';
      empty.addEventListener('click', () => askToEmptyTrash(draw));
      extras.appendChild(empty);
    }
    if (trash.gone.length > 0) {
      const bringBack = bilingualEl('button', 'link-btn', 'Bring back the built-in ones');
      bringBack.type = 'button';
      bringBack.addEventListener('click', () => {
        trash = bringBackBuiltIn(trash);
        saveTrash(trash);
        applyTrash();
        redrawAfterTrashChange();
        showToast('Restored');
        draw();
      });
      extras.appendChild(bringBack);
    }
  }
  draw();
}

function buildTrashRow(entry, draw) {
  const row = el('div', 'trash-row');
  row.appendChild(taskIcon(TRASH_ICONS[entry.kind]));

  const info = el('div', 'trash-info');
  const names = trashNames(entry);
  const name = el('div', 'trash-name');
  if (names.chinese || names.french) {
    appendEnglishAndChinese(name, entry.label, names.chinese ?? entry.label, 'zh-line', names.french ?? entry.label);
  } else {
    name.textContent = entry.label;
  }
  const days = daysLeft(entry, Date.now());
  const detail = el('div', 'trash-detail' + (days <= SOON_DAYS ? ' soon' : '')); // the last days are marked in red
  appendBilingual(detail, TRASH_KIND_WORDS[entry.kind]);
  detail.append(' · ');
  appendEnglishAndChinese(detail, `${days} day${days === 1 ? '' : 's'} left`, chineseDaysLeft(days), 'zh-inline', frenchDaysLeft(days));
  info.append(name, detail);

  const actions = el('div', 'trash-actions');
  const restore = bilingualEl('button', 'timer-btn trash-restore', 'Restore', 'zh-line');
  restore.type = 'button';
  restore.addEventListener('click', () => {
    if (restoreEntry(entry.id)) {
      redrawAfterTrashChange();
      showToast('Restored');
      draw();
    }
  });
  actions.append(restore);

  row.append(info, actions);
  return row;
}

function askToEmptyTrash(draw) {
  const dialog = newDialog('Empty the trash?', 'emptyTrashTitle');
  dialog.appendChild(bilingualEl('div', 'modal-body', 'You cannot undo this.', 'zh-line'));
  const buttons = el('div', 'modal-buttons');
  const cancel = bilingualEl('button', 'timer-btn ghost', 'Cancel', 'zh-line');
  cancel.type = 'button';
  const confirm = bilingualEl('button', 'timer-btn danger', 'Empty trash', 'zh-line');
  confirm.type = 'button';
  buttons.append(cancel, confirm);
  dialog.appendChild(buttons);
  const close = showModal(dialog, cancel);
  cancel.addEventListener('click', close);
  confirm.addEventListener('click', () => {
    close();
    trash = emptyAll(trash).trash;
    saveTrash(trash);
    applyTrash();
    redrawAfterTrashChange();
    draw();
  });
}

function formField(labelText, input, errorText) {
  const wrap = el('div', 'field');
  const label = bilingualEl('label', '', labelText);
  label.htmlFor = input.id;
  wrap.append(label, input);
  if (errorText) {
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', `${input.id}Error`);
    const error = bilingualEl('div', 'field-error', errorText, 'zh-line');
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
      !saved,
      saved ? chineseSaved(breakfast.name) : undefined,
      saved ? frenchSaved(breakfast.name) : undefined
    );
    showScreen('results');
    return;
  }

  state.selectedId = breakfast.id;
  showToast(
    saved
      ? `Saved "${breakfast.name}"`
      : 'Not saved. It will be lost if you reload.',
    !saved,
    saved ? chineseSaved(breakfast.name) : undefined,
      saved ? frenchSaved(breakfast.name) : undefined
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
  const title = el('div', 'detail-title');
  title.appendChild(englishSpan(b.name, Boolean(chineseNames[b.id]), Boolean(frenchNames[b.id])));
  if (frenchNames[b.id]) title.appendChild(buildFrenchLine(frenchNames[b.id], 'detail-title-fr'));
  head.append(title, buildHeartButton(b, 'in-detail'));
  panelInner.appendChild(head);
  if (chineseNames[b.id]) {
    const name = el('div', 'detail-title-zh', chineseNames[b.id]);
    name.lang = 'zh-Hans';
    panelInner.appendChild(name);
  }
  panelInner.appendChild(
    appendEnglishAndChinese(
      el('div', 'detail-sub'),
      `${b.minutes} minute${b.minutes === 1 ? '' : 's'}`,
      chineseMinutes(b.minutes),
      'zh-inline',
      frenchMinutesLong(b.minutes)
    )
  );

  const needsBox = buildNeedsBox(b);
  if (needsBox) panelInner.appendChild(needsBox);

  const ul = el('ul', 'steps');
  b.steps.forEach((stepText, i) => {
    const li = el('li', 'step' + (state.stepsDone[i] ? ' done' : ''));
    const split = splitStep(stepText);
    const cue = stepCueFor(stepCues, b.id, i, split.text, split.mainEnd);
    const words = el('span', 'step-text');
    const chinese = chineseForStep(split.text);
    const french = frenchForStep(split.text);
    appendStepWords(words, split, cue.marks, Boolean(chinese), Boolean(french));
    if (chinese) words.appendChild(buildStepTranslation(chinese, 'zh-Hans'));
    if (french) words.appendChild(buildStepTranslation(french, 'fr'));
    const time = stepTime(split.text);
    if (time) appendStepTime(words, time);
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

  const del = bilingualEl('button', 'delete-btn', 'Delete this breakfast');
  del.type = 'button';
  del.addEventListener('click', () => deleteBreakfast(b));
  panelInner.appendChild(del);

  updateTimerDisplay();
}

// "What you'll need": ingredients and seasonings, with a tick for what the student has.
// Collapsed so the steps and timer stay high on the screen.
const BASICS_TITLE = 'Salt, oil and more';
let needsOpenFor = null; // the id of the breakfast whose "What you\u2019ll need" box is open

function buildNeedsBox(b) {
  const ingredients = describeNeeds(b.needs, state.have);
  const seasonings = describeNeeds(b.extras, state.have);
  if (ingredients.length + seasonings.length === 0) return null;

  const knowsKitchen = countItems(state.have) > 0;
  const missing = [...ingredients, ...seasonings].filter((need) => !need.have).length;
  const hint = knowsKitchen && missing > 0 ? ` \u00b7 ${missing} missing` : '';

  const box = el('details', 'needs-box');
  // The page is drawn again when a step is ticked or the timer is pressed: the box stays as the cook left it.
  box.open = needsOpenFor === b.id;
  box.addEventListener('toggle', () => {
    needsOpenFor = box.open ? b.id : null;
  });
  const summary = appendEnglishAndChinese(
    el('summary'),
    `What you\u2019ll need (${ingredients.length + seasonings.length})${hint}`,
    chineseNeedsSummary(ingredients.length + seasonings.length, knowsKitchen ? missing : 0),
    'zh-inline',
    frenchNeedsSummary(ingredients.length + seasonings.length, knowsKitchen ? missing : 0)
  );
  box.appendChild(summary);

  [
    ['Ingredients', ingredients],
    [BASICS_TITLE, seasonings],
  ].forEach(([title, list]) => {
    if (list.length === 0) return;
    box.appendChild(bilingualEl('div', 'needs-title', title));
    const ul = el('ul', 'needs-list' + (title === BASICS_TITLE ? ' basics' : ''));
    list.forEach((need) => {
      const mark = !knowsKitchen ? '' : need.have ? '\u2713 ' : '\u2717 ';
      const missingNow = knowsKitchen && !need.have;
      const item = el('li', missingNow ? 'missing' : '');
      item.append(mark);
      appendEnglishAndChinese(
        item,
        `${need.label}${missingNow ? ' (missing)' : ''}`,
        `${chineseNeedLabel(need.need)}${missingNow ? chineseOf('(missing)') : ''}`,
        'zh-inline',
        `${frenchNeedItem(need.need)}${missingNow ? frenchOf('(missing)') : ''}`
      );
      ul.appendChild(item);
    });
    box.appendChild(ul);
  });
  return box;
}

function redrawDetail() {
  panelInner.innerHTML = '';
  renderDetail();
  moveBackButtonToTopBar(); // renderDetail draws a Back button too: it goes up to the bar, not into the page
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
    box.appendChild(bilingualEl('div', 'timer-done', 'Time is up. Eat!', 'zh-line'));
    return box;
  }

  const startBtn = el('button', 'timer-btn');
  if (state.timerRunning) appendBilingual(startBtn, 'Pause', 'zh-line');
  else if (state.timerTotal > 0) appendBilingual(startBtn, 'Resume', 'zh-line');
  else appendEnglishAndChinese(startBtn, `Start ${b.minutes}-minute timer`, chineseStartTimer(b.minutes), 'zh-line', frenchStartTimer(b.minutes));
  startBtn.type = 'button';
  startBtn.addEventListener('click', () => {
    if (state.timerRunning) pauseTimer();
    else startTimer(b.minutes);
    redrawDetail();
  });
  box.appendChild(startBtn);

  if (state.timerTotal > 0) {
    const resetBtn = bilingualEl('button', 'timer-btn ghost', 'Reset', 'zh-line');
    resetBtn.type = 'button';
    resetBtn.addEventListener('click', () => {
      stopTimer();
      redrawDetail();
    });
    box.appendChild(resetBtn);
  }
  return box;
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

function newDialog(titleText, labelId, chineseTitle = chineseOf(titleText), frenchTitle = frenchOf(titleText)) {
  if (frenchTitle === titleText) frenchTitle = null; // the same word in French ("Photo") is shown once
  const dialog = el('div', 'modal');
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', labelId);
  const title = el('div', 'modal-title');
  if (chineseTitle === null && frenchTitle === null) {
    title.textContent = titleText;
  } else {
    title.append(englishSpan(titleText, chineseTitle !== null, frenchTitle !== null), buildLines(chineseTitle, frenchTitle, 'zh-line'));
  }
  title.id = labelId;
  dialog.appendChild(title);
  return dialog;
}

// Day or night (see theme.js): the student's choice is 'day', 'night' or 'auto'. The page gets data-theme="night" on
// <html> when it should look like night, and the colours in styles.css follow from that.
let theme = loadTheme();
const phoneDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');

function applyTheme() {
  const night = isNight(theme, new Date().getHours(), phoneDarkQuery.matches);
  document.documentElement.dataset.theme = night ? 'night' : 'day';
}
applyTheme();
phoneDarkQuery.addEventListener('change', applyTheme); // the phone was switched to or from dark
setInterval(applyTheme, 60 * 1000); // Automatic: the clock can reach 7 pm or 6 am while the page is open

const THEME_OPTIONS = [
  { code: 'day', name: 'Day', detail: 'Light page.' },
  { code: 'night', name: 'Night', detail: 'Dark page.' },
  { code: 'auto', name: 'Automatic', detail: 'Dark phone, or 7 pm to 6 am.' },
];

let language = loadLanguage(); // 'en': English only, 'zh': Chinese only, 'both': English and Chinese together

// English only hides every line of Chinese and French. Chinese only (or French only) hides the English that has
// that language beside it (words with no translation yet stay in English). English with Chinese hides the French;
// English with French hides the Chinese.
function applyLanguage() {
  document.body.classList.remove('only-english', 'only-chinese', 'only-french', 'with-french');
  const chosen = languageClass(language);
  if (chosen) document.body.classList.add(chosen);
}

// Plain text (for the floating message, a form error or a hint inside a box) in the chosen language:
// English, the other language, or both with a dot between. Words with no translation stay in English.
function wordsInChosenLanguage(english, chinese = chineseOf(english), french = frenchOf(english)) {
  const other = language === 'fr' || language === 'en-fr' ? french : chinese;
  if (other === null || other === english || language === 'en') return english;
  return language === 'zh' || language === 'fr' ? other : `${english} \u00b7 ${other}`;
}

// The settings window, opened from the gear at the top right.
function openSettings() {
  const dialog = newDialog('Settings', 'settingsTitle');
  dialog.classList.add('tall');

  // The name of each language is written in that language, and stays visible in every mode.
  const languageHeading = el('div', 'settings-heading');
  languageHeading.append(el('span', 'en en-f', 'Language '), buildChineseLine('语言', 'always-zh'), ' ', buildFrenchLine('Langue', 'always-fr'));
  dialog.appendChild(languageHeading);
  const languageChoices = LANGUAGE_CHOICES.map(({ code, name, nameLanguage, detail }) => {
    const button = el('button', 'settings-option');
    button.type = 'button';
    const label = el('strong', nameLanguage === 'zh-Hans' ? 'always-zh' : nameLanguage === 'fr' ? 'always-fr' : '', name);
    if (nameLanguage) label.lang = nameLanguage;
    button.append(label, bilingualEl('span', '', detail, 'zh-inline'));
    button.addEventListener('click', () => {
      language = code;
      saveLanguage(language);
      applyLanguage();
      refreshLanguage();
    });
    dialog.appendChild(button);
    return { code, button };
  });
  function refreshLanguage() {
    languageChoices.forEach(({ code, button }) => {
      button.classList.toggle('active', language === code);
      button.setAttribute('aria-pressed', String(language === code));
    });
  }
  refreshLanguage();

  dialog.appendChild(bilingualEl('div', 'settings-heading cooking-heading', 'Day or night'));
  const themeChoices = THEME_OPTIONS.map(({ code, name, detail }) => {
    const button = el('button', 'settings-option');
    button.type = 'button';
    button.append(bilingualEl('strong', '', name, 'zh-inline'), bilingualEl('span', '', detail, 'zh-inline'));
    button.addEventListener('click', () => {
      theme = code;
      saveTheme(theme);
      applyTheme();
      refreshTheme();
    });
    dialog.appendChild(button);
    return { code, button };
  });
  function refreshTheme() {
    themeChoices.forEach(({ code, button }) => {
      button.classList.toggle('active', theme === code);
      button.setAttribute('aria-pressed', String(theme === code));
    });
  }
  refreshTheme();

  dialog.appendChild(bilingualEl('div', 'settings-heading cooking-heading', 'Cooking basics'));
  dialog.appendChild(buildSay('If you did not tick one:', 'Salt, oil, sugar and more.'));

  const choices = [
    [false, 'Optional', 'Still show it.'],
    [true, 'Required', 'Hide it.'],
  ];
  const buttons = choices.map(([strict, name, detail]) => {
    const button = el('button', 'settings-option');
    button.type = 'button';
    button.append(bilingualEl('strong', '', name, 'zh-inline'), bilingualEl('span', '', detail, 'zh-inline'));
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

  const done = bilingualEl('button', 'timer-btn settings-done', 'Done', 'zh-line');
  done.type = 'button';
  dialog.appendChild(done);

  const close = showModal(dialog, done);
  done.addEventListener('click', close);
}

document.querySelectorAll('.settings-btn').forEach((button) => {
  button.addEventListener('click', openSettings);
});
document.querySelectorAll('.trash-btn').forEach((button) => {
  button.addEventListener('click', openTrash);
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

// The words of one "Set up tonight" line. A suggested line has its Chinese under the English; a
// line the student wrote stays as they wrote it. `showDetail` adds the small extra line (Choose tasks only).
function appendTaskWords(parent, task, view, showDetail) {
  const chinese = chineseTasks[task];
  const french = frenchTasks[task];
  const translated = Boolean(chinese || french);
  const english = translated ? englishSpan('', Boolean(chinese), Boolean(french)) : parent;
  english.appendChild(richText(view.text));
  if (showDetail && view.detail) english.appendChild(el('span', 'task-detail', view.detail));
  if (!translated) return;
  parent.appendChild(english);
  [[chinese, buildChineseLine], [french, buildFrenchLine]].forEach(([words, build]) => {
    if (!words) return;
    const line = build('', 'zh-line task-zh');
    line.appendChild(richText(words.text));
    if (showDetail && words.detail) line.appendChild(el('span', 'task-detail', words.detail));
    parent.appendChild(line);
  });
}

// The little waiting-time chip on a step, in English and in Chinese.
function appendStepTime(parent, time) {
  const chip = el('span', 'step-time');
  const french = frenchStepTime(time);
  const sameInFrench = french === time; // "2\u20133 min" is written the same way, so it is shown once
  chip.append('\u23F1\uFE0F ', englishSpan(time, true, !sameInFrench), buildChineseLine(chineseStepTime(time), 'zh-inline'));
  if (!sameInFrench) chip.append(buildFrenchLine(french, 'zh-inline'));
  parent.appendChild(chip);
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
  say.appendChild(bilingualEl('div', 'say-main', main, 'zh-line'));
  if (extra) say.appendChild(bilingualEl('div', 'say-small', extra, 'zh-line'));
  return say;
}

function savePrepChoice() {
  savePrepTasks(prepTasks, ownTasks, ownIcons);
}

function renderTaskChooser() {
  panelInner.appendChild(backButton('Back', () => showScreen('home')));
  panelInner.appendChild(bilingualEl('div', 'detail-title', 'Choose tasks', 'zh-line'));
  panelInner.appendChild(buildSay('Tap a line to add it.'));

  renderOwnTasks();

  panelInner.appendChild(bilingualEl('div', 'order-heading', 'Pick from ideas'));
  prepLibrary.forEach((group) => {
    const title = el('div', 'ingredient-group-title task-group-title');
    title.append(taskIcon(group.icon), appendBilingual(el('span'), group.title));
    panelInner.appendChild(title);
    group.tasks.forEach((line) => panelInner.appendChild(buildTaskOption(line.id)));
  });

  const bar = el('div', 'kitchen-actions');
  const count = el('div', 'kitchen-count');
  count.id = 'taskCount';
  count.setAttribute('role', 'status');
  const done = bilingualEl('button', 'timer-btn', 'Done', 'zh-line');
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
  if (!count) return;
  count.textContent = '';
  const english = prepTasks.length === 1 ? '1 task on your list' : `${prepTasks.length} tasks on your list`;
  appendEnglishAndChinese(count, english, chineseTaskCount(prepTasks.length), 'zh-line', frenchTaskCount(prepTasks.length));
}

// One line of the library: a numbered-or-ticked box and the words. Tap to add it to, or take it off, the list.
function buildTaskOption(task) {
  const view = describeTask(task);
  const option = el('button', 'task-option');
  option.type = 'button';
  const box = el('span', 'task-box');
  const words = el('span', 'task-text');
  appendTaskWords(words, task, view, true);
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
  section.appendChild(bilingualEl('div', 'order-heading', 'My own'));
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

    const remove = bilingualEl('button', 'task-remove-btn', 'Remove', 'zh-line');
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
  input.placeholder = wordsInChosenLanguage('e.g. Thaw chicken');
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
  const add = bilingualEl('button', 'timer-btn', 'Add', 'zh-line');
  add.type = 'submit';
  const error = el('div', 'field-error');
  error.id = 'ownTaskError';
  error.setAttribute('role', 'alert');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const onTheList = prepTasks.map((task) => describeTask(task).plain);
    const result = cleanCustomTask(input.value, [...onTheList, ...ownTasks]);
    if (result.error) {
      error.textContent = wordsInChosenLanguage(result.error);
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
  input.placeholder = wordsInChosenLanguage('Or type an emoji');
  input.setAttribute('aria-label', 'Type or paste an emoji');
  const use = bilingualEl('button', 'timer-btn', 'Use it', 'zh-line');
  use.type = 'submit';
  const error = el('div', 'field-error');
  error.setAttribute('role', 'alert');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const icon = cleanTaskIcon(input.value);
    if (!icon) {
      error.textContent = wordsInChosenLanguage('Not an emoji. Try again.');
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

  const cancel = bilingualEl('button', 'timer-btn ghost', 'Cancel', 'zh-line');
  cancel.type = 'button';
  const buttons = el('div', 'modal-buttons');
  buttons.appendChild(cancel);
  dialog.appendChild(buttons);

  close = showModal(dialog, cancel);
  cancel.addEventListener('click', close);
}

// The Chinese or French words under a step, in the same two levels: big words, then small words.
function buildStepTranslation({ main, extra }, language) {
  const box = el('span', 'step-zh');
  box.lang = language;
  const big = el('span', 'zh-main');
  big.appendChild(richText(main)); // French marks the key word between ** **, like the Set up tonight lines
  box.appendChild(big);
  if (extra) box.appendChild(el('span', 'zh-extra', extra));
  return box;
}

// The step's words in two levels: the main part big, and the extra part (if any) small underneath.
function appendStepWords(parent, split, marks, hasChinese = false, hasFrench = false) {
  const { main, extra } = highlightSplit(split, marks);
  const addPieces = (box, pieces) =>
    pieces.forEach((piece) => box.appendChild(piece.mark ? el('strong', '', piece.text) : document.createTextNode(piece.text)));
  const hidden = [hasChinese && 'en', hasFrench && 'en-f'].filter(Boolean).map((name) => ` ${name}`).join('');
  const big = el('span', 'step-main' + hidden);
  addPieces(big, main);
  parent.appendChild(big);
  if (extra.length > 0) {
    const small = el('span', 'step-extra' + hidden);
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
    thumb.addEventListener('click', () => showMedia({ photo: photo || built.file, credit: built, text }));
    row.appendChild(thumb);
  }
  if (video) {
    const play = el('button', 'media-chip play');
    play.append('\u25B6\uFE0F ');
    appendBilingual(play, 'Video');
    play.type = 'button';
    play.addEventListener('click', () => showMedia({ video, text }));
    row.appendChild(play);
  }
  const edit = el('button', 'media-chip edit');
  edit.append(photo || video ? '\u270F\uFE0F ' : '\uD83D\uDCF7 ');
  appendBilingual(edit, photo || video ? 'Edit' : 'Photo or video');
  edit.type = 'button';
  edit.setAttribute('aria-label', `Add or change the photo and video for step ${stepNumber + 1}`);
  edit.addEventListener('click', () => askForStepMedia(breakfast, stepNumber, text));
  row.appendChild(edit);
  return row;
}

// A big view of a step's photo, or its video playing. Close is at the bottom.
function showMedia({ photo, video, credit, text }) {
  const dialog = newDialog(photo ? 'Photo' : 'Video', 'mediaViewTitle');
  dialog.classList.add('tall');
  if (photo) {
    const image = el('img', 'media-big');
    image.src = photo;
    image.alt = photoAltText(text);
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
    const open = bilingualEl('a', 'media-open', 'Open link');
    open.href = video;
    open.target = '_blank';
    open.rel = 'noopener noreferrer';
    dialog.appendChild(open);
  }
  const done = bilingualEl('button', 'timer-btn', 'Close', 'zh-line');
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
  appendBilingual(line, 'Photo: ');
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

  const dialog = newDialog(`Step ${stepNumber + 1}`, 'editMediaTitle', chineseStepNumber(stepNumber + 1), frenchStepNumber(stepNumber + 1));
  dialog.classList.add('tall');

  dialog.appendChild(bilingualEl('div', 'edit-step-heading', 'Photo'));
  const photoBox = el('div', 'photo-box');
  const photoError = el('div', 'field-error');
  photoError.setAttribute('role', 'alert');
  const file = el('input');
  file.type = 'file';
  file.accept = 'image/*';
  file.hidden = true;
  const choose = el('button', 'timer-btn ghost');
  choose.type = 'button';
  const remove = bilingualEl('button', 'media-remove', 'Remove');
  remove.type = 'button';
  function drawPhoto() {
    photoBox.innerHTML = '';
    if (photo) {
      const image = el('img', 'media-preview');
      image.src = photo;
      image.alt = '';
      photoBox.appendChild(image);
    }
    choose.textContent = '';
    appendBilingual(choose, photo ? 'Change photo' : 'Add photo', 'zh-line');
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
        photoError.textContent = wordsInChosenLanguage(error.message);
      }
    );
    file.value = '';
  });
  dialog.append(photoBox, choose, remove, file, photoError);
  drawPhoto();

  dialog.appendChild(bilingualEl('div', 'edit-step-heading', 'Video'));
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
  const cancel = bilingualEl('button', 'timer-btn ghost', 'Cancel', 'zh-line');
  cancel.type = 'button';
  const save = bilingualEl('button', 'timer-btn', 'Save', 'zh-line');
  save.type = 'button';
  buttons.append(cancel, save);
  dialog.appendChild(buttons);

  const close = showModal(dialog, cancel);
  cancel.addEventListener('click', close);
  save.addEventListener('click', () => {
    const link = video.value.trim();
    if (link && !parseVideoLink(link)) {
      videoError.textContent = wordsInChosenLanguage('Use a YouTube, Vimeo or video link.');
      video.setAttribute('aria-invalid', 'true');
      return;
    }
    const next = setStepMedia(stepMedia, breakfast.id, stepNumber, text, { photo, video: link });
    if (!saveStepMedia(next)) {
      photoError.textContent = wordsInChosenLanguage('No room left. Remove a photo.');
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

  const dialog = newDialog(`Step ${stepNumber + 1}`, 'editStepTitle', chineseStepNumber(stepNumber + 1), frenchStepNumber(stepNumber + 1));
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

  dialog.appendChild(bilingualEl('div', 'edit-step-heading', 'Picture'));
  dialog.appendChild(
    buildIconChooser(icon, STEP_ICON_CHOICES, (chosen) => {
      icon = chosen;
      drawPreview();
    })
  );

  dialog.appendChild(bilingualEl('div', 'edit-step-heading', 'Highlighted words'));
  dialog.appendChild(buildSay('Tap words to highlight.'));
  // The words to tap are the English ones. This note is only in the translated languages: it has no English line.
  const englishNote = el('div', 'say-small');
  englishNote.appendChild(buildLines(chineseOf('The words are in English.'), frenchOf('The words are in English.'), 'zh-line'));
  dialog.appendChild(englishNote);
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

  const reset = bilingualEl('button', 'step-reset', 'Reset');
  reset.type = 'button';
  dialog.appendChild(reset);

  const buttons = el('div', 'modal-buttons');
  const cancel = bilingualEl('button', 'timer-btn ghost', 'Cancel', 'zh-line');
  cancel.type = 'button';
  const save = bilingualEl('button', 'timer-btn', 'Save', 'zh-line');
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
  const dialog = newDialog(`Remove "${text}"?`, 'removeOwnTitle', `删除\u201c${text}\u201d？`, frenchRemoveFood(text));
  dialog.appendChild(bilingualEl('div', 'modal-body', 'You cannot undo this.', 'zh-line'));

  const buttons = el('div', 'modal-buttons');
  const cancel = bilingualEl('button', 'timer-btn ghost', 'Cancel', 'zh-line');
  cancel.type = 'button';
  const confirm = bilingualEl('button', 'timer-btn danger', 'Remove', 'zh-line');
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
    prepList.appendChild(bilingualEl('li', 'prep-empty', 'No tasks. Tap Choose tasks.', 'zh-line'));
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
    appendTaskWords(words, text, view, false);
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
  prepReorderBtn.querySelector('.btn-zh[lang="zh-Hans"]').textContent = prepOrdering ? chineseUi.done : chineseUi.changeOrder;
  prepReorderBtn.querySelector('.btn-zh[lang="fr"]').textContent = prepOrdering ? frenchUi.done : frenchUi.changeOrder;
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
  prepSub.append(
    el('strong', 'prep-done-text en en-f', wording.done),
    el('span', 'prep-sep en en-f', ' \u00b7 '),
    el('span', 'prep-left-text en en-f', wording.left)
  );
  const chinese = chineseProgress(done, total);
  const french = frenchProgress(done, total);
  prepSub.appendChild(buildLines(`${chinese.done} \u00b7 ${chinese.left}`, `${french.done} \u00b7 ${french.left}`, 'prep-zh'));
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
applyLanguage();
fillChineseLabels();
renderTagChips();
renderFavoritesChip();
renderKitchenBox();
prepOrderHint.replaceChildren(...buildSay('Tap \u25B2 \u25BC to move a line.', 'Then tap Done.').children);
renderPrep();
