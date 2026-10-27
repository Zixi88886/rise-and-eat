import { legacyPrepIds } from './data.js';
import { migratePrepTask, ownTextsIn } from './prep.js';

// Saves the student's own breakfasts in this browser so they survive a reload.

const STORAGE_KEY = 'rise-and-eat.custom-breakfasts';

// Reads saved breakfasts. Returns [] if nothing is saved or the data is unreadable.
export function loadCustomBreakfasts() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter(isUsableBreakfast) : [];
  } catch {
    return [];
  }
}

// Returns true if the list was saved, false if the browser refused (for example, private mode).
export function saveCustomBreakfasts(breakfasts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(breakfasts));
    return true;
  } catch {
    return false;
  }
}

function isUsableBreakfast(item) {
  return (
    item &&
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    Number.isInteger(item.minutes) &&
    Array.isArray(item.steps)
  );
}

const KITCHEN_KEY = 'rise-and-eat.kitchen';

// Reads what the student has in their kitchen. Returns an empty kitchen if nothing is saved.
export function loadKitchen() {
  try {
    const saved = JSON.parse(localStorage.getItem(KITCHEN_KEY) || '{}');
    const have = Array.isArray(saved.have) ? saved.have.filter((id) => typeof id === 'string') : [];
    return {
      have,
      useKitchen: saved.useKitchen === true,
      strictSeasonings: saved.strictSeasonings === true,
      almostOpen: saved.almostOpen === true,
    };
  } catch {
    return { have: [], useKitchen: false, strictSeasonings: false, almostOpen: false };
  }
}

export function saveKitchen({ have, useKitchen, strictSeasonings, almostOpen }) {
  try {
    localStorage.setItem(KITCHEN_KEY, JSON.stringify({ have, useKitchen, strictSeasonings, almostOpen }));
    return true;
  } catch {
    return false;
  }
}

const FAVORITES_KEY = 'rise-and-eat.favorites';

// Reads the ids of the favorite breakfasts. Whether the Favorites filter is on is not saved,
// so every visit starts by showing all the breakfasts.
export function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '{}');
    return Array.isArray(saved.ids) ? saved.ids.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function saveFavorites(ids) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify({ ids }));
    return true;
  } catch {
    return false;
  }
}

const PREP_KEY = 'rise-and-eat.prep';

// Reads the "Set up tonight" items ticked on the given day (see todayKey). A different day, or
// unreadable data, gives an empty list, so each day starts with nothing ticked.
export function loadPrep(day) {
  try {
    const saved = JSON.parse(localStorage.getItem(PREP_KEY) || '{}');
    if (saved.day !== day || !Array.isArray(saved.checked)) return [];
    return saved.checked
      .filter((item) => typeof item === 'string')
      .map((item) => migratePrepTask(item, legacyPrepIds));
  } catch {
    return [];
  }
}

export function savePrep(day, checked) {
  try {
    localStorage.setItem(PREP_KEY, JSON.stringify({ day, checked }));
    return true;
  } catch {
    return false;
  }
}

const PREP_TASKS_KEY = 'rise-and-eat.prep-tasks';

// Reads the student's chosen "Set up tonight" lines, in order. Returns null when nothing has been
// chosen yet (so the starting list is used); an empty list means they cleared it on purpose.
export function loadPrepTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(PREP_TASKS_KEY) || 'null');
    if (!saved || !Array.isArray(saved.tasks)) return null;
    return saved.tasks
      .filter((task) => typeof task === 'string' && task.length > 0)
      .map((task) => migratePrepTask(task, legacyPrepIds));
  } catch {
    return null;
  }
}

// Saves the lines on the list (tonight's list) and, separately, the student's own lines. An own
// line can be off tonight's list but still saved here, until they remove it for good.
export function savePrepTasks(tasks, own = ownTextsIn(tasks), icons = {}) {
  try {
    localStorage.setItem(PREP_TASKS_KEY, JSON.stringify({ tasks, own, icons }));
    return true;
  } catch {
    return false;
  }
}

// Reads the student's own lines, in the order they were written, including the ones that are
// currently off the list. Data saved before own lines were kept separately is worked out from the list.
export function loadOwnPrepTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(PREP_TASKS_KEY) || 'null');
    if (!saved) return [];
    const savedOwn = Array.isArray(saved.own)
      ? saved.own.filter((text) => typeof text === 'string' && text.length > 0)
      : [];
    return [...new Set([...savedOwn, ...ownTextsIn(loadPrepTasks() ?? [])])];
  } catch {
    return [];
  }
}

// Reads the pictures the student chose for their own lines, as { words: emoji }.
export function loadOwnTaskIcons() {
  try {
    const saved = JSON.parse(localStorage.getItem(PREP_TASKS_KEY) || 'null');
    if (!saved || !saved.icons || typeof saved.icons !== 'object' || Array.isArray(saved.icons)) return {};
    return Object.fromEntries(
      Object.entries(saved.icons).filter(([words, icon]) => typeof icon === 'string' && icon.length > 0 && words.length > 0)
    );
  } catch {
    return {};
  }
}

const STEP_CUES_KEY = 'rise-and-eat.step-cues';

// Reads the pictures and highlighted words the student chose for breakfast steps, as
// { breakfastId: { stepNumber: { text, icon, marks } } }. Anything unreadable is left out.
export function loadStepCues() {
  try {
    const saved = JSON.parse(localStorage.getItem(STEP_CUES_KEY) || '{}');
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {};
    const cues = {};
    Object.entries(saved).forEach(([id, steps]) => {
      if (!steps || typeof steps !== 'object' || Array.isArray(steps)) return;
      Object.entries(steps).forEach(([stepNumber, cue]) => {
        if (!cue || typeof cue.text !== 'string') return;
        const icon = typeof cue.icon === 'string' && cue.icon ? cue.icon : undefined;
        const marks = Array.isArray(cue.marks) ? cue.marks.filter((mark) => Number.isInteger(mark) && mark >= 0) : undefined;
        cues[id] = { ...cues[id], [stepNumber]: { text: cue.text, icon, marks } };
      });
    });
    return cues;
  } catch {
    return {};
  }
}

export function saveStepCues(cues) {
  try {
    localStorage.setItem(STEP_CUES_KEY, JSON.stringify(cues));
    return true;
  } catch {
    return false;
  }
}

const STEP_MEDIA_KEY = 'rise-and-eat.step-media';

// Reads the photos and video links the student added to breakfast steps, as
// { breakfastId: { stepNumber: { text, photo, video } } }. Anything unreadable is left out.
export function loadStepMedia() {
  try {
    const saved = JSON.parse(localStorage.getItem(STEP_MEDIA_KEY) || '{}');
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {};
    const media = {};
    Object.entries(saved).forEach(([id, steps]) => {
      if (!steps || typeof steps !== 'object' || Array.isArray(steps)) return;
      Object.entries(steps).forEach(([stepNumber, item]) => {
        if (!item || typeof item.text !== 'string') return;
        const photo = typeof item.photo === 'string' && item.photo.startsWith('data:image/') ? item.photo : '';
        const video = typeof item.video === 'string' && item.video.startsWith('https://') ? item.video : '';
        if (!photo && !video) return;
        media[id] = { ...media[id], [stepNumber]: { text: item.text, photo, video } };
      });
    });
    return media;
  } catch {
    return {};
  }
}

// Returns false when the browser has no room left (photos are the biggest thing saved).
export function saveStepMedia(media) {
  try {
    localStorage.setItem(STEP_MEDIA_KEY, JSON.stringify(media));
    return true;
  } catch {
    return false;
  }
}
