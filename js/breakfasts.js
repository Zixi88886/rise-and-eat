// Rules for a breakfast the student adds, kept apart from the screen so they are easy to test.

import { INGREDIENT_IDS, SEASONING_ITEM_IDS } from './ingredients.js';

export const MAX_MINUTES = 120;

// The tags a breakfast can have. Sweet and savory never go together, so choosing one clears the other.
export const TAG_OPTIONS = [
  { id: 'no-stove', label: 'No stove' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'high-protein', label: 'High protein' },
  { id: 'sweet', label: 'Sweet' },
  { id: 'savory', label: 'Savory' },
];

const EXCLUSIVE_TAGS = ['sweet', 'savory'];

export function tagLabel(tagId) {
  const option = TAG_OPTIONS.find((tag) => tag.id === tagId);
  return option ? option.label : tagId;
}

// Returns the selected tags after toggling one. Choosing sweet clears savory, and the reverse.
export function toggleTag(selectedTags, tagId) {
  if (selectedTags.includes(tagId)) {
    return selectedTags.filter((id) => id !== tagId);
  }
  const kept = EXCLUSIVE_TAGS.includes(tagId)
    ? selectedTags.filter((id) => !EXCLUSIVE_TAGS.includes(id))
    : selectedTags;
  return [...kept, tagId];
}

// A breakfast fits if it takes at most `maxMinutes` and has every selected tag.
// With `favoriteIds` (a list of ids), the breakfast must also be one of the favorites.
export function matchesFilters(breakfast, maxMinutes, selectedTags, favoriteIds = null) {
  const tags = breakfast.tags || [];
  return (
    breakfast.minutes <= maxMinutes &&
    selectedTags.every((tag) => tags.includes(tag)) &&
    (favoriteIds === null || favoriteIds.includes(breakfast.id))
  );
}

// Adds the id to the favorites, or removes it if it is already there.
export function toggleFavorite(favoriteIds, id) {
  return favoriteIds.includes(id) ? favoriteIds.filter((other) => other !== id) : [...favoriteIds, id];
}

const CUSTOM_ACCENTS = ['#FF8F65', '#FFCE6B', '#6B5B95', '#1B2340'];

// Turns the raw form fields into a breakfast, or explains what is wrong.
// Returns { errors: { name?, minutes?, steps? }, breakfast: object | null }.
export function buildBreakfast({ name, minutes, stepsText, tags = [], needs = [] }, existingCount = 0) {
  const errors = {};

  const cleanName = String(name || '').trim();
  if (!cleanName) {
    errors.name = 'Add a name.';
  }

  const cleanMinutes = Number(minutes);
  if (!Number.isInteger(cleanMinutes) || cleanMinutes < 1 || cleanMinutes > MAX_MINUTES) {
    errors.minutes = `Enter minutes, 1 to ${MAX_MINUTES}.`;
  }

  const steps = String(stepsText || '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  if (steps.length === 0) {
    errors.steps = 'Add a step. One per line.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, breakfast: null };
  }

  return {
    errors,
    breakfast: {
      id: `custom-${Date.now()}-${existingCount}`,
      name: cleanName,
      minutes: cleanMinutes,
      accent: CUSTOM_ACCENTS[existingCount % CUSTOM_ACCENTS.length],
      tags: tags.filter((tag) => TAG_OPTIONS.some((option) => option.id === tag)),
      needs: needs.filter((id) => INGREDIENT_IDS.includes(id) && !SEASONING_ITEM_IDS.includes(id)),
      extras: needs.filter((id) => SEASONING_ITEM_IDS.includes(id)),
      steps,
      custom: true,
    },
  };
}
